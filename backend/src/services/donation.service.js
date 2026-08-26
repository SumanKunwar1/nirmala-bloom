import config from "../config/index.js";
import logger from "../utils/logger.js";
import { sendMail, notifyAdmin } from "../utils/mailer.js";
import { formatMoney, normalizeCurrency, fxRateFor } from "../utils/money.js";
import { nextSequence } from "../models/Counter.js";

import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import Payment from "../models/Payment.js";

/* ------------------------------------------------------------------ *
 * Donation lifecycle
 *
 * Single place where a donation changes financial state, so campaign
 * totals, receipts and notifications can never drift apart.
 * ------------------------------------------------------------------ */

/** Payment.status -> Donation.status */
const PAYMENT_TO_DONATION = {
  initiated: "pending",
  pending: "pending",
  success: "completed",
  failed: "failed",
  cancelled: "cancelled",
  expired: "failed",
  refunded: "refunded",
};

/**
 * Recompute a campaign's denormalized totals from its completed donations.
 * Cheap (one aggregate over an indexed field) and always authoritative, so
 * it is safe to call after any status change or from a repair endpoint.
 */
export async function syncCampaignTotals(campaignSlug) {
  if (!campaignSlug) return null;

  const [agg] = await Donation.aggregate([
    { $match: { campaignSlug, status: "completed" } },
    {
      $group: {
        _id: null,
        raised: { $sum: "$baseAmount" },
        count: { $sum: 1 },
        donors: { $addToSet: { $ifNull: ["$email", "$_id"] } },
        last: { $max: "$completedAt" },
      },
    },
  ]);

  return Campaign.findOneAndUpdate(
    { slug: campaignSlug },
    {
      raisedOnline: agg?.raised || 0,
      donorsOnline: agg?.donors?.length || 0,
      donationCount: agg?.count || 0,
      lastDonationAt: agg?.last || null,
    },
    { new: true },
  );
}

/** Rebuild totals for every campaign — used by the admin recalc endpoint. */
export async function syncAllCampaignTotals() {
  const campaigns = await Campaign.find({}, "slug").lean();
  const results = await Promise.all(campaigns.map((c) => syncCampaignTotals(c.slug)));
  return results.filter(Boolean).length;
}

/** Gapless per-year receipt number: NF-2026-000042. */
export async function issueReceiptNumber(date = new Date()) {
  const year = date.getUTCFullYear();
  const seq = await nextSequence(`receipt:${year}`);
  return `NF-${year}-${String(seq).padStart(6, "0")}`;
}

