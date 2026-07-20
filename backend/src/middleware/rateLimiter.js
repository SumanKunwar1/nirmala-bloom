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
