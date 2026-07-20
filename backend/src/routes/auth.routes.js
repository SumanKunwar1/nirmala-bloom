import { Router } from "express";
import { login, register, me, logout, updatePassword } from "../controllers/auth.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.patch("/password", protect, updatePassword);
router.post("/register", protect, authorize("admin"), register);

export default router;
