import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const composeEmail = async (
    fromEmail,
    subject,
    message,
    appPassword,
    toEmail
) => {

    if (!fromEmail) throw new Error("Sender email is required");
    if (!subject) throw new Error("Subject is required");
    if (!message) throw new Error("Message is required");
    if (!appPassword) throw new Error("App password is required");
    if (!toEmail) throw new Error("Recipient email is required");

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: fromEmail,
            pass: appPassword
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"Email Sender" <${fromEmail}>`,
            to: toEmail,
            subject,
            text: message
        });

        return {
            accepted: info.accepted,
            rejected: info.rejected
        };

    } catch (error) {
        throw error;
    }
};
