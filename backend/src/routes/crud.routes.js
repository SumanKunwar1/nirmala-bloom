import { Router } from "express";
import {
  getAll,
  getOne,
  getBySlug,
  createOne,
  updateOne,
  deleteOne,
  reorder,
  distinctField,
} from "../controllers/factory.js";
import { protect, optionalAuth } from "../middleware/auth.js";

/**
 * Builds a REST router for a Mongoose model:
 *   GET    /            → list (public read by default)
 *   GET    /categories  → distinct categories + counts (if `hasCategories`)
 *   GET    /slug/:slug  → by slug (if the model has slugs)
 *   GET    /:id         → one
 *   POST   /            → create   (protected)
 *   PATCH  /:id         → update   (protected)
 *   DELETE /:id         → delete   (protected)
 */
export default function crudRouter(
  Model,
  { publicRead = true, hasSlug = false, hasCategories = false } = {},
) {
  const router = Router();
  // optionalAuth never rejects — it just identifies an admin so the
  // controllers can widen a public read to include drafts.
  const read = publicRead ? [optionalAuth] : [protect];

  router.get("/", ...read, getAll(Model));
  // Static segments must be declared before the /:id catch-all.
  if (hasCategories) router.get("/categories", ...read, distinctField(Model, "category"));
  if (hasSlug) router.get("/slug/:slug", ...read, getBySlug(Model));
  router.get("/:id", ...read, getOne(Model));

  router.post("/", protect, createOne(Model));
  router.patch("/reorder", protect, reorder(Model)); // before /:id
  router.patch("/:id", protect, updateOne(Model));
  router.delete("/:id", protect, deleteOne(Model));

  return router;
}
