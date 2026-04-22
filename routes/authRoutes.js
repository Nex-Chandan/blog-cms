import express from "express"
import { registerUser,loginUser,getProfile } from "../controllers/authController.js";
import authmiddleware from "../middleware/authmiddleware.js"

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);

// protected routes
router.get("/profile",authmiddleware,getProfile)

export default router;