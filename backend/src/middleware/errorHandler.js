import mongoose from "mongoose";
import config from "../config/index.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

/** 404 handler for unmatched routes. */
export function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/** Central error handler — normalizes Mongoose/JWT errors into clean JSON. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let error = err;

  if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Invalid value for "${err.path}": ${err.value}`);
  }
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = ApiError.conflict(`Duplicate value for "${field}"`);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest("Validation failed", details);
  }
  if (err && err.name === "JsonWebTokenError") error = ApiError.unauthorized("Invalid token");
  if (err && err.name === "TokenExpiredError") error = ApiError.unauthorized("Token expired");

  if (!(error instanceof ApiError)) {
    error = new ApiError(error.statusCode || 500, error.message || "Internal server error", undefined, false);
  }

  if (error.statusCode >= 500) {
    logger.error(err.stack || err.message);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    ...(config.isProd ? {} : { stack: err.stack }),
  });
}
