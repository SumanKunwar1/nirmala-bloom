import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.plugin(toJSON);

export default mongoose.model("Testimonial", schema);
