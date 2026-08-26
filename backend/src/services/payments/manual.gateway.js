import config from "../../config/index.js";

const m = config.payments.manual;

/* ------------------------------------------------------------------ *
 * Manual / offline bank transfer
 *
 * No API call. The donor is shown account details plus a reference to
 * quote; an admin marks the donation completed once the money lands
 * (PATCH /donations/:id/status). Implements the same interface as every
 * other gateway so the controllers never special-case it.
 * ------------------------------------------------------------------ */

const gateway = {
  key: "manual",
  label: "Direct bank transfer",
  description: "Transfer from your own bank, then we confirm receipt manually.",
  kind: "offline",
  get enabled() {
    return m.enabled;
  },
  get mode() {
    return "offline";
  },
  get currencies() {
    return config.payments.supportedCurrencies;
  },
  supports() {
    return true;
  },

  publicConfig() {
    return {
      bankName: m.bankName,
      accountName: m.accountName,
      accountNumber: m.accountNumber,
      branch: m.branch,
      swift: m.swift,
      instructions: m.instructions,
    };
  },

  /** Nothing to redirect to — return the transfer instructions instead. */
  async initiate({ payment }) {
    return {
      status: "pending",
      checkoutUrl: "",
      gatewayRef: "",
      instructions: {
        ...this.publicConfig(),
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
      },
      requestPayload: {},
      raw: { offline: true },
    };
  },

  /** Stays pending until a human confirms it. */
  async verify({ payment }) {
    return {
      status: payment.status === "success" ? "success" : "pending",
      gatewayRef: payment.gatewayRef || "",
      instrument: "Bank transfer",
      amount: payment.amount,
      currency: payment.currency,
      raw: { offline: true },
    };
  },

  verifyCallbackSignature() {
    return false;
  },

  parseWebhook() {
    return { reference: "", status: "pending", signatureValid: false, raw: {} };
  },

  async refund() {
    return { ok: true, raw: { offline: true, note: "Refund handled outside the system" } };
  },
};

export default gateway;
