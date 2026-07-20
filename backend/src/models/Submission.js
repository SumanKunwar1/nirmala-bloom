import mongoose from "mongoose";
import validator from "validator";
import toJSON from "./plugins/toJSON.js";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: { type: String, default: "" },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    replyMessage: { type: String, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true },
);

schema.plugin(toJSON);

export default mongoose.model("Submission", schema);
