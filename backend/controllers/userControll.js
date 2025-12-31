import { generateToken } from "../lib/utils.js";
import UserModel from "../model/userModel.js";
import bcrypt from "bcryptjs";


export const userSignup = async (req, res) => {
    const { Name, Email, Password } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    else if (Password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({
            message: "Invalid email format"
        })
    }
    try {
        const user = await UserModel.findOne({ Email })
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        const newUser = await UserModel.create({
            Name,
            Email,
            Password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            return res.status(200).json({
                message: "User created successfully",
                _id: newUser._id,
                Name: newUser.Name,
                Email: newUser.Email,
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const userSignin = async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    try {
        const user = await UserModel.findOne({ Email })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const isPasswordMatched = await bcrypt.compare(Password, user.Password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }
        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            Name: user.Name,
            Email: user.Email,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Login function failed",
            error: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Logout function failed",
            error: error.message
        })
    }
}