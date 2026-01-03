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
    Otp: {
        type: Number,
        default: null,
        index: true
    },
    OtpExpiry: {
        type: Date,
        default: null
    },

}, { timestamps: true, strictQuery: true });

userSchema.index({ isVerified: 1, isBlocked: 1 }, { OtpExpiry: 1 },
    {
        expireAfterSeconds: 3600,
        partialFilterExpression: { isVerified: false }
    });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
