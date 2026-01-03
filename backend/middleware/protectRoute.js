import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../model/userModel.js";
dotenv.config();

const protectRoute = async (req, res, next) => {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        return res.status(500).json({
            message: "Environment variable is not available"
        })
    }
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized token"
            })
        }

        const user = await UserModel.findById(decoded.userId).select("Name Email _id")
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized user"
            })
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            message: "Token Decode Function Error",
            error: error.message
        })
    }
}

export default protectRoute