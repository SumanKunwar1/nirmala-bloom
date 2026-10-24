import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Admin only — the public site never uploads.
router.post("/image", protect, uploadImage);

export default router;
