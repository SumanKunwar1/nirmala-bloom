import { Router } from "express";
import { getAll, deleteOne } from "../controllers/factory.js";
import { subscribe, unsubscribe, stats } from "../controllers/newsletter.controller.js";
import { protect } from "../middleware/auth.js";
import { submitLimiter } from "../middleware/rateLimiter.js";
import Subscriber from "../models/Subscriber.js";

const router = Router();

// Public
router.post("/", submitLimiter, subscribe);
router.post("/unsubscribe", submitLimiter, unsubscribe);

// Admin
router.get("/", protect, getAll(Subscriber));
router.get("/stats", protect, stats);
router.delete("/:id", protect, deleteOne(Subscriber));

export default router;
