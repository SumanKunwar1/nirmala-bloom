import mongoose from "mongoose";
import validator from "validator";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    name: { type: String, default: "" },
    source: { type: String, default: "footer" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

schema.plugin(toJSON);

export default mongoose.model("Subscriber", schema);
