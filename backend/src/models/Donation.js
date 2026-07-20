import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    donor: { type: String, required: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    campaignSlug: { type: String, default: "general-fund" },
    campaignTitle: { type: String, default: "General Fund" },
    method: { type: String, default: "Card" },
    status: { type: String, enum: ["completed", "pending", "refunded"], default: "pending" },
    anonymous: { type: Boolean, default: false },
    message: { type: String, default: "" },
  },
  { timestamps: true },
);

schema.index({ status: 1, campaignSlug: 1 });
schema.plugin(toJSON);

export default mongoose.model("Donation", schema);
