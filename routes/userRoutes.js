import { Router } from "express";
import { getUserData, registerUser, verifyEmail } from "../controllers/userController.js";

import { loginUser } from "../controllers/userController.js";
const router=  Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verifyEmail").post(verifyEmail)
router.route("/getUserDetails").post(getUserData)

export default router