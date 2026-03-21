import EmailInfo from "../model/emailInfoModel.js";
import UserModel from "../model/userModel.js";
import { composeEmail } from "../lib/composeEmail.js";
import cron from "node-cron";

export const composedController = async (req, res) => {
    const { subject, message, scheduleDate, scheduleTime } = req.body;
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
            return res.status(400).json({ message: "Email info not found" });
        }

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!emailInfo.contacts || emailInfo.contacts.length === 0) {
            return res.status(400).json({
                message: "No contacts found. Please upload contacts first."
            });
        }

        /*TODO: ---------- CREATE EMAIL MESSAGE ---------- */

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

        /*TODO: ---------- SCHEDULE LOGIC (FIXED) ---------- */

        if (scheduleDate || scheduleTime) {

            if (!scheduleDate || !scheduleTime) {
                return res.status(400).json({
                    message: "Both scheduleDate and scheduleTime are required for scheduling"
                });
            }

            const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

            if (isNaN(scheduledDateTime.getTime())) {
                return res.status(400).json({
                    message: "Invalid date or time format. Use YYYY-MM-DD and HH:MM"
                });
            }

            if (scheduledDateTime <= new Date()) {
                return res.status(400).json({
                    message: "Scheduled time must be in the future"
                });
            }

            emailInfo.schedule = {
                date: scheduleDate,
                time: scheduleTime,
                status: "scheduled",
                emailMessageId: currentEmail._id
            };

            await emailInfo.save();

            const minutes = scheduledDateTime.getMinutes();
            const hours = scheduledDateTime.getHours();
            const day = scheduledDateTime.getDate();
            const month = scheduledDateTime.getMonth() + 1;

            const cronExpression = `${minutes} ${hours} ${day} ${month} *`;

            const task = cron.schedule(cronExpression, async () => {
                try {
                    const freshEmailInfo = await EmailInfo.findOne({ userId });
                    const freshUser = await UserModel.findById(userId);
                    const targetEmail = freshEmailInfo.emailMessages.id(currentEmail._id);

                    const results = await Promise.allSettled(
                        targetEmail.recipients.map(r =>
                            composeEmail(
                                freshUser.Email,
                                subject,
                                message,
                                freshEmailInfo.emailAppPassword,
                                r.email
                            )
                        )
                    );

                    results.forEach((result, index) => {
                        if (
                            result.status === "fulfilled" &&
                            result.value?.accepted?.length > 0
                        ) {
                            targetEmail.recipients[index].status = "success";
                        } else {
                            targetEmail.recipients[index].status = "failed";
                            targetEmail.recipients[index].error =
                                result.status === "rejected"
                                    ? result.reason?.message || "Email sending failed"
                                    : result.value?.error || "Email sending failed";
                        }
                    });
                    freshEmailInfo.schedule.status = "completed";
                    await freshEmailInfo.save();

                } catch (err) {
                    console.error("Scheduled email error:", err);
                } finally {
                    task.stop();
                }
            });

            return res.status(200).json({
                message: "Campaign scheduled successfully",
                emailId: currentEmail._id,
                scheduledAt: scheduledDateTime
            });
        }

        /*TODO: ---------- SEND EMAILS IMMEDIATELY ---------- */

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

        results.forEach((result, index) => {
            if (
                result.status === "fulfilled" &&
                result.value?.accepted?.length > 0
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
        return res.status(500).json({ message: error.message });
    }
};