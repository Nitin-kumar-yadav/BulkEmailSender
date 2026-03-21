import express from "express";
import { logout, otpVerify, resendOtp, updateUserPassword, userSignin, userSignup } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js"
import { extractFileData } from "../controllers/file.controller.js";
import { uploadCSVExcel } from "../middleware/upload.js";
import { deleteAllEmailData, emailController, getEmailReportData, updateEmailPass } from "../controllers/email.controller.js";
import { composedController } from "../controllers/composed.controller.js";
import { openAIController } from "../controllers/openAI.controller.js";

const router = express.Router();

//TODO: ================= USER ROUTES =================
router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.get('/logout', logout)
router.post('/otp-verification', otpVerify)
router.post('/resend-otp', resendOtp)
router.get('/checkAuth', protectRoute, (req, res) => {
    return res.status(200).json(req.user)
})

//TODO: ================= FILE ROUTES =================
router.post('/upload-file', protectRoute, uploadCSVExcel, extractFileData)

//TODO: ================= EMAIL ROUTES =================
router.post('/email-pass', protectRoute, emailController)
router.post('/composed', protectRoute, composedController)
router.get('/email-report', protectRoute, getEmailReportData)
router.delete('/delete-all-email', protectRoute, deleteAllEmailData)
router.put('/update-email-pass', protectRoute, updateEmailPass)
router.post('/open-ai', protectRoute, openAIController)

export default router;