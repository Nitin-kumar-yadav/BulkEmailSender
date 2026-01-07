import mongoose from "mongoose";

const emailMessageSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        recipients: {
            type: [
                {
                    name: String,
                    email: {
                        type: String,
                        required: true,
                    },
                    status: {
                        type: String,
                        enum: ["pending", "success", "failed"],
                        default: "pending",
                    },
                    error: String,
                }
            ],
            default: []
        }
    },
    { timestamps: true }
);

const emailInfoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: "User",
        },
        emailAppPassword: {
            type: String,
            required: true,
        },
        contacts: {
            type: [
                {
                    name: String,
                    email: {
                        type: String,
                        required: true
                    }
                }
            ],
            default: []
        },
        emailMessages: {
            type: [emailMessageSchema],
            default: []
        }
    },
    { timestamps: true }
);

const EmailInfo = mongoose.model("EmailInfo", emailInfoSchema);
export default EmailInfo;
