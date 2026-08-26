import { Router } from "express";
import { getAll, getOne, deleteOne } from "../controllers/factory.js";
import {
  createPublic,
  createManual,
  setStatus,
  update,
  resendReceipt,
  lookup,
  publicDonors,
  stats,
  exportCsv,
} from "../controllers/donation.controller.js";
import { protect } from "../middleware/auth.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";
import Donation from "../models/Donation.js";

const router = Router();

/* ------------------------------- Public ------------------------------- */

// The donate form posts here. Creates the record AND opens a payment session.
router.post("/", paymentLimiter, createPublic);

// Thank-you page lookup by payment reference.
router.get("/lookup/:reference", lookup);

// Supporter wall.
router.get("/donors", publicDonors);

/* -------------------------------- Admin ------------------------------- */

// Static paths first so they are not swallowed by /:id.
router.get("/stats", protect, stats);
router.get("/export", protect, exportCsv);

router.get("/", protect, getAll(Donation));
router.post("/manual", protect, createManual);

router.get("/:id", protect, getOne(Donation));
router.patch("/:id/status", protect, setStatus);
router.post("/:id/receipt", protect, resendReceipt);
router.patch("/:id", protect, update);
router.delete("/:id", protect, deleteOne(Donation));

export default router;
