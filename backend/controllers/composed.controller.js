import EmailInfo from "../model/emailInfoModel.js";
import UserModel from "../model/userModel.js";
import { composeEmail } from "../lib/composeEmail.js";

export const composedController = async (req, res) => {
    const { subject, message } = req.body;
    const userId = req.user._id;

    try {
        if (!subject || !message) {
            return res.status(400).json({
                message: "Subject and message are required"
            });
        }

        const [emailInfo, user] = await Promise.all([
            EmailInfo.findOne({ userId }),
            UserModel.findById(userId)
        ]);

        if (!emailInfo) {
            return res.status(400).json({
                message: "Email info not found"
            });
        }

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        /* ---------- CONTACTS CHECK (FIXED) ---------- */

        if (!emailInfo.contacts || emailInfo.contacts.length === 0) {
            return res.status(400).json({
                message: "No contacts found. Please upload contacts first."
            });
        }

        /* ---------- CREATE EMAIL MESSAGE ---------- */

        const emailDoc = {
            subject,
            message,
            recipients: emailInfo.contacts.map(c => ({
                name: c.name,
                email: c.email,
                status: "pending"
            }))
        };

        emailInfo.emailMessages.push(emailDoc);
        const currentEmail = emailInfo.emailMessages.at(-1);

        /* ---------- SEND EMAILS ---------- */

        const results = await Promise.allSettled(
            currentEmail.recipients.map(r =>
                composeEmail(
                    user.Email,
                    subject,
                    message,
                    emailInfo.emailAppPassword,
                    r.email
                )
            )
        );

        /* ---------- UPDATE PER-RECIPIENT STATUS ---------- */

        results.forEach((result, index) => {
            if (
                result.status === "fulfilled" &&
                result.value?.response === "OK"
            ) {
                currentEmail.recipients[index].status = "success";
            } else {
                currentEmail.recipients[index].status = "failed";
                currentEmail.recipients[index].error =
                    result.reason?.message || "Email sending failed";
            }
        });

        await emailInfo.save();

        return res.status(200).json({
            message: "Email processed successfully",
            emailId: currentEmail._id,
            totalRecipients: currentEmail.recipients.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
};
