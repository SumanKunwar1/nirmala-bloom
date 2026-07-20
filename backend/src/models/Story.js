import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: "News" },
    date: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    readTime: { type: String, default: "3 min" },
    image: { type: String, default: "" },
    body: { type: String, default: "" },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.index({ title: "text", excerpt: "text" });
schema.plugin(toJSON);

export default mongoose.model("Story", schema);
