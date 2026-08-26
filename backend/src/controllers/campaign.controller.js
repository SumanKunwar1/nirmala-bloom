import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success } from "../utils/ApiResponse.js";
import { syncCampaignTotals, syncAllCampaignTotals } from "../services/donation.service.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";

/**
 * GET /campaigns — public list.
 *
 * Unauthenticated callers see published campaigns only. Admins (any request
 * carrying `?all=true` behind `protect`) get everything, including drafts.
 */
export const list = asyncHandler(async (req, res) => {
  const { all, active, urgent, featured, limit = 100, sort = "order createdAt" } = req.query;

  const filter = {};
  if (!(req.user && all === "true")) filter.published = true;
  if (active !== undefined) filter.active = active === "true";
  if (urgent !== undefined) filter.urgent = urgent === "true";
  if (featured !== undefined) filter.featured = featured === "true";

  const items = await Campaign.find(filter)
    .sort(sort)
    .limit(Math.min(200, Math.max(1, Number(limit))));

  return success(res, items, "Fetched", 200, { total: items.length });
});

/** GET /campaigns/slug/:slug — public detail page. */
export const getBySlug = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({ slug: req.params.slug });
  if (!campaign) throw ApiError.notFound("Campaign not found");
  if (!campaign.published && !req.user) throw ApiError.notFound("Campaign not found");

  return success(res, campaign);
});

/**
 * GET /campaigns/:slug/donors — public wall of supporters.
 * Anonymous gifts are included but stripped of any identifying detail.
 */
export const donors = asyncHandler(async (req, res) => {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));

  const items = await Donation.find({ campaignSlug: req.params.slug, status: "completed" })
    .sort("-completedAt")
    .limit(limit)
    .select("donor amount currency message anonymous completedAt")
    .lean();

  const publicList = items.map((d) => ({
    donor: d.anonymous ? "Anonymous" : d.donor,
    amount: d.anonymous ? null : d.amount,
    currency: d.currency,
    message: d.message || "",
    date: d.completedAt,
  }));

  return success(res, publicList);
});

/**
 * POST /campaigns — admin create.
 * Wrapped rather than using the factory so the derived totals can never be
 * set directly from the request body.
 */
export const create = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create(stripDerived(req.body));
  return success(res, campaign, "Campaign created", 201);
});

/** PATCH /campaigns/:id — admin update. */
export const update = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findByIdAndUpdate(req.params.id, stripDerived(req.body), {
    new: true,
    runValidators: true,
  });
  if (!campaign) throw ApiError.notFound("Campaign not found");
  return success(res, campaign, "Campaign updated");
});

/**
 * DELETE /campaigns/:id — refuses to delete a campaign that holds money,
 * so a financial trail can never be destroyed by a mis-click. Archive
 * (published:false, active:false) instead.
 */
export const remove = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw ApiError.notFound("Campaign not found");

  const donationCount = await Donation.countDocuments({
    campaignSlug: campaign.slug,
    status: { $in: ["completed", "pending", "refunded"] },
  });

  if (donationCount > 0 && req.query.force !== "true") {
    throw ApiError.conflict(
      `This campaign has ${donationCount} donation record(s). Archive it instead, ` +
        `or repeat with ?force=true to delete it anyway (donation records are kept).`,
    );
  }

  await campaign.deleteOne();
  return success(res, null, "Campaign deleted");
});

/** POST /campaigns/recalculate — rebuild denormalized totals from donations. */
export const recalculate = asyncHandler(async (req, res) => {
  if (req.params.slug) {
    const campaign = await syncCampaignTotals(req.params.slug);
    if (!campaign) throw ApiError.notFound("Campaign not found");
    return success(res, campaign, "Campaign totals recalculated");
  }
  const count = await syncAllCampaignTotals();
  return success(res, { campaigns: count }, `Recalculated ${count} campaign(s)`);
});

/** Derived/denormalized fields are owned by the system, never by the client. */
function stripDerived(body = {}) {
  const {
    raisedOnline,
    donorsOnline,
    donationCount,
    lastDonationAt,
    raised,
    donors,
    percent,
    remaining,
    acceptsDonations,
    createdAt,
    updatedAt,
    id,
    _id,
    ...safe
  } = body;
  return safe;
}
