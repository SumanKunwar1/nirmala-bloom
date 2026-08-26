import rateLimit from "express-rate-limit";
import config from "../config/index.js";

const json = (message) => ({ success: false, message });

/** General API limiter. */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many requests — please try again later."),
  // Gateway traffic arrives in bursts from a small set of bank IPs and must
  // never be throttled — those routes carry their own signature checks.
  skip: (req) => req.path.startsWith("/payments/webhook/") || req.path.startsWith("/payments/callback/"),
});

/** Stricter limiter for auth endpoints (brute-force protection). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many attempts — please try again in a few minutes."),
});

/** Limiter for the public contact form. */
export const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many submissions — please try again later."),
});

/**
 * Opening a payment session writes a Donation + Payment record, so it is
 * rate limited harder than a plain form post.
 */
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.PAYMENT_RATE_LIMIT_MAX || "20", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: json("Too many payment attempts — please wait a few minutes and try again."),
});
