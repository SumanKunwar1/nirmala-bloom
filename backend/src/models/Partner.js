import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    desc: { type: String, default: "" },
    region: { type: String, default: "National" },
    type: { type: String, default: "Community" },
    since: { type: String, default: "" },
    areas: { type: [String], default: [] },
    url: { type: String, default: "" },
    color: { type: String, default: "#5B2C86" },
    logo: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.plugin(toJSON);

export default mongoose.model("Partner", schema);
