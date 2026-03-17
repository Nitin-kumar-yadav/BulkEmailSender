import EmailInfo from "../model/emailInfoModel.js";
import UserModel from "../model/userModel.js";

export const emailController = async (req, res) => {
    const userId = req.user._id;
    const { emailAppPassword } = req.body;

    try {
        if (!emailAppPassword) {
            return res.status(400).json({
                message: "Email app password is required"
            });
        }

        const userInfo = await UserModel.findById(userId);
        if (!userInfo) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        let emailInfo = await EmailInfo.findOne({ userId });

        if (!emailInfo) {
            emailInfo = new EmailInfo({
                userId,
                emailAppPassword,
                emailMessages: []
            });
        } else {
            emailInfo.emailAppPassword = emailAppPassword;
        }

        await emailInfo.save();

        return res.status(200).json({
            message: "Email app password saved successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const getEmailReportData = async (req, res) => {
    const userId = req.user._id;
    try {
        if (!userId) {
            return res.status(400).json({
                message: "Invalid user"
            });
        }
        const emailInfoData = await EmailInfo.findOne({ userId });
        if (!emailInfoData) {
            return res.status(400).json({
                message: "Email info not found"
            });
        }
        return res.status(200).json({
            message: "Email Report Data",
            data: emailInfoData
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


//:TODO: Delete All Email and Message

export const deleteAllEmailData = async (req, res) => {
    const userId = req.user._id;
    try {
        if (!userId) {
            return res.status(400).json({ message: "Invaild User" })
        }
        const updateResult = await EmailInfo.updateMany({ userId }, { $set: { emailMessages: [], contacts: [] } })
        if (updateResult.matchedCount === 0) {
            return res.status(400).json({ message: "Email info not found" })
        }
        return res.status(200).json({ message: "All email messages deleted successfully", data: updateResult })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateEmailPass = async (req, res) => {
    const userId = req.user._id;
    const { emailAppPassword } = req.body;
    try {
        if (!emailAppPassword) {
            return res.status(400).json({ message: "Email app password is required" })
        }
        const emailInfo = await EmailInfo.findOne({ userId })
        if (!emailInfo) {
            return res.status(400).json({ message: "Email info not found" })
        }
        emailInfo.emailAppPassword = emailAppPassword
        await emailInfo.save()
        return res.status(200).json({ message: "Email app password updated successfully", data: emailInfo })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}