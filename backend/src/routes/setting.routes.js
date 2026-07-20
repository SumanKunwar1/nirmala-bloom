import { Router } from "express";
import { getAllSettings, getSetting, updateSetting } from "../controllers/setting.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Public read (needed to render the public site).
router.get("/", getAllSettings);
router.get("/:key", getSetting);

// Admin write.
router.put("/:key", protect, updateSetting);

export default router;
