import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * One attempt to move money for a Donation.
 *
 * A Donation may have several Payments (donor abandons the bank page, retries
 * with another card, etc.) — this is the gateway-facing ledger, kept separate
 * so the Donation record stays a clean fundraising record.
 */
const schema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true, index: true },

    /** Gateway key — "globalime", "manual", … (see services/payments). */
    gateway: { type: String, required: true, lowercase: true, trim: true },

    /** OUR reference, sent to the bank as the merchant transaction id. Unique. */
    reference: { type: String, required: true, unique: true, trim: true },

    /** The bank's own transaction id, returned on initiate/verify. */
    gatewayRef: { type: String, default: "", trim: true },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NPR", uppercase: true, trim: true },

    /** Amount converted into the reporting base currency at `fxRate`. */
    baseAmount: { type: Number, required: true, min: 0 },
    baseCurrency: { type: String, default: "NPR", uppercase: true, trim: true },
    fxRate: { type: Number, default: 1, min: 0 },

    status: {
      type: String,
      enum: ["initiated", "pending", "success", "failed", "cancelled", "expired", "refunded"],
      default: "initiated",
      index: true,
    },

    /** Redirect target handed back to the browser (checkout URL / form post). */
    checkoutUrl: { type: String, default: "" },

    /** Free-form gateway payloads, kept verbatim for dispute resolution. */
    requestPayload: { type: mongoose.Schema.Types.Mixed, default: {} },
    initiateResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
    callbackPayload: { type: mongoose.Schema.Types.Mixed, default: {} },
    verifyResponse: { type: mongoose.Schema.Types.Mixed, default: {} },

    /** Set when the gateway (or our own guard) rejects the attempt. */
    failureCode: { type: String, default: "" },
    failureReason: { type: String, default: "" },

    /** What the donor chose on our form — "card", "mobile-banking", … */
    requestedInstrument: { type: String, default: "" },

    /** What the bank actually reported back, e.g. "VISA ****4242". */
    instrument: { type: String, default: "" },

    signature: { type: String, default: "" },
    signatureValid: { type: Boolean, default: null },

    /** True when the bank reported this payment but we never initiated it. */
    unmatched: { type: Boolean, default: false },

    /** Guards against a webhook and a browser callback both settling once. */
    settledAt: { type: Date, default: null },
    verifyAttempts: { type: Number, default: 0 },

    /** Unclaimed payments past this point are swept to `expired`. */
    expiresAt: { type: Date, default: null },

    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

schema.index({ gateway: 1, gatewayRef: 1 });
schema.index({ status: 1, createdAt: -1 });

schema.plugin(toJSON);

export default mongoose.model("Payment", schema);
