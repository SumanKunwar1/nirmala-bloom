import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const env = process.env.NODE_ENV || "development";

const config = {
  env,
  isProd: env === "production",
  isDev: env === "development",
  port: parseInt(process.env.PORT || "5000", 10),
  apiPrefix: process.env.API_PREFIX || "/api/v1",

  mongoUri: process.env.MONGODB_URI,

  clientUrls: (process.env.CLIENT_URL || "http://localhost:8080,http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    cookieExpiresDays: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "7", 10),
  },

  bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "300", 10),
  },

  logLevel: process.env.LOG_LEVEL || "info",

  // Optional email (SMTP). If host is empty, mail is logged instead of sent —
  // so the app works end-to-end without SMTP configured.
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM || "Nirmala Foundation <no-reply@nirmalafoundation.org.np>",
  },
  adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL || "",

  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || "Nirmala Admin",
    email: (process.env.SEED_ADMIN_EMAIL || "admin@nirmala.org").toLowerCase(),
    password: process.env.SEED_ADMIN_PASSWORD || "admin123",
  },
};

export default config;
