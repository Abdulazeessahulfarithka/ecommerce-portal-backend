import { googleSignup, loginUser, registerUser } from "../Controller/UserController.js";
import express from "express"

const router =express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/google-sign",googleSignup)

export default router