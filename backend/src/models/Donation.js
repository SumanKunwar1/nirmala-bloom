import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * A fundraising record. Money movement lives on the Payment model — a Donation
 * is what the foundation reports on, a Payment is what the bank did.
 *
 * `status` mirrors the settled outcome of the latest Payment attempt:
 *   pending   → awaiting payment / awaiting admin verification (offline transfer)
 *   completed → money received, counts toward campaign totals
 *   failed / cancelled → attempt did not settle
 *   refunded  → returned to the donor, removed from campaign totals
 */
const schema = new mongoose.Schema(
  {
    donor: { type: String, required: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },

    /** Where the donor is giving from — Global IME settles internationally. */
    country: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },

    /** Amount in the currency the donor actually paid in. */
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NPR", uppercase: true, trim: true },

    /** Same donation normalized to the reporting currency — all stats use this. */
    baseAmount: { type: Number, default: 0, min: 0 },
    baseCurrency: { type: String, default: "NPR", uppercase: true, trim: true },
    fxRate: { type: Number, default: 1, min: 0 },

    /** Denormalized campaign fields kept so a deleted campaign never orphans
     *  a financial record; `campaign` is the live reference. */
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", default: null, index: true },
    campaignSlug: { type: String, default: "general-fund" },
    campaignTitle: { type: String, default: "General Fund" },

    /** Human-facing label ("Global IME · Card", "Bank transfer"). */
    method: { type: String, default: "Card" },

    /** Gateway key that processed it — "globalime", "manual", … */
    gateway: { type: String, default: "", lowercase: true, trim: true },

    /** Latest payment attempt + our merchant reference for it. */
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null },
    reference: { type: String, default: "", trim: true, index: true },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    anonymous: { type: Boolean, default: false },
    message: { type: String, default: "" },

    /** "In memory of…" / "In honour of…" */
    dedicateTo: { type: String, default: "" },

    recurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ["one-time", "monthly", "quarterly", "yearly"], default: "one-time" },

    /** Issued once, when the donation first completes. */
    receiptNo: { type: String, default: "", trim: true },
    receiptSentAt: { type: Date, default: null },

    /**
     * How the record entered the system.
     *   web     → started from our donate form
     *   manual  → an admin keyed it in
     *   gateway → the bank reported money we had no record of (see
     *             captureOrphanPayment) — always flagged for review
     *   import  → bulk import
     */
    source: { type: String, enum: ["web", "manual", "gateway", "import"], default: "web" },

    /** Needs a human to look at it — orphan gateway payments, amount mismatches. */
    needsReview: { type: Boolean, default: false },
    reviewNote: { type: String, default: "" },

    completedAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },

    /** Admin who verified an offline/manual donation. */
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    verifiedAt: { type: Date, default: null },

    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

schema.index({ status: 1, campaignSlug: 1 });
schema.index({ createdAt: -1 });
schema.index({ needsReview: 1, status: 1 });
schema.index({ receiptNo: 1 }, { sparse: true });

/** Keep the normalized amount consistent even for records created directly. */
schema.pre("save", function (next) {
  if (!this.baseAmount || this.isModified("amount") || this.isModified("fxRate")) {
    this.baseAmount = Math.round((this.amount || 0) * (this.fxRate || 1));
  }
  next();
});

schema.plugin(toJSON);

export default mongoose.model("Donation", schema);
