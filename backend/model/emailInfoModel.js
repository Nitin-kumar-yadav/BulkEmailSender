import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({});

const emailInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    emailAppPassword: {
        type: String,
    },
    staus: {
        type: String,
        enum: ["success", "failed", "pending"],
        default: "pending"
    },
    emailStore: [
        {
            name: String,
            email: String,
        }
    ]

})

const EmailInfo = mongoose.model("EmailInfo", emailInfoSchema)

export default EmailInfo;
