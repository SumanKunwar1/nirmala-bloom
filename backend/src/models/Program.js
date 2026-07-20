import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const highlightSchema = new mongoose.Schema(
  { value: { type: String, default: "" }, label: { type: String, default: "" } },
  { _id: false },
);

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "🌟" },
    color: { type: String, default: "#5B2C86" },
    tagline: { type: String, default: "" },
    desc: { type: String, default: "" },
    image: { type: String, default: "" },
    body: { type: String, default: "" },
    goals: { type: [String], default: [] },
    highlights: { type: [highlightSchema], default: [] },
    gallery: { type: [String], default: [] },
    donateSlug: { type: String, default: "" },
    published: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.index({ title: "text", desc: "text" });
schema.plugin(toJSON);

export default mongoose.model("Program", schema);