/** Thank-you + receipt email. Silently skipped when SMTP is off. */
export async function sendReceipt(donation) {
  if (!donation.email) return { skipped: true, reason: "no donor email" };

  const amount = formatMoney(donation.amount, donation.currency);
  const site = config.payments.returnUrl;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1f2430">
      <h2 style="color:#5B2C86;margin-bottom:4px">Thank you, ${donation.donor}.</h2>
      <p style="margin-top:0;color:#555">Your gift is already at work in Nepal.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tr><td style="padding:8px 0;color:#666">Receipt no.</td><td style="text-align:right"><strong>${donation.receiptNo}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Amount</td><td style="text-align:right"><strong>${amount}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Campaign</td><td style="text-align:right">${donation.campaignTitle}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Method</td><td style="text-align:right">${donation.method}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Reference</td><td style="text-align:right">${donation.reference || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Date</td><td style="text-align:right">${new Date(donation.completedAt || Date.now()).toDateString()}</td></tr>
      </table>
      <p style="font-size:13px;color:#777">Nirmala Foundation Nepal — a registered NGO working on disability inclusion through sport, the arts, education and mobility.</p>
      <p style="font-size:13px"><a href="${site}" style="color:#5B2C86">See where your donation goes →</a></p>
    </div>`;

  const text =
    `Thank you, ${donation.donor}.\n\n` +
    `Receipt no: ${donation.receiptNo}\nAmount: ${amount}\n` +
    `Campaign: ${donation.campaignTitle}\nReference: ${donation.reference || "-"}\n\n` +
    `Nirmala Foundation Nepal`;

  const result = await sendMail({
    to: donation.email,
    subject: `Your donation receipt ${donation.receiptNo} — Nirmala Foundation`,
    text,
    html,
  });

  if (result.sent) {
    await Donation.findByIdAndUpdate(donation.id, { receiptSentAt: new Date() });
  }
  return result;
}

/**
 * Apply a gateway outcome to a payment + its donation.
 *
 * Idempotent: a webhook and a browser callback racing to settle the same
 * payment produce exactly one completion, one receipt and one email.
 *
 * @param {object}  payment  Payment document
 * @param {object}  result   Normalized gateway result ({ status, gatewayRef, ... })
 * @param {string}  via      "callback" | "webhook" | "poll" | "admin"
 */
export async function settlePayment(payment, result, via = "callback") {
  const nextStatus = result.status || "pending";
  const alreadySettled = !!payment.settledAt;

  // A settled payment never changes state again except for an explicit refund.
  if (alreadySettled && nextStatus !== "refunded") {
    const donation = await Donation.findById(payment.donation);
    logger.debug(`[payment] ${payment.reference} already settled — ignoring ${via}`);
    return { donation, payment, changed: false };
  }

  payment.status = nextStatus;
  payment.gatewayRef = result.gatewayRef || payment.gatewayRef;
  payment.instrument = result.instrument || payment.instrument;
  payment.verifyResponse = result.raw || payment.verifyResponse;
  payment.verifyAttempts += 1;
  if (result.failureCode) payment.failureCode = result.failureCode;
  if (result.failureReason) payment.failureReason = result.failureReason;
  if (["success", "failed", "cancelled", "expired", "refunded"].includes(nextStatus)) {
    payment.settledAt = new Date();
  }
  await payment.save();

  const donation = await Donation.findById(payment.donation);
  if (!donation) {
    logger.error(`[payment] ${payment.reference} has no donation record`);
    return { donation: null, payment, changed: true };
  }

  const donationStatus = PAYMENT_TO_DONATION[nextStatus] || "pending";
  const wasCompleted = donation.status === "completed";

  donation.status = donationStatus;
  donation.gateway = payment.gateway;
  donation.payment = payment._id;
  donation.reference = payment.reference;
  if (result.instrument) donation.method = `${payment.gateway === "manual" ? "" : "Global IME · "}${result.instrument}`.trim();

  if (donationStatus === "completed" && !wasCompleted) {
    donation.completedAt = new Date();
    if (!donation.receiptNo) donation.receiptNo = await issueReceiptNumber(donation.completedAt);
  }
  if (donationStatus === "refunded") {
    donation.refundedAt = new Date();
  }

  await donation.save();

  // Campaign totals depend on completed donations only — resync on any
  // transition into or out of "completed".
  if (wasCompleted !== (donationStatus === "completed") || donationStatus === "refunded") {
    await syncCampaignTotals(donation.campaignSlug);
  }

  // Notify once, on the transition into completed.
  if (donationStatus === "completed" && !wasCompleted) {
    sendReceipt(donation).catch((e) => logger.error("[receipt]", e.message));
    notifyAdmin({
      subject: `Donation received — ${formatMoney(donation.amount, donation.currency)}`,
      text:
        `${donation.donor} donated ${formatMoney(donation.amount, donation.currency)} ` +
        `to ${donation.campaignTitle}.\nReceipt: ${donation.receiptNo}\nReference: ${donation.reference}\nVia: ${via}`,
    }).catch(() => {});
    logger.info(`[donation] completed ${donation.receiptNo} ${donation.reference} via ${via}`);
  }

  return { donation, payment, changed: true };
}

/**
 * Record a payment the bank told us about that we never initiated.
 *
 * This is the safety net that guarantees EVERY payment the gateway reports
 * ends up in the donation table — a webhook that arrives after our record was
 * deleted, money taken through a bank-hosted link or merchant QR, a manual
 * push by the bank's operations team, or a reference we simply cannot match.
 *
 * The donation is created with `source: "gateway"` and `needsReview: true`
 * so an admin can attribute it to the right campaign and donor. It counts
 * toward campaign totals only once it settles as completed, exactly like
 * any other donation.
 */
export async function captureOrphanPayment(gatewayKey, parsed) {
  const reference = parsed.reference || `ORPHAN-${parsed.gatewayRef || Date.now().toString(36).toUpperCase()}`;

  // Never create a duplicate for a webhook the bank retries.
  const existing = await Payment.findOne({ reference });
  if (existing) return { payment: existing, donation: await Donation.findById(existing.donation), created: false };

  let currency = "NPR";
  let fxRate = 1;
  try {
    currency = normalizeCurrency(parsed.currency || config.payments.baseCurrency);
    fxRate = fxRateFor(currency);
  } catch {
    // An unrecognised currency must not lose the record — log it and fall back.
    logger.warn(`[orphan] unknown currency "${parsed.currency}" on ${reference}; recording as NPR`);
  }

  const amount = Number(parsed.amount) || 0;
  const baseAmount = Math.round(amount * fxRate);

  // Attribute to the general fund by default so the money is never stranded.
  const campaign = await Campaign.findOne({ slug: "general-fund" });

  const donation = await Donation.create({
    donor: parsed.raw?.customerName || parsed.raw?.donor || "Unidentified donor",
    email: (parsed.raw?.customerEmail || parsed.raw?.email || "").toLowerCase(),
    amount,
    currency,
    baseAmount,
    baseCurrency: config.payments.baseCurrency,
    fxRate,
    campaign: campaign?._id || null,
    campaignSlug: campaign?.slug || "general-fund",
    campaignTitle: campaign?.title || "General Fund",
    gateway: gatewayKey,
    method: `${gatewayKey} (unmatched)`,
    reference,
    status: "pending",
    source: "gateway",
    needsReview: true,
    reviewNote:
      "Reported by the payment gateway with no matching donation record. " +
      "Confirm the amount, then attribute it to the right donor and campaign.",
  });

  const payment = await Payment.create({
    donation: donation._id,
    gateway: gatewayKey,
    reference,
    gatewayRef: parsed.gatewayRef || "",
    amount,
    currency,
    baseAmount,
    baseCurrency: config.payments.baseCurrency,
    fxRate,
    status: "pending",
    unmatched: true,
    callbackPayload: parsed.raw || {},
  });

  donation.payment = payment._id;
  await donation.save();

  logger.warn(`[orphan] captured unmatched ${gatewayKey} payment ${reference} (${amount} ${currency})`);
  notifyAdmin({
    subject: "Unmatched payment received — needs review",
    text:
      `The ${gatewayKey} gateway reported a payment we did not initiate.

` +
      `Reference: ${reference}
Amount: ${formatMoney(amount, currency)}
` +
      `Gateway ref: ${parsed.gatewayRef || "-"}

` +
      `It has been recorded against the General Fund and flagged for review in the admin panel.`,
  }).catch(() => {});

  return { payment, donation, created: true };
}

/**
 * Re-verify every payment still sitting in a non-final state.
 *
 * Catches the donor who paid and then closed the tab before the redirect, and
 * any webhook that never arrived. Safe to run on a schedule.
 */
export async function reconcilePendingPayments({ limit = 200 } = {}) {
  const { getGateway } = await import("./payments/index.js");

  const pending = await Payment.find({
    status: { $in: ["initiated", "pending"] },
    gateway: { $ne: "manual" },
  })
    .sort("-createdAt")
    .limit(limit);

  const summary = { checked: 0, settled: 0, stillPending: 0, errors: 0 };

  for (const payment of pending) {
    summary.checked += 1;
    try {
      const gateway = getGateway(payment.gateway);
      const result = await gateway.verify({ payment, params: payment.callbackPayload || {} });

      if (result.status === "pending" || result.status === "initiated") {
        summary.stillPending += 1;
        continue;
      }
      await settlePayment(payment, result, "poll");
      summary.settled += 1;
    } catch (err) {
      summary.errors += 1;
      logger.error(`[reconcile] ${payment.reference}: ${err.message}`);
    }
  }

  logger.info(
    `[reconcile] checked ${summary.checked}, settled ${summary.settled}, still pending ${summary.stillPending}, errors ${summary.errors}`,
  );
  return summary;
}

/**
 * Sweep payments the donor never finished. Keeps the pending pile honest
 * without a cron dependency — call it from a scheduled job or on demand.
 */
export async function expireStalePayments() {
  const stale = await Payment.find({
    status: { $in: ["initiated", "pending"] },
    expiresAt: { $lt: new Date() },
  }).limit(500);

  let expired = 0;
  for (const payment of stale) {
    // Offline transfers legitimately stay open — an admin closes them.
    if (payment.gateway === "manual") continue;
    await settlePayment(payment, { status: "expired", failureReason: "Payment session expired" }, "poll");
    expired += 1;
  }
  if (expired) logger.info(`[payments] expired ${expired} stale session(s)`);
  return expired;
}
