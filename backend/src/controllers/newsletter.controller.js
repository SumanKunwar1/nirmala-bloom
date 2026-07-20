import validator from "validator";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success, created } from "../utils/ApiResponse.js";
import { sendMail, notifyAdmin } from "../utils/mailer.js";
import Subscriber from "../models/Subscriber.js";

/** POST /newsletter — PUBLIC subscribe (idempotent). */
export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  if (!validator.isEmail(email)) throw ApiError.badRequest("Please provide a valid email");

  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.active) return success(res, { id: existing.id }, "You're already subscribed.");
    existing.active = true;
    await existing.save();
    return success(res, { id: existing.id }, "Welcome back — you're subscribed again.");
  }

  const sub = await Subscriber.create({
    email,
    name: req.body.name || "",
    source: req.body.source || "footer",
  });

  // Fire-and-forget notifications (safe if SMTP is off).
  sendMail({
    to: email,
    subject: "You're subscribed — Nirmala Foundation",
    text: "Thank you for subscribing to Nirmala Foundation Nepal. You'll receive monthly stories and updates.",
  });
  notifyAdmin({ subject: "New newsletter subscriber", text: `New subscriber: ${email}` });

  return created(res, { id: sub.id }, "Thanks for subscribing!");
});

/** POST /newsletter/unsubscribe — PUBLIC. */
export const unsubscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  const sub = await Subscriber.findOne({ email });
  if (sub) {
    sub.active = false;
    await sub.save();
  }
  return success(res, null, "You've been unsubscribed.");
});

/** GET /newsletter/stats — admin. */
export const stats = asyncHandler(async (req, res) => {
  const [total, active] = await Promise.all([
    Subscriber.countDocuments(),
    Subscriber.countDocuments({ active: true }),
  ]);
  return success(res, { total, active });
});
