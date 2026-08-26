import { Router } from "express";
import {
  methods,
  callback,
  webhook,
  status,
  retry,
  refund,
  expire,
  reconcile,
  unmatched,
  mockCheckout,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";

const router = Router();

/* ------------------------------- Public ------------------------------- */

// What the donate form renders in its method picker.
router.get("/methods", methods);

// Local checkout simulator — only served while a gateway is in `mock` mode.
router.get("/mock/:reference", mockCheckout);

// The donor's browser returning from the bank. Both verbs: banks differ.
router.get("/callback/:gateway", callback);
router.post("/callback/:gateway", callback);

// Server-to-server notification. Authenticated by HMAC signature, not JWT.
router.post("/webhook/:gateway", webhook);

// Thank-you page polling. `reference` is an unguessable token.
router.get("/:reference/status", status);

// Retry an attempt that failed, expired or was cancelled.
router.post("/:reference/retry", paymentLimiter, retry);

/* -------------------------------- Admin ------------------------------- */
router.get("/unmatched", protect, unmatched);
router.post("/reconcile", protect, reconcile);
router.post("/expire", protect, expire);
router.post("/:reference/refund", protect, refund);

export default router;
