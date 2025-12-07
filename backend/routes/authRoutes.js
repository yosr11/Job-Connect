import express from "express";
import { forgotPassword, verifyToken, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/verify-token", verifyToken);
router.post("/reset-password", resetPassword);

export default router;
