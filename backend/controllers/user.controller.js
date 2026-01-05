import { emailConnection } from "../lib/emailConnection.js";
import { generateToken } from "../lib/utils.js";
import UserModel from "../model/userModel.js";
import bcrypt from "bcryptjs";

//TODO: ================= SIGNUP =================
export const userSignup = async (req, res) => {
    const { Name, Email, Password } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (Password.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        const existingUser = await UserModel.findOne({ Email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newUser = await UserModel.create({
            Name,
            Email,
            Password: hashedPassword,
            Otp: otp,
            OtpExpiry: otpExpiry,
            isVerified: false,
        });

        const emailSent = await emailConnection(otp, Email);

        if (emailSent.rejected && emailSent.rejected.length > 0) {
            await UserModel.findByIdAndDelete(newUser._id);
            return res.status(400).json({ message: "Invalid email address" });
        }

        return res.status(200).json({
            message: "OTP sent successfully",
            userId: newUser._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

//TODO: ================= SIGNIN =================
export const userSignin = async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await UserModel.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            Name: user.Name,
            Email: user.Email,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};

//TODO: ================= LOGOUT =================
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
            error: error.message,
        });
    }
};

//TODO: ================= OTP VERIFY =================
export const otpVerify = async (req, res) => {
    const { otp } = req.body;
    const { _id } = req.query;

    if (!otp) {
        return res.status(400).json({ message: "OTP is required" });
    }

    try {
        const user = await UserModel.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (user.Otp !== Number(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.OtpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.isVerified = true;
        user.Otp = null;
        user.OtpExpiry = null;
        await user.save();

        generateToken(user._id, res);

        return res.status(200).json({
            message: "OTP verified successfully",
            _id: user._id,
            Name: user.Name,
            Email: user.Email,
        });
    } catch (error) {
        return res.status(500).json({
            message: "OTP verification failed",
            error: error.message,
        });
    }
};
