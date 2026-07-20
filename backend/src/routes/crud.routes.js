import { Router } from "express";
import {
  getAll,
  getOne,
  getBySlug,
  createOne,
  updateOne,
  deleteOne,
  reorder,
} from "../controllers/factory.js";
import { protect } from "../middleware/auth.js";

/**
 * Builds a REST router for a Mongoose model:
 *   GET    /            → list (public read by default)
 *   GET    /slug/:slug  → by slug (if the model has slugs)
 *   GET    /:id         → one
 *   POST   /            → create   (protected)
 *   PATCH  /:id         → update   (protected)
 *   DELETE /:id         → delete   (protected)
 */
export default function crudRouter(Model, { publicRead = true, hasSlug = false } = {}) {
  const router = Router();
  const read = publicRead ? [] : [protect];

  router.get("/", ...read, getAll(Model));
  if (hasSlug) router.get("/slug/:slug", ...read, getBySlug(Model));
  router.get("/:id", ...read, getOne(Model));

  router.post("/", protect, createOne(Model));
  router.patch("/reorder", protect, reorder(Model)); // before /:id
  router.patch("/:id", protect, updateOne(Model));
  router.delete("/:id", protect, deleteOne(Model));

  return router;
}
