import jwt from "jsonwebtoken";
import config from "../config/index.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

/** Require a valid JWT (Bearer header or `token` cookie); attaches req.user. */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) token = header.split(" ")[1];
  else if (req.cookies && req.cookies.token) token = req.cookies.token;

  if (!token) throw ApiError.unauthorized("You are not logged in");

  const decoded = jwt.verify(token, config.jwt.secret);
  const user = await User.findById(decoded.id);
  if (!user || !user.active) throw ApiError.unauthorized("This account is no longer available");

  req.user = user;
  next();
});

/**
 * Attach req.user when a valid token is present, but never reject.
 * Lets a public route quietly widen its response for a logged-in admin
 * (e.g. campaigns returning drafts alongside published ones).
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) token = header.split(" ")[1];
  else if (req.cookies && req.cookies.token) token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.id);
      if (user && user.active) req.user = user;
    } catch {
      /* ignore — the caller is simply treated as anonymous */
    }
  }
  next();
});

/** Restrict a route to one or more roles. */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    }
    next();
  };
