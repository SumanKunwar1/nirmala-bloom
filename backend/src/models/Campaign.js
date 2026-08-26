import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/** A giving tier shown on the campaign page ("Rs 25,000 → one fitted wheelchair"). */
const tierSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 1 },
    impact: { type: String, default: "" },
  },
  { _id: false },
);

/** A short beneficiary/staff quote rendered on the campaign detail page. */
const storySchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    quote: { type: String, default: "" },
  },
  { _id: false },
);

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "💛" },
    color: { type: String, default: "#5B2C86" },
    image: { type: String, default: "" },

    goal: { type: Number, required: true, min: 0 },

    /**
     * Money/donors raised OUTSIDE this system — historic totals, cheques,
     * offline events. Editable by an admin. Live online donations are tracked
     * separately in `raisedOnline`/`donorsOnline` and the two are summed into
     * the `raised`/`donors` virtuals the frontend reads.
     */
    raisedOffset: { type: Number, default: 0, min: 0 },
    donorsOffset: { type: Number, default: 0, min: 0 },

    /** Denormalized totals of completed donations — kept in sync by
     *  `syncCampaignTotals()`; never edit these by hand. */
    raisedOnline: { type: Number, default: 0, min: 0 },
    donorsOnline: { type: Number, default: 0, min: 0 },
    donationCount: { type: Number, default: 0, min: 0 },
    lastDonationAt: { type: Date, default: null },

    urgent: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },

    desc: { type: String, default: "" },
    longDesc: { type: String, default: "" },
    why: { type: String, default: "" },

    tiers: { type: [tierSchema], default: [] },
    stories: { type: [storySchema], default: [] },

    /** Optional link back to the Program this campaign funds. */
    programSlug: { type: String, default: "" },

    /** Currency the goal is expressed in (all totals are normalized to it). */
    currency: { type: String, default: "NPR", uppercase: true, trim: true },

    /** Accepts donations? A closed campaign still renders but cannot be paid to. */
    active: { type: Boolean, default: true },
    published: { type: Boolean, default: true },

    /** Optional close date — past this, `acceptsDonations` is false. */
    endsAt: { type: Date, default: null },

    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: String, default: "" },

    order: { type: Number, default: 0 },
  },
  { timestamps: true, toObject: { virtuals: true } },
);

/* --------------------------- Virtuals ---------------------------- *
 * The frontend contract is `raised` / `donors` / `percent` — these are
 * derived so an admin can never put them out of sync with reality.     */

schema.virtual("raised").get(function () {
  return (this.raisedOffset || 0) + (this.raisedOnline || 0);
});

schema.virtual("donors").get(function () {
  return (this.donorsOffset || 0) + (this.donorsOnline || 0);
});

schema.virtual("percent").get(function () {
  if (!this.goal) return 0;
  return Math.min(100, Math.round((this.raised / this.goal) * 100));
});

schema.virtual("remaining").get(function () {
  return Math.max(0, (this.goal || 0) - this.raised);
});

schema.virtual("acceptsDonations").get(function () {
  if (!this.active || !this.published) return false;
  if (this.endsAt && this.endsAt.getTime() < Date.now()) return false;
  return true;
});

schema.index({ published: 1, active: 1, order: 1 });
schema.index({ title: "text", desc: "text", longDesc: "text" });

schema.plugin(toJSON);

export default mongoose.model("Campaign", schema);
