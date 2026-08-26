import config from "../config/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success, created } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { resolveAmount, formatMoney } from "../utils/money.js";
import { notifyAdmin } from "../utils/mailer.js";
import { getGateway } from "../services/payments/index.js";
import { startPayment } from "./payment.controller.js";
import {
  syncCampaignTotals,
  issueReceiptNumber,
  sendReceipt,
} from "../services/donation.service.js";

import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import Payment from "../models/Payment.js";

/* ------------------------------------------------------------------ *
 * Public donate flow
 * ------------------------------------------------------------------ */

/**
 * POST /donations — PUBLIC.
 *
 * Creates the donation record, opens a payment session with the chosen
 * gateway, and returns everything the browser needs to continue:
 *   - redirect gateways  → `checkout.checkoutUrl`
 *   - offline transfers  → `checkout.instructions`
 *
 * The donation stays `pending` until the gateway confirms it server-side.
 */
export const createPublic = asyncHandler(async (req, res) => {
  const {
    donor,
    email,
    phone,
    country,
    address,
    amount,
    currency,
    campaignSlug,
    gateway: gatewayKey,
    instrument,
    anonymous,
    message,
    dedicateTo,
    recurring,
    frequency,
  } = req.body;

  const isAnonymous = !!anonymous;
  if (!isAnonymous && !String(donor || "").trim()) {
    throw ApiError.badRequest("Please provide your name (or donate anonymously)");
  }

  // Validates the amount, the currency and the FX conversion in one step.
  const money = resolveAmount(amount, currency);

  // Resolve the campaign so the donation can never point at a closed or
  // non-existent fund. Falls back to the general fund when none is named.
  const campaign = await resolveCampaign(campaignSlug);

  // Fail fast on an unusable gateway BEFORE writing a donation record.
  const gateway = getGateway(gatewayKey);

  const donation = await Donation.create({
    donor: isAnonymous ? "Anonymous" : String(donor).trim(),
    email: email || "",
    phone: phone || "",
    country: country || "",
    address: address || "",
    amount: money.amount,
    currency: money.currency,
    baseAmount: money.baseAmount,
    baseCurrency: money.baseCurrency,
    fxRate: money.fxRate,
    campaign: campaign?._id || null,
    campaignSlug: campaign?.slug || "general-fund",
    campaignTitle: campaign?.title || "General Fund",
    gateway: gateway.key,
    method: gateway.label,
    anonymous: isAnonymous,
    message: message || "",
    dedicateTo: dedicateTo || "",
    recurring: !!recurring,
    frequency: recurring ? frequency || "monthly" : "one-time",
    source: "web",
    status: "pending",
  });

  const { checkout } = await startPayment({ donation, gatewayKey: gateway.key, instrument, req });

  logger.info(
    `[donation] started ${checkout.reference} ${formatMoney(money.amount, money.currency)} via ${gateway.key}`,
  );

  return created(
    res,
    {
      id: donation.id,
      reference: checkout.reference,
      status: donation.status,
      amount: donation.amount,
      currency: donation.currency,
      campaignSlug: donation.campaignSlug,
      campaignTitle: donation.campaignTitle,
      checkout,
    },
    gateway.kind === "offline"
      ? "Donation recorded — please complete the transfer using the details shown."
      : "Redirecting you to a secure payment page…",
  );
});

/**
 * GET /donations/lookup/:reference — PUBLIC thank-you page lookup.
 * Mirrors the payment status route but returns the donation view.
 */
export const lookup = asyncHandler(async (req, res) => {
  const donation = await Donation.findOne({ reference: req.params.reference });
  if (!donation) throw ApiError.notFound("Donation not found");

  return success(res, {
    reference: donation.reference,
    status: donation.status,
    donor: donation.anonymous ? "Anonymous" : donation.donor,
    amount: donation.amount,
    currency: donation.currency,
    formattedAmount: formatMoney(donation.amount, donation.currency),
    campaignSlug: donation.campaignSlug,
    campaignTitle: donation.campaignTitle,
    method: donation.method,
    receiptNo: donation.receiptNo,
    message: donation.message,
    completedAt: donation.completedAt,
    createdAt: donation.createdAt,
  });
});

/**
 * GET /donations/donors — PUBLIC site-wide supporter wall.
 *
 * Anonymous gifts are counted but never named, and no amounts are exposed —
 * this is a thank-you list, not a leaderboard.
 */
