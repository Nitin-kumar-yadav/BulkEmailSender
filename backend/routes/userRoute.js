import express from "express";
import { logout, userSignin, userSignup } from "../controllers/userControll.js";
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.get('/logout', logout)
router.get('/check', protectRoute, (req, res) => {
    return res.status(200).json(req.user)
})


export default router;