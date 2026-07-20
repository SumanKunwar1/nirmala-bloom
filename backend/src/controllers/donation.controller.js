import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success, created } from "../utils/ApiResponse.js";
import { notifyAdmin } from "../utils/mailer.js";
import Donation from "../models/Donation.js";

/**
 * POST /donations — PUBLIC donation submission (from the donate form).
 * Always recorded as `pending`; an admin verifies/marks it completed.
 */
export const createPublic = asyncHandler(async (req, res) => {
  const { donor, amount, email, campaignSlug, campaignTitle, method, anonymous, message } = req.body;
  const amt = Number(amount);
  if (!amt || amt <= 0) throw ApiError.badRequest("A valid donation amount is required");
  if (!anonymous && !donor) throw ApiError.badRequest("Please provide your name (or donate anonymously)");

  const doc = await Donation.create({
    donor: anonymous ? "Anonymous" : donor,
    email: email || "",
    amount: amt,
    campaignSlug: campaignSlug || "general-fund",
    campaignTitle: campaignTitle || "General Fund",
    method: method || "Online",
    anonymous: !!anonymous,
    message: message || "",
    status: "pending",
  });

  notifyAdmin({
    subject: "New donation received",
    text: `${doc.donor} donated Rs ${amt.toLocaleString()} to ${doc.campaignTitle}.`,
  });

  return created(res, { id: doc.id }, "Thank you for your generous donation!");
});

/** GET /donations/stats — totals, donors, average, pending, by-campaign. */
export const stats = asyncHandler(async (req, res) => {
  const [totals] = await Donation.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        raised: { $sum: "$amount" },
        count: { $sum: 1 },
        donors: { $addToSet: "$email" },
      },
    },
    { $project: { _id: 0, raised: 1, count: 1, donors: { $size: "$donors" } } },
  ]);

  const [pendingAgg] = await Donation.aggregate([
    { $match: { status: "pending" } },
    { $group: { _id: null, pending: { $sum: "$amount" } } },
  ]);

  const byCampaign = await Donation.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$campaignSlug",
        title: { $first: "$campaignTitle" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $project: { _id: 0, slug: "$_id", title: 1, total: 1, count: 1 } },
  ]);

  const raised = totals?.raised || 0;
  const count = totals?.count || 0;

  return success(res, {
    raised,
    donors: totals?.donors || 0,
    count,
    average: count ? Math.round(raised / count) : 0,
    pending: pendingAgg?.pending || 0,
    byCampaign,
  });
});
