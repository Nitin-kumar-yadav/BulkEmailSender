import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({});

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" })
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })
    return token
}