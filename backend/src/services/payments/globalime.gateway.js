import crypto from "crypto";
import config from "../../config/index.js";
import logger from "../../utils/logger.js";
import ApiError from "../../utils/ApiError.js";
import { toMinorUnits } from "../../utils/money.js";

const gi = config.payments.globalime;

/* ------------------------------------------------------------------ *
 * Global IME Bank — payment gateway adapter
 *
 * NOTE: the request/response shapes below are MODELLED ON a standard
 * Nepali bank gateway contract and are driven entirely by env vars.
 * They are placeholders until your merchant onboarding pack arrives.
 *
 * To go live:
 *   1. Set GLOBALIME_MERCHANT_ID / API_KEY / SECRET_KEY / WEBHOOK_SECRET
 *   2. Set GLOBALIME_MODE=sandbox (then `live`)
 *   3. If the bank's field names differ, edit only FIELD_MAP +
 *      parseStatus below — nothing else in the codebase changes.
 *
 * While GLOBALIME_MODE=mock (the default) NO network call is made: the
 * donor is redirected to a local mock checkout page so the whole
 * donate -> pay -> verify -> receipt flow is testable end to end.
 * ------------------------------------------------------------------ */

/** Bank field name <-> our field name. Adjust here when the real spec lands. */
const FIELD_MAP = {
  merchantId: "merchantId",
  merchantTxnId: "merchantTxnId",
  gatewayTxnId: "gatewayTxnId",
  amount: "amount",
  currency: "currency",
  status: "status",
  signature: "signature",
};

/** Bank status string -> our Payment.status. */
function parseStatus(raw) {
  const s = String(raw || "").toUpperCase();
  if (["SUCCESS", "COMPLETED", "PAID", "SETTLED", "00", "0"].includes(s)) return "success";
  if (["PENDING", "PROCESSING", "INITIATED", "AUTHORIZED"].includes(s)) return "pending";
  if (["CANCELLED", "CANCELED", "ABORTED", "USER_CANCELLED"].includes(s)) return "cancelled";
  if (["EXPIRED", "TIMEOUT"].includes(s)) return "expired";
  return "failed";
}

/** HMAC-SHA256 over a deterministic field order — the bank's standard scheme. */
function sign(parts) {
  return crypto.createHmac("sha256", gi.secretKey).update(parts.join("|")).digest("hex");
}

/** Timing-safe comparison (never leaks the position of the first mismatch). */
function safeEqual(a, b) {
  const x = Buffer.from(String(a || ""), "utf8");
  const y = Buffer.from(String(b || ""), "utf8");
  if (x.length !== y.length || x.length === 0) return false;
  return crypto.timingSafeEqual(x, y);
}

async function callBank(path, body) {
  const url = gi.baseUrl.replace(/\/$/, "") + path;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), gi.timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": gi.apiKey,
        "X-Merchant-Id": gi.merchantId,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      logger.error(`[globalime] ${path} -> ${res.status}`, text.slice(0, 500));
      throw new ApiError(502, json?.message || `Global IME gateway error (${res.status})`, json);
    }
    return json;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === "AbortError") throw new ApiError(504, "Global IME gateway timed out");
    logger.error(`[globalime] ${path} failed:`, err.message);
    throw new ApiError(502, "Could not reach the Global IME payment gateway");
  } finally {
    clearTimeout(timer);
  }
}

const gateway = {
  key: "globalime",
  label: "Global IME Bank",
  description: "Card, mobile and internet banking — accepts international payments.",
  kind: "redirect",
  get enabled() {
    return gi.enabled;
  },
  get mode() {
    return gi.mode;
  },
  get currencies() {
    return gi.currencies;
  },
  supports(currency) {
    return gi.currencies.includes(String(currency).toUpperCase());
  },

  /** Public, non-secret info for the donate form. */
  publicConfig() {
    return {
      merchantName: gi.merchantName,
      mode: gi.mode,
      currencies: gi.currencies,
      international: true,
    };
  },

  /**
   * Create a checkout session. Returns the URL to redirect the donor to.
   * In mock mode this points at our own simulated checkout page.
   */
  async initiate({ payment, donation, returnUrl, cancelUrl, webhookUrl }) {
    const signature = sign([gi.merchantId, payment.reference, payment.amount, payment.currency]);

    const requestPayload = {
      [FIELD_MAP.merchantId]: gi.merchantId,
      [FIELD_MAP.merchantTxnId]: payment.reference,
      merchantName: gi.merchantName,
      acquirerId: gi.acquirerId,
      terminalId: gi.terminalId,
      [FIELD_MAP.amount]: payment.amount,
      amountMinor: toMinorUnits(payment.amount, payment.currency),
      [FIELD_MAP.currency]: payment.currency,
      productName: donation.campaignTitle || "Donation",
      productCode: donation.campaignSlug || "general-fund",
      customerName: donation.anonymous ? "Anonymous Donor" : donation.donor,
      customerEmail: donation.email || "",
      customerPhone: donation.phone || "",
      returnUrl,
      cancelUrl,
      webhookUrl,
      [FIELD_MAP.signature]: signature,
    };

    if (gi.mode === "mock") {
      // No outbound call — hand back the local simulator.
      const checkoutUrl = `${config.payments.publicUrl}${config.apiPrefix}/payments/mock/${payment.reference}`;
      logger.warn(`[globalime] MOCK checkout for ${payment.reference} -> ${checkoutUrl}`);
      return {
        status: "pending",
        checkoutUrl,
        gatewayRef: `MOCK-${payment.reference}`,
        requestPayload,
        raw: { mock: true, checkoutUrl },
      };
    }

    const res = await callBank(gi.checkoutPath, requestPayload);
    const data = res?.data || res || {};
    const checkoutUrl = data.paymentUrl || data.checkoutUrl || data.redirectUrl;

    if (!checkoutUrl) {
      throw new ApiError(502, "Global IME did not return a checkout URL", res);
    }

    return {
      status: "pending",
      checkoutUrl,
      gatewayRef: data[FIELD_MAP.gatewayTxnId] || data.transactionId || "",
      requestPayload,
      raw: res,
    };
  },

  /**
   * Server-to-server confirmation. NEVER trust the browser callback alone —
   * every settlement in this codebase goes through here.
   */
  async verify({ payment, params = {} }) {
    const gatewayRef = params[FIELD_MAP.gatewayTxnId] || payment.gatewayRef || "";

    if (gi.mode === "mock") {
      // The mock checkout page passes back the outcome it simulated.
      return {
        status: parseStatus(params[FIELD_MAP.status] || "SUCCESS"),
        gatewayRef: gatewayRef || `MOCK-${payment.reference}`,
        instrument: params.instrument || "MOCK VISA ****4242",
        amount: payment.amount,
        currency: payment.currency,
        raw: { mock: true, ...params },
      };
    }

    const body = {
      [FIELD_MAP.merchantId]: gi.merchantId,
      [FIELD_MAP.merchantTxnId]: payment.reference,
      [FIELD_MAP.gatewayTxnId]: gatewayRef,
      [FIELD_MAP.signature]: sign([gi.merchantId, payment.reference, gatewayRef]),
    };

    const res = await callBank(gi.verifyPath, body);
    const data = res?.data || res || {};

    return {
      status: parseStatus(data[FIELD_MAP.status] ?? res[FIELD_MAP.status]),
      gatewayRef: data[FIELD_MAP.gatewayTxnId] || gatewayRef,
      instrument: data.instrument || data.paymentMethod || "",
      amount: Number(data[FIELD_MAP.amount] ?? payment.amount),
      currency: String(data[FIELD_MAP.currency] || payment.currency).toUpperCase(),
      failureCode: data.errorCode || "",
      failureReason: data.message || res.message || "",
      raw: res,
    };
  },

  /** Validate the signature on a browser return-URL callback. */
  verifyCallbackSignature(params = {}) {
    if (gi.mode === "mock") return true;
    const provided = params[FIELD_MAP.signature];
    if (!provided) return false;
    const expected = sign([
      gi.merchantId,
      params[FIELD_MAP.merchantTxnId],
      params[FIELD_MAP.gatewayTxnId],
      params[FIELD_MAP.status],
    ]);
    return safeEqual(provided, expected);
  },

  /**
   * Parse and authenticate a server-to-server webhook.
   * Signed over the RAW body, so app.js captures `req.rawBody`.
   */
  parseWebhook({ body = {}, headers = {}, rawBody = "" }) {
    const provided = headers["x-globalime-signature"] || headers["x-signature"] || "";
    let signatureValid;

    if (gi.mode === "mock") {
      signatureValid = true;
    } else {
      const expected = crypto
        .createHmac("sha256", gi.webhookSecret)
        .update(rawBody || JSON.stringify(body))
        .digest("hex");
      signatureValid = safeEqual(provided, expected);
    }

    return {
      reference: body[FIELD_MAP.merchantTxnId] || body.reference || "",
      gatewayRef: body[FIELD_MAP.gatewayTxnId] || "",
      status: parseStatus(body[FIELD_MAP.status]),
      amount: Number(body[FIELD_MAP.amount] ?? 0),
      currency: String(body[FIELD_MAP.currency] || "").toUpperCase(),
      signatureValid,
      raw: body,
    };
  },

  /** Refund a settled payment. */
  async refund({ payment, amount, reason = "" }) {
    const amt = amount ?? payment.amount;

    if (gi.mode === "mock") {
      logger.warn(`[globalime] MOCK refund ${payment.reference} ${amt} ${payment.currency}`);
      return { ok: true, raw: { mock: true, refunded: amt, reason } };
    }

    const res = await callBank(gi.refundPath, {
      [FIELD_MAP.merchantId]: gi.merchantId,
      [FIELD_MAP.merchantTxnId]: payment.reference,
      [FIELD_MAP.gatewayTxnId]: payment.gatewayRef,
      [FIELD_MAP.amount]: amt,
      reason,
      [FIELD_MAP.signature]: sign([gi.merchantId, payment.reference, amt]),
    });

    return { ok: parseStatus(res?.data?.status ?? res?.status) === "success", raw: res };
  },
};

export default gateway;
