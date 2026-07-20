import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/ApiResponse.js";
import Setting from "../models/Setting.js";

/** GET /settings — all singleton sections as a keyed object. */
export const getAllSettings = asyncHandler(async (req, res) => {
  const docs = await Setting.find();
  const out = {};
  docs.forEach((d) => {
    out[d.key] = d.data;
  });
  return success(res, out);
});

/** GET /settings/:key — one section (returns {} if not set yet). */
export const getSetting = asyncHandler(async (req, res) => {
  const doc = await Setting.findOne({ key: req.params.key.toLowerCase() });
  return success(res, doc?.data ?? {});
});

/** PUT /settings/:key — upsert a section's data. */
export const updateSetting = asyncHandler(async (req, res) => {
  const doc = await Setting.findOneAndUpdate(
    { key: req.params.key.toLowerCase() },
    { data: req.body },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  return success(res, doc.data, "Updated");
});
