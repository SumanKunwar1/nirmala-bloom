import { Router } from "express";
import { reorder } from "../controllers/factory.js";
import {
  list,
  getBySlug,
  donors,
  create,
  update,
  remove,
  recalculate,
} from "../controllers/campaign.controller.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validate.js";
import Campaign from "../models/Campaign.js";

const router = Router();

/* ------------------------------- Public ------------------------------- */
router.get("/", optionalAuth, list);
router.get("/slug/:slug", optionalAuth, getBySlug);
router.get("/:slug/donors", donors);

/* -------------------------------- Admin ------------------------------- */
router.post("/", protect, requireFields("title", "slug", "goal"), create);
router.post("/recalculate", protect, recalculate);
router.post("/:slug/recalculate", protect, recalculate);
router.patch("/reorder", protect, reorder(Campaign)); // must precede /:id
router.patch("/:id", protect, update);
router.delete("/:id", protect, remove);

export default router;
