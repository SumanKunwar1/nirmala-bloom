import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.plugin(toJSON);

export default mongoose.model("TeamMember", schema);
