import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import config from "./config/index.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

// Behind a proxy (Render/Railway/Heroku/Nginx) — needed for secure cookies & rate limit.
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS — allow configured client origins (and any origin in development)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !config.isProd || config.clientUrls.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Body parsing (large limit to allow base64 image payloads from the admin)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// Sanitize against NoSQL injection & HTTP param pollution
app.use(mongoSanitize());
app.use(hpp());

// Gzip responses
app.use(compression());

// Request logging (dev only)
if (!config.isProd) app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) =>
  res.json({ success: true, status: "ok", env: config.env, uptime: process.uptime() }),
);

// API
app.use(config.apiPrefix, apiLimiter, routes);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

export default app;
