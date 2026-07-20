import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Singleton content sections keyed by name:
 *   "site"    → { siteName, tagline, description, logo, primaryColor, seo* }
 *   "about"   → { heroTitle, founderName, founderStory, mission, ... }
 *   "contact" → { address, phone, email, whatsapp, hours, mapEmbed, social* }
 *   "footer"  → { aboutText, newsletterHeading, copyright, legalLinks }
 */
const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);

schema.plugin(toJSON);

export default mongoose.model("Setting", schema);
