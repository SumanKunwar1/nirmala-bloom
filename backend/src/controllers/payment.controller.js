import config from "../config/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { formatMoney } from "../utils/money.js";
import { getGateway, publicGatewayList, generateReference } from "../services/payments/index.js";
import {
  settlePayment,
  expireStalePayments,
  captureOrphanPayment,
  reconcilePendingPayments,
} from "../services/donation.service.js";

import Payment from "../models/Payment.js";
import Donation from "../models/Donation.js";

const { payments: pcfg } = config;

/** GET /payments/methods — what the donate form should offer. */
export const methods = asyncHandler(async (req, res) =>
  success(res, {
    gateways: publicGatewayList(),
    defaultGateway: pcfg.defaultGateway,
    baseCurrency: pcfg.baseCurrency,
    supportedCurrencies: pcfg.supportedCurrencies,
    fxRates: pcfg.fxRates,
  }),
);

/**
 * Create a Payment for a Donation and ask the gateway for a checkout session.
 * Shared by the public donate flow and the "retry payment" endpoint.
 */
export async function startPayment({ donation, gatewayKey, instrument, req }) {
  const gateway = getGateway(gatewayKey);

  if (gateway.supportsInstrument && !gateway.supportsInstrument(instrument)) {
    throw ApiError.badRequest(`${gateway.label} does not offer "${instrument}" payments`);
  }

  if (!gateway.supports(donation.currency)) {
    throw ApiError.badRequest(
      `${gateway.label} does not accept ${donation.currency}. Supported: ${gateway.currencies.join(", ")}`,
    );
  }

  const reference = generateReference();
  const expiresAt = new Date(Date.now() + pcfg.sessionTtlMinutes * 60 * 1000);

  const payment = await Payment.create({
    donation: donation._id,
    gateway: gateway.key,
    reference,
    amount: donation.amount,
    currency: donation.currency,
    baseAmount: donation.baseAmount,
    baseCurrency: donation.baseCurrency,
    fxRate: donation.fxRate,
    status: "initiated",
    requestedInstrument: instrument || "",
    expiresAt,
    ip: req?.ip || "",
    userAgent: req?.headers?.["user-agent"] || "",
  });

  const base = `${pcfg.publicUrl}${config.apiPrefix}/payments`;

  let result;
  try {
    result = await gateway.initiate({
      payment,
      donation,
      instrument,
      returnUrl: `${base}/callback/${gateway.key}`,
      cancelUrl: `${base}/callback/${gateway.key}?status=CANCELLED&merchantTxnId=${reference}`,
      webhookUrl: `${base}/webhook/${gateway.key}`,
    });
  } catch (err) {
    payment.status = "failed";
    payment.failureReason = err.message;
    payment.settledAt = new Date();
    await payment.save();
    await Donation.findByIdAndUpdate(donation._id, { status: "failed" });
    throw err;
  }

  payment.status = result.status || "pending";
  payment.checkoutUrl = result.checkoutUrl || "";
  payment.gatewayRef = result.gatewayRef || "";
  payment.requestPayload = result.requestPayload || {};
  payment.initiateResponse = result.raw || {};
  await payment.save();

  donation.payment = payment._id;
  donation.reference = reference;
  donation.gateway = gateway.key;
  donation.method = describeMethod(gateway, instrument);
  await donation.save();

  return {
    payment,
    gateway,
    checkout: {
      gateway: gateway.key,
      gatewayLabel: gateway.label,
      kind: gateway.kind,
      mode: gateway.mode,
      reference,
      amount: payment.amount,
      currency: payment.currency,
      instrument: instrument || "",
      checkoutUrl: result.checkoutUrl || "",
      instructions: result.instructions || null,
      expiresAt,
      // Poll here if the donor's browser loses the redirect.
      statusUrl: `${config.apiPrefix}/payments/${reference}/status`,
    },
  };
}

/**
 * POST /payments/:reference/retry — start a fresh attempt on a donation
 * whose previous payment failed, expired or was cancelled.
 */
export const retry = asyncHandler(async (req, res) => {
  const previous = await Payment.findOne({ reference: req.params.reference });
  if (!previous) throw ApiError.notFound("Payment reference not found");
  if (previous.status === "success") throw ApiError.badRequest("This payment has already completed");

  const donation = await Donation.findById(previous.donation);
  if (!donation) throw ApiError.notFound("Donation not found");
  if (donation.status === "completed") throw ApiError.badRequest("This donation has already completed");

  const { checkout } = await startPayment({
    donation,
    gatewayKey: req.body?.gateway || previous.gateway,
    instrument: req.body?.instrument || previous.requestedInstrument,
    req,
  });

  return success(res, checkout, "Payment restarted");
});

/**
 * GET|POST /payments/callback/:gateway — the donor's browser coming back
 * from the bank.
 *
 * The callback is only a HINT. The outcome is always confirmed with a
 * server-to-server verify before anything is marked completed.
 */
