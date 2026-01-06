import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({});

export const composeEmail = async (email) => {

    if (!email) {
        throw new Error("Email is required");
    }


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    await transporter.verify();
    console.log("Email connection verified");
    let info = null;
    try {
        info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP is ${otp}`
        })
        console.log("Email sent successfully");
    } catch (error) {
        console.log(error);
        throw error;
    }
    return info;

}