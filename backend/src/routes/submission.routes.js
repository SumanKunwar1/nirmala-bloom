import { Router } from "express";
import { getAll, getOne, deleteOne } from "../controllers/factory.js";
import { create, markRead, reply, stats } from "../controllers/submission.controller.js";
import { protect } from "../middleware/auth.js";
import { submitLimiter } from "../middleware/rateLimiter.js";
import Submission from "../models/Submission.js";

const router = Router();

// Public — the contact form posts here.
router.post("/", submitLimiter, create);

// Admin only.
router.get("/stats", protect, stats);
router.get("/", protect, getAll(Submission));
router.get("/:id", protect, getOne(Submission));
router.patch("/:id/read", protect, markRead);
router.post("/:id/reply", protect, reply);
router.delete("/:id", protect, deleteOne(Submission));

export default router;