export const callback = asyncHandler(async (req, res) => {
  const gateway = getGateway(req.params.gateway);
  const params = { ...req.query, ...req.body };
  const reference = params.merchantTxnId || params.reference || params.PRN || "";

  if (!reference) return redirectToClient(res, { status: "failed", reason: "missing-reference" });

  const payment = await Payment.findOne({ reference });
  if (!payment) return redirectToClient(res, { status: "failed", reference, reason: "unknown-reference" });

  payment.callbackPayload = params;
  payment.signatureValid = gateway.verifyCallbackSignature(params);
  await payment.save();

  if (payment.signatureValid === false) {
    logger.warn(`[payment] bad callback signature for ${reference} — verifying with the bank anyway`);
  }

  // Authoritative check.
  const result = await gateway.verify({ payment, params });
  const { donation } = await settlePayment(payment, result, "callback");

  return redirectToClient(res, {
    status: donation?.status || result.status,
    reference,
    receipt: donation?.receiptNo || "",
    amount: donation?.amount,
    currency: donation?.currency,
    campaign: donation?.campaignSlug,
  });
});

/**
 * POST /payments/webhook/:gateway — server-to-server notification.
 *
 * Always answers 200 once the payload is authenticated, so the bank does not
 * retry forever on our own downstream errors.
 */
export const webhook = asyncHandler(async (req, res) => {
  const gateway = getGateway(req.params.gateway);

  const parsed = gateway.parseWebhook({
    body: req.body,
    headers: req.headers,
    rawBody: req.rawBody || "",
  });

  if (!parsed.signatureValid) {
    logger.warn(`[webhook] rejected ${gateway.key} payload — bad signature`);
    throw ApiError.unauthorized("Invalid webhook signature");
  }
  // A bank-initiated payment can legitimately carry no merchant reference —
  // it is still money, so it is captured below rather than rejected. Only a
  // payload with neither a reference nor an amount is genuinely unusable.
  if (!parsed.reference && !parsed.gatewayRef && !parsed.amount) {
    throw ApiError.badRequest("Webhook carries no reference, gateway id or amount");
  }

  let payment = parsed.reference ? await Payment.findOne({ reference: parsed.reference }) : null;

  // No matching record? The money is real, so record it rather than dropping
  // it. captureOrphanPayment creates a Donation flagged for admin review, so
  // every payment the gateway reports is tracked in the donation table.
  if (!payment) {
    const captured = await captureOrphanPayment(gateway.key, parsed);
    payment = captured.payment;
  }

  payment.callbackPayload = parsed.raw;
  await payment.save();

  // Re-verify rather than trusting the webhook body's status field.
  let result;
  try {
    result = await gateway.verify({ payment, params: parsed.raw });
  } catch (err) {
    logger.error(`[webhook] verify failed for ${parsed.reference}: ${err.message}`);
    result = { status: parsed.status, gatewayRef: parsed.gatewayRef, raw: parsed.raw };
  }

  await settlePayment(payment, result, "webhook");
  return success(res, null, "Webhook processed");
});

/**
 * GET /payments/:reference/status — public poll.
 * The reference is a 20-char unguessable token, so this is safe to expose;
 * it returns only what the thank-you page needs to render.
 */
export const status = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ reference: req.params.reference });
  if (!payment) throw ApiError.notFound("Payment reference not found");

  const donation = await Donation.findById(payment.donation);

  return success(res, {
    reference: payment.reference,
    status: payment.status,
    donationStatus: donation?.status || "pending",
    gateway: payment.gateway,
    amount: payment.amount,
    currency: payment.currency,
    formattedAmount: formatMoney(payment.amount, payment.currency),
    campaignSlug: donation?.campaignSlug || "",
    campaignTitle: donation?.campaignTitle || "",
    donor: donation?.anonymous ? "Anonymous" : donation?.donor || "",
    receiptNo: donation?.receiptNo || "",
    checkoutUrl: ["initiated", "pending"].includes(payment.status) ? payment.checkoutUrl : "",
    expiresAt: payment.expiresAt,
    completedAt: donation?.completedAt || null,
  });
});

/** POST /payments/:reference/refund — admin. */
export const refund = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ reference: req.params.reference });
  if (!payment) throw ApiError.notFound("Payment reference not found");
  if (payment.status !== "success") throw ApiError.badRequest("Only a successful payment can be refunded");

  const gateway = getGateway(payment.gateway);
  const result = await gateway.refund({
    payment,
    amount: req.body?.amount,
    reason: req.body?.reason || "",
  });

  if (!result.ok) throw new ApiError(502, "The gateway declined the refund", result.raw);

  const { donation } = await settlePayment(payment, { status: "refunded", raw: result.raw }, "admin");
  return success(res, donation, "Payment refunded");
});

/**
 * POST /payments/reconcile — re-verify every unfinished payment with the bank.
 *
 * Catches donors who paid and then closed the tab before the redirect landed,
 * and any webhook that never arrived. Safe to run on a schedule.
 */
export const reconcile = asyncHandler(async (req, res) => {
  const summary = await reconcilePendingPayments({ limit: Number(req.body?.limit) || 200 });
  return success(res, summary, `Reconciled ${summary.checked} payment(s) — ${summary.settled} settled`);
});

