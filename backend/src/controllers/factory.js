import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success, created } from "../utils/ApiResponse.js";

/** Fields that are safe to filter on via query string. */
const FILTERABLE = [
  "published", "category", "status", "campaignSlug", "featured", "read", "region", "type",
  "gateway", "currency", "needsReview", "source", "recurring", "active", "urgent",
];

/**
 * True when this request may see unpublished records: the model has no
 * `published` field at all, or a signed-in admin is asking.
 *
 * Public reads run through `optionalAuth`, so `req.user` is set for an admin
 * and absent for everyone else.
 */
function canSeeDrafts(Model, req) {
  return !Model.schema.path("published") || !!req.user;
}

/**
 * GET /  — list with optional filtering, full-text search (?q=),
 * sorting (?sort=), and pagination (?page=&limit=).
 */
export const getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 200, sort = "order createdAt", q } = req.query;

    const filter = {};
    FILTERABLE.forEach((field) => {
      if (req.query[field] !== undefined) {
        const v = req.query[field];
        filter[field] = v === "true" ? true : v === "false" ? false : v;
      }
    });
    if (q) filter.$text = { $search: String(q) };

    // Drafts are never public. Forced last so `?published=false` cannot be
    // used by an anonymous caller to read unpublished content.
    if (!canSeeDrafts(Model, req)) filter.published = true;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(500, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip(skip).limit(limitNum),
      Model.countDocuments(filter),
    ]);

    return success(res, items, "Fetched", 200, {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  });

/** GET /:id — an unpublished record reads as missing to the public. */
export const getOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);
    if (doc.published === false && !canSeeDrafts(Model, req)) {
      throw ApiError.notFound(`${Model.modelName} not found`);
    }
    return success(res, doc);
  });

/** GET /slug/:slug — for models that have a `slug` field. */
export const getBySlug = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findOne({ slug: req.params.slug });
    if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);
    if (doc.published === false && !canSeeDrafts(Model, req)) {
      throw ApiError.notFound(`${Model.modelName} not found`);
    }
    return success(res, doc);
  });

/** POST / */
export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    return created(res, doc, `${Model.modelName} created`);
  });

/** PATCH /:id */
export const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);
    return success(res, doc, `${Model.modelName} updated`);
  });

/** DELETE /:id */
export const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);
    return success(res, null, `${Model.modelName} deleted`);
  });

/**
 * GET /categories — distinct values of a field, with a count for each.
 *
 * Lets a listing page build its filter tabs from real data instead of a
 * hardcoded list, so a category an admin invents shows up on its own.
 */
export const distinctField = (Model, field = "category", { publishedOnly = true } = {}) =>
  asyncHandler(async (req, res) => {
    const match = {};
    // Respect publishing where the model supports it, unless an admin asks.
    if (publishedOnly && Model.schema.path("published") && !(req.user && req.query.all === "true")) {
      match.published = true;
    }

    const rows = await Model.aggregate([
      { $match: match },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $match: { _id: { $nin: [null, ""] } } },
      { $sort: { count: -1, _id: 1 } },
      { $project: { _id: 0, value: "$_id", count: 1 } },
    ]);

    const total = rows.reduce((sum, r) => sum + r.count, 0);
    return success(res, { total, values: rows });
  });

/** PATCH /reorder — bulk-set `order` from an array of { id, order }. */
export const reorder = (Model) =>
  asyncHandler(async (req, res) => {
    const items = req.body.items;
    if (!Array.isArray(items) || items.length === 0) {
      throw ApiError.badRequest("An `items` array of { id, order } is required");
    }
    await Promise.all(
      items.map((it, i) =>
        Model.findByIdAndUpdate(it.id, { order: Number.isFinite(it.order) ? it.order : i }),
      ),
    );
    return success(res, null, `${Model.modelName} order updated`);
  });
