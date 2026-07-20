import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Guides" },
    year: { type: String, default: "" },
    desc: { type: String, default: "" },
    url: { type: String, default: "#" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.index({ title: "text", desc: "text" });
schema.plugin(toJSON);

export default mongoose.model("Resource", schema);
