import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, default: 0 },
    suffix: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.plugin(toJSON);

export default mongoose.model("ImpactStat", schema);