export const publicDonors = asyncHandler(async (req, res) => {
  const limit = Math.min(60, Math.max(1, Number(req.query.limit || 24)));

  const [named, anonAgg] = await Promise.all([
    Donation.find({ status: "completed", anonymous: false })
      .sort("-completedAt")
      .limit(limit)
      .select("donor campaignTitle completedAt")
      .lean(),
    Donation.aggregate([
      { $match: { status: "completed", anonymous: true } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]),
  ]);

  // Collapse repeat donors to a single entry, keeping their latest gift date.
  const seen = new Map();
  named.forEach((d) => {
    if (!seen.has(d.donor)) seen.set(d.donor, { name: d.donor, date: d.completedAt });
  });

  return success(res, {
    donors: [...seen.values()],
    anonymousCount: anonAgg[0]?.count || 0,
  });
});

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

/**
 * POST /donations/manual — admin records an offline gift (cash, cheque,
 * a transfer that already landed). Completes immediately unless told
 * otherwise, and issues a receipt just like an online donation.
 */
export const createManual = asyncHandler(async (req, res) => {
  const { donor, amount, currency, campaignSlug, status = "completed" } = req.body;

  if (!String(donor || "").trim() && !req.body.anonymous) {
    throw ApiError.badRequest("A donor name is required");
  }

  const money = resolveAmount(amount, currency);
  const campaign = await resolveCampaign(campaignSlug, { requireOpen: false });

  const donation = await Donation.create({
    ...req.body,
    donor: req.body.anonymous ? "Anonymous" : String(donor).trim(),
    amount: money.amount,
    currency: money.currency,
    baseAmount: money.baseAmount,
    baseCurrency: money.baseCurrency,
    fxRate: money.fxRate,
    campaign: campaign?._id || null,
    campaignSlug: campaign?.slug || "general-fund",
    campaignTitle: campaign?.title || "General Fund",
    gateway: req.body.gateway || "manual",
    method: req.body.method || "Bank transfer",
    source: "manual",
    status,
    completedAt: status === "completed" ? new Date() : null,
    verifiedBy: req.user?._id || null,
    verifiedAt: status === "completed" ? new Date() : null,
  });

  if (status === "completed") {
    donation.receiptNo = await issueReceiptNumber(donation.completedAt);
    await donation.save();
    await syncCampaignTotals(donation.campaignSlug);
    sendReceipt(donation).catch((e) => logger.error("[receipt]", e.message));
  }

  return created(res, donation, "Donation recorded");
});

/**
 * PATCH /donations/:id/status — admin marks a donation completed, refunded,
 * failed or back to pending. This is how an offline bank transfer gets
 * confirmed once the money shows up on the statement.
 */
export const setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "completed", "failed", "cancelled", "refunded"];
  if (!allowed.includes(status)) {
    throw ApiError.badRequest(`status must be one of: ${allowed.join(", ")}`);
  }

  const donation = await Donation.findById(req.params.id);
  if (!donation) throw ApiError.notFound("Donation not found");

  const wasCompleted = donation.status === "completed";
  donation.status = status;

  if (status === "completed" && !wasCompleted) {
    donation.completedAt = new Date();
    donation.verifiedBy = req.user?._id || null;
    donation.verifiedAt = new Date();
    if (!donation.receiptNo) donation.receiptNo = await issueReceiptNumber(donation.completedAt);
  }
  if (status === "refunded") donation.refundedAt = new Date();

  await donation.save();

  // Keep the linked payment ledger consistent with the admin's decision.
  if (donation.payment) {
    const map = { completed: "success", refunded: "refunded", failed: "failed", cancelled: "cancelled", pending: "pending" };
    await Payment.findByIdAndUpdate(donation.payment, {
      status: map[status],
      settledAt: status === "pending" ? null : new Date(),
    });
  }

  await syncCampaignTotals(donation.campaignSlug);

  if (status === "completed" && !wasCompleted) {
    sendReceipt(donation).catch((e) => logger.error("[receipt]", e.message));
    notifyAdmin({
      subject: `Donation verified — ${formatMoney(donation.amount, donation.currency)}`,
      text: `${donation.donor} · ${donation.campaignTitle} · receipt ${donation.receiptNo}`,
    }).catch(() => {});
  }

  return success(res, donation, `Donation marked ${status}`);
});

/**
 * PATCH /donations/:id — admin edit.
 *
 * A `status` in the body is delegated to setStatus so campaign totals,
 * receipts and the payment ledger stay consistent no matter which endpoint
 * the admin UI happens to call.
 */
export const update = asyncHandler(async (req, res, next) => {
  const { status, ...rest } = req.body || {};

  if (Object.keys(rest).length) {
    // Remember where the money was attributed BEFORE the edit — moving a
    // donation between campaigns has to resync both, or the source campaign
    // keeps counting money it no longer holds.
    const before = await Donation.findById(req.params.id).select("campaignSlug").lean();
    if (!before) throw ApiError.notFound("Donation not found");

    const donation = await Donation.findByIdAndUpdate(req.params.id, stripDerived(rest), {
      new: true,
      runValidators: true,
    });
    if (!donation) throw ApiError.notFound("Donation not found");

    // Editing the amount, the rate or the campaign all move money between totals.
    if (rest.amount !== undefined || rest.campaignSlug !== undefined || rest.fxRate !== undefined) {
      const affected = new Set([before.campaignSlug, donation.campaignSlug].filter(Boolean));
      await Promise.all([...affected].map((slug) => syncCampaignTotals(slug)));
    }
    if (!status) return success(res, donation, "Donation updated");
  }

  return setStatus(req, res, next);
});

