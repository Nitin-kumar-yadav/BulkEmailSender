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
