import { Router } from "express";
import { getAll, getOne, createOne, updateOne, deleteOne } from "../controllers/factory.js";
import { stats, createPublic } from "../controllers/donation.controller.js";
import { protect } from "../middleware/auth.js";
import { submitLimiter } from "../middleware/rateLimiter.js";
import Donation from "../models/Donation.js";

const router = Router();

// Public — the donate form submits here (recorded as pending).
router.post("/", submitLimiter, createPublic);

// Admin — records & analytics.
router.get("/stats", protect, stats);
router.get("/", protect, getAll(Donation));
router.get("/:id", protect, getOne(Donation));
router.post("/manual", protect, createOne(Donation)); // admin adds a record directly
router.patch("/:id", protect, updateOne(Donation));
router.delete("/:id", protect, deleteOne(Donation));

export default router;
