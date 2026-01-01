import express from "express";
import { logout, otpVerify, userSignin, userSignup } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.get('/logout', logout)
router.post('/otp-verification', otpVerify)
router.get('/check', protectRoute, (req, res) => {
    return res.status(200).json(req.user)
})


export default router;