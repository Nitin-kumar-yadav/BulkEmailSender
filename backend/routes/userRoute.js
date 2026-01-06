import express from "express";
import { logout, otpVerify, resendOtp, userSignin, userSignup } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js"
import { extractFileData } from "../controllers/file.controller.js";
import { uploadCSVExcel } from "../middleware/upload.js";

const router = express.Router();

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.get('/logout', logout)
router.post('/otp-verification', otpVerify)
router.post('/resend-otp', resendOtp)
router.get('/checkAuth', protectRoute, (req, res) => {
    return res.status(200).json(req.user)
})
router.post('/upload-file', uploadCSVExcel, extractFileData)


export default router;