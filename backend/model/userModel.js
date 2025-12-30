import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    Password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
        default: null,
        index: true
    },
    isOtpExpired: {
        type: Boolean,
        default: false
    }

}, { timestamps: true, strictQuery: true });

userSchema.index({ isVerified: 1, isBlocked: 1 });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