/** GET /payments/unmatched — payments the bank reported that we never started. */
export const unmatched = asyncHandler(async (req, res) => {
  const items = await Payment.find({ unmatched: true })
    .sort("-createdAt")
    .limit(200)
    .populate("donation", "donor email amount currency campaignTitle status needsReview receiptNo");
  return success(res, items, "Fetched", 200, { total: items.length });
});

/** POST /payments/expire — sweep abandoned sessions (admin / cron). */
export const expire = asyncHandler(async (req, res) => {
  const count = await expireStalePayments();
  return success(res, { expired: count }, `Expired ${count} stale payment session(s)`);
});

/**
 * GET /payments/mock/:reference — local checkout simulator.
 *
 * Only reachable while a gateway is in `mock` mode. Lets the whole donate
 * flow be exercised with no bank credentials: pick an outcome and the
 * request lands on the real callback route.
 */
export const mockCheckout = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ reference: req.params.reference });
  if (!payment) throw ApiError.notFound("Payment reference not found");

  const gateway = getGateway(payment.gateway);
  if (gateway.mode !== "mock") throw ApiError.forbidden("The mock checkout is disabled in this mode");

  const donation = await Donation.findById(payment.donation);
  const chosen = String(req.query.instrument || payment.requestedInstrument || "card");
  const label = { card: "Card", "mobile-banking": "Mobile Banking", "internet-banking": "Internet Banking", wallet: "Mobile Wallet" }[chosen] || "Card";
  const fakeInstrument = chosen === "card" ? "VISA ****4242" : label;
  const cb =
    `${config.apiPrefix}/payments/callback/${gateway.key}` +
    `?merchantTxnId=${encodeURIComponent(payment.reference)}` +
    `&gatewayTxnId=MOCK-${encodeURIComponent(payment.reference)}` +
    `&instrument=${encodeURIComponent(fakeInstrument)}`;
  const amount = formatMoney(payment.amount, payment.currency);

  res.type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mock checkout — ${escapeHtml(gateway.label)}</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f5f3f8;margin:0;
       display:grid;place-items:center;min-height:100vh;color:#1f2430}
  .card{background:#fff;border-radius:16px;padding:32px;max-width:420px;width:calc(100% - 32px);
        box-shadow:0 10px 40px rgba(91,44,134,.12)}
  .tag{display:inline-block;background:#fde68a;color:#78350f;font-size:12px;font-weight:700;
       padding:4px 10px;border-radius:99px;letter-spacing:.03em}
  h1{font-size:20px;margin:14px 0 4px} p{color:#5b6070;margin:0 0 18px;font-size:14px}
  dl{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:14px;margin:0 0 24px}
  dt{color:#6b7280} dd{margin:0;text-align:right;font-weight:600}
  a.btn{display:block;text-align:center;padding:12px;border-radius:10px;text-decoration:none;
        font-weight:700;margin-bottom:10px;font-size:15px}
  .ok{background:#5B2C86;color:#fff} .fail{background:#fee2e2;color:#991b1b}
  .cancel{background:#f3f4f6;color:#374151}
</style></head><body>
<div class="card">
  <span class="tag">MOCK MODE — no real money moves</span>
  <h1>${escapeHtml(gateway.label)}</h1>
  <p>Simulated checkout. Set <code>GLOBALIME_MODE=sandbox</code> with real credentials to use the bank.</p>
  <dl>
    <dt>Amount</dt><dd>${escapeHtml(amount)}</dd>
    <dt>Campaign</dt><dd>${escapeHtml(donation?.campaignTitle || "Donation")}</dd>
    <dt>Donor</dt><dd>${escapeHtml(donation?.anonymous ? "Anonymous" : donation?.donor || "-")}</dd>
    <dt>Method</dt><dd>${escapeHtml(label)}</dd>
    <dt>Reference</dt><dd>${escapeHtml(payment.reference)}</dd>
  </dl>
  <a class="btn ok"     href="${cb}&status=SUCCESS">Pay ${escapeHtml(amount)}</a>
  <a class="btn fail"   href="${cb}&status=FAILED">Simulate failure</a>
  <a class="btn cancel" href="${cb}&status=CANCELLED">Cancel</a>
</div></body></html>`);
});

/* --------------------------- helpers ----------------------------- */

/** Bounce the donor back to the frontend with the outcome in the query. */
function redirectToClient(res, { status, ...rest }) {
  const target = status === "completed" || status === "success" ? pcfg.returnUrl : pcfg.cancelUrl;
  const url = new URL(target);
  url.searchParams.set("status", status || "failed");
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  return res.redirect(302, url.toString());
}

/** Human-readable label stored on the donation, e.g. "Global IME · Card". */
function describeMethod(gateway, instrument) {
  if (gateway.kind === "offline") return "Bank transfer";
  const pretty = {
    card: "Card",
    "mobile-banking": "Mobile Banking",
    "internet-banking": "Internet Banking",
    wallet: "Mobile Wallet",
  }[instrument];
  return pretty ? `${gateway.label} · ${pretty}` : gateway.label;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}
