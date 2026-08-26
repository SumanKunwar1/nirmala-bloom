import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const env = process.env.NODE_ENV || "development";

/**
 * Parses "USD:141.5,EUR:153.2" into { USD: 141.5, EUR: 153.2 }.
 * Values are units of the base currency per 1 unit of the listed currency.
 */
function parseFxRates(raw) {
  const rates = { NPR: 1 };
  (raw || "USD:141.5,EUR:153.2,GBP:178.4,AUD:92.1,CAD:101.6,INR:1.6,JPY:0.93,SGD:104.8,AED:38.5")
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [code, value] = pair.split(":");
      const rate = Number(value);
      if (code && Number.isFinite(rate) && rate > 0) rates[code.trim().toUpperCase()] = rate;
    });
  return rates;
}

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

  /* ------------------------------------------------------------------ *
   * Payments
   *
   * Everything below is driven by env vars so no credential ever lives in
   * the repo. Each gateway is independently toggleable; the generic block
   * holds settings shared by all of them.
   * ------------------------------------------------------------------ */
  payments: {
    // Currency donations are reported/aggregated in.
    baseCurrency: (process.env.PAYMENT_BASE_CURRENCY || "NPR").toUpperCase(),

    // Currencies the donate form may accept (Global IME settles international cards).
    supportedCurrencies: (process.env.PAYMENT_SUPPORTED_CURRENCIES || "NPR,USD,EUR,GBP,AUD,CAD,INR,JPY,SGD,AED")
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean),

    // Static FX table → units of base currency per 1 unit of the listed currency.
    // DUMMY RATES — replace with a live FX feed or your bank's daily card rate.
    fxRates: parseFxRates(process.env.PAYMENT_FX_RATES),

    // Gateway used when the client does not name one.
    defaultGateway: process.env.PAYMENT_DEFAULT_GATEWAY || "globalime",

    // Where the gateway sends the donor back to (frontend pages).
    returnUrl: process.env.PAYMENT_RETURN_URL || "http://localhost:8080/donate/thank-you",
    cancelUrl: process.env.PAYMENT_CANCEL_URL || "http://localhost:8080/donate?cancelled=1",

    // Public base URL of THIS api — used to build callback/webhook URLs sent
    // to the gateway. Must be publicly reachable in production.
    publicUrl: (process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, ""),

    // How long an unfinished payment stays claimable before it is expired.
    sessionTtlMinutes: parseInt(process.env.PAYMENT_SESSION_TTL_MINUTES || "45", 10),

    /* --------------------- Global IME Bank gateway --------------------- */
    // DUMMY CREDENTIALS — swap for the live values from your Global IME
    // merchant onboarding pack. Leave `mode` as "mock" until you have them:
    // in mock mode the full donate → pay → verify → receipt flow runs
    // locally with no outbound call to the bank.
    globalime: {
      enabled: process.env.GLOBALIME_ENABLED !== "false",
      // "mock"    → simulated locally, no network call (default, safe)
      // "sandbox" → hit the bank's UAT host with test credentials
      // "live"    → production
      mode: process.env.GLOBALIME_MODE || "mock",
      baseUrl: process.env.GLOBALIME_BASE_URL || "https://uat-paymentgateway.globalimebank.com.np",
      merchantId: process.env.GLOBALIME_MERCHANT_ID || "NF-DUMMY-MERCHANT-001",
      merchantName: process.env.GLOBALIME_MERCHANT_NAME || "Nirmala Foundation Nepal",
      acquirerId: process.env.GLOBALIME_ACQUIRER_ID || "GIBLNPKA",
      terminalId: process.env.GLOBALIME_TERMINAL_ID || "NFTERM01",
      apiKey: process.env.GLOBALIME_API_KEY || "dummy_api_key_replace_me",
      secretKey: process.env.GLOBALIME_SECRET_KEY || "dummy_secret_key_replace_me",
      webhookSecret: process.env.GLOBALIME_WEBHOOK_SECRET || "dummy_webhook_secret_replace_me",
      // Endpoint paths, kept configurable because banks move them between
      // UAT and production without changing the contract.
      checkoutPath: process.env.GLOBALIME_CHECKOUT_PATH || "/api/v1/payment/initiate",
      verifyPath: process.env.GLOBALIME_VERIFY_PATH || "/api/v1/payment/verify",
      statusPath: process.env.GLOBALIME_STATUS_PATH || "/api/v1/payment/status",
      refundPath: process.env.GLOBALIME_REFUND_PATH || "/api/v1/payment/refund",
      currencies: (process.env.GLOBALIME_CURRENCIES || "NPR,USD,EUR,GBP,AUD,CAD,INR,JPY,SGD,AED")
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      timeoutMs: parseInt(process.env.GLOBALIME_TIMEOUT_MS || "20000", 10),
    },

    /* ------------------ Manual / offline bank transfer ------------------ */
    // No API — the donor is shown account details and the admin marks the
    // record completed once the transfer lands.
    manual: {
      enabled: process.env.MANUAL_PAYMENT_ENABLED !== "false",
      bankName: process.env.MANUAL_BANK_NAME || "Global IME Bank Ltd.",
      accountName: process.env.MANUAL_ACCOUNT_NAME || "Nirmala Foundation Nepal",
      accountNumber: process.env.MANUAL_ACCOUNT_NUMBER || "0000000000000000",
      branch: process.env.MANUAL_BANK_BRANCH || "New Baneshwor, Kathmandu",
      swift: process.env.MANUAL_BANK_SWIFT || "GLBBNPKA",
      instructions:
        process.env.MANUAL_PAYMENT_INSTRUCTIONS ||
        "Transfer to the account above and email your receipt to info@nirmalafoundation.org.np quoting your reference number.",
    },
  },

  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || "Nirmala Admin",
    email: (process.env.SEED_ADMIN_EMAIL || "admin@nirmala.org").toLowerCase(),
    password: process.env.SEED_ADMIN_PASSWORD || "admin123",
  },
};

export default config;
