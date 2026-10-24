import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { created } from "../utils/ApiResponse.js";
import config from "../config/index.js";

const DATA_URL = /^data:image\/(png|jpe?g|webp|gif|svg\+xml|avif);base64,/i;

/**
 * POST /uploads/image — body { image: "data:image/...;base64,..." }.
 * Stores the image on Cloudinary and returns its CDN url, so content
 * records hold a short link instead of megabytes of base64.
 */
export const uploadImage = asyncHandler(async (req, res) => {
  if (!config.cloudinary.enabled) {
    throw new ApiError(503, "Image uploads are not configured (CLOUDINARY_URL missing)");
  }

  const { image } = req.body || {};
  if (typeof image !== "string" || !DATA_URL.test(image)) {
    throw ApiError.badRequest("Send the image as a base64 data URL in `image`");
  }

  const result = await cloudinary.uploader.upload(image, {
    folder: config.cloudinary.folder,
    resource_type: "image",
  });

  return created(res, {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  });
});