/** POST /donations/:id/receipt — admin re-sends the receipt email. */
export const resendReceipt = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) throw ApiError.notFound("Donation not found");
  if (donation.status !== "completed") throw ApiError.badRequest("Only completed donations have a receipt");
  if (!donation.email) throw ApiError.badRequest("This donation has no email address on file");

  if (!donation.receiptNo) {
    donation.receiptNo = await issueReceiptNumber(donation.completedAt || new Date());
    await donation.save();
  }

  const result = await sendReceipt(donation);
  return success(res, result, result.skipped ? "SMTP is off — receipt logged only" : "Receipt sent");
});

/**
 * GET /donations/stats — dashboard figures.
 * Everything is aggregated on `baseAmount`, so multi-currency giving totals
 * correctly rather than adding rupees to dollars.
 */
export const stats = asyncHandler(async (req, res) => {
  const [totals] = await Donation.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        raised: { $sum: "$baseAmount" },
        count: { $sum: 1 },
        donors: { $addToSet: { $ifNull: ["$email", "$_id"] } },
      },
    },
    { $project: { _id: 0, raised: 1, count: 1, donors: { $size: "$donors" } } },
  ]);

  const [pendingAgg] = await Donation.aggregate([
    { $match: { status: "pending" } },
    { $group: { _id: null, pending: { $sum: "$baseAmount" }, pendingCount: { $sum: 1 } } },
  ]);

  const byCampaign = await Donation.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$campaignSlug",
        title: { $first: "$campaignTitle" },
        total: { $sum: "$baseAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $project: { _id: 0, slug: "$_id", title: 1, total: 1, count: 1 } },
  ]);

  const byGateway = await Donation.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$gateway", total: { $sum: "$baseAmount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $project: { _id: 0, gateway: { $ifNull: ["$_id", "unknown"] }, total: 1, count: 1 } },
  ]);

  const byCurrency = await Donation.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$currency", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, currency: "$_id", total: 1, count: 1 } },
  ]);

  // Last 12 months, for the dashboard trend chart.
  const since = new Date();
  since.setMonth(since.getMonth() - 11, 1);
  since.setHours(0, 0, 0, 0);

  const monthly = await Donation.aggregate([
    { $match: { status: "completed", completedAt: { $gte: since } } },
    {
      $group: {
        _id: { y: { $year: "$completedAt" }, m: { $month: "$completedAt" } },
        total: { $sum: "$baseAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.y" },
            "-",
            { $cond: [{ $lt: ["$_id.m", 10] }, { $concat: ["0", { $toString: "$_id.m" }] }, { $toString: "$_id.m" }] },
          ],
        },
        total: 1,
        count: 1,
      },
    },
  ]);

  const recent = await Donation.find({ status: "completed" })
    .sort("-completedAt")
    .limit(5)
    .select("donor amount currency campaignTitle anonymous completedAt")
    .lean();

  const raised = totals?.raised || 0;
  const count = totals?.count || 0;

  return success(res, {
    currency: config.payments.baseCurrency,
    raised,
    donors: totals?.donors || 0,
    count,
    average: count ? Math.round(raised / count) : 0,
    pending: pendingAgg?.pending || 0,
    pendingCount: pendingAgg?.pendingCount || 0,
    byCampaign,
    byGateway,
    byCurrency,
    monthly,
    recent: recent.map((d) => ({
      donor: d.anonymous ? "Anonymous" : d.donor,
      amount: d.amount,
      currency: d.currency,
      campaignTitle: d.campaignTitle,
      date: d.completedAt,
    })),
  });
});

/** GET /donations/export — CSV of donation records for accounting. */
export const exportCsv = asyncHandler(async (req, res) => {
  const { status, campaignSlug, from, to } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (campaignSlug) filter.campaignSlug = campaignSlug;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const rows = await Donation.find(filter).sort("-createdAt").limit(10000).lean();

  const columns = [
    "receiptNo", "reference", "createdAt", "completedAt", "status", "donor", "email", "phone",
    "country", "amount", "currency", "baseAmount", "baseCurrency", "fxRate",
    "campaignSlug", "campaignTitle", "gateway", "method", "anonymous", "recurring", "frequency", "message",
  ];

  const csv = [
    columns.join(","),
    ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(",")),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="donations-${new Date().toISOString().slice(0, 10)}.csv"`);
  return res.send(csv);
});

/* --------------------------- helpers ----------------------------- */

/**
 * Find the campaign a donation is for. Unnamed gifts land in the general
 * fund; a named campaign must exist and still be open.
 */
async function resolveCampaign(slug, { requireOpen = true } = {}) {
  const wanted = String(slug || "general-fund").toLowerCase().trim();
  const campaign = await Campaign.findOne({ slug: wanted });

  if (!campaign) {
    if (wanted === "general-fund") return null; // tolerated: unseeded install
    throw ApiError.notFound(`Campaign "${wanted}" not found`);
  }
  if (requireOpen && !campaign.acceptsDonations) {
    throw ApiError.badRequest(`"${campaign.title}" is not currently accepting donations`);
  }
  return campaign;
}

/** System-owned fields an admin edit must never overwrite directly. */
function stripDerived(body = {}) {
  const { baseAmount, receiptNo, completedAt, refundedAt, payment, reference, source, ...safe } = body;
  return safe;
}

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const s = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
