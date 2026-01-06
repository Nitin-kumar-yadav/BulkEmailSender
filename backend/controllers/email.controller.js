import EmailInfo from "../model/emailInfoModel.js";
import UserModel from "../model/userModel.js";


export const emailController = async (req, res) => {
    const { _id } = req.query;
    const { emailAppPassword } = req.body;
    try {
        if (!_id || !emailAppPassword) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const userInfo = await UserModel.findById(_id);
        if (!userInfo) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        let emailInfo = await EmailInfo.findOne({ userId: _id });
        if (!emailInfo) {
            emailInfo = await EmailInfo.create({ userId: _id });
        }

        emailInfo.emailAppPassword = emailAppPassword;
        await emailInfo.save();

        return res.status(200).json({
            message: "Email APP Password saved"
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

