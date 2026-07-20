import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "" },
    title: { type: String, required: true },
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.plugin(toJSON);

export default mongoose.model("HeroSlide", schema);
