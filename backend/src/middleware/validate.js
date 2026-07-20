import ApiError from "../utils/ApiError.js";

/** Ensure the given fields are present and non-empty in req.body. */
export const requireFields =
  (...fields) =>
  (req, res, next) => {
    const missing = fields.filter((f) => {
      const v = req.body?.[f];
      return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
    });
    if (missing.length) {
      return next(ApiError.badRequest(`Missing required field(s): ${missing.join(", ")}`));
    }
    next();
  };
