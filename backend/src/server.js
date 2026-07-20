import http from "node:http";
import app from "./app.js";
import config from "./config/index.js";
import { connectDB, disconnectDB } from "./config/db.js";
import logger from "./utils/logger.js";

let server;

async function start() {
  await connectDB();

  server = http.createServer(app);
  server.listen(config.port, () => {
    logger.info(`🚀 API listening on http://localhost:${config.port}${config.apiPrefix} (${config.env})`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server:", err.message);
  process.exit(1);
});

/** Graceful shutdown. */
async function shutdown(signal) {
  logger.warn(`${signal} received — shutting down gracefully…`);
  try {
    if (server) await new Promise((resolve) => server.close(resolve));
    await disconnectDB();
    logger.info("Shutdown complete");
    process.exit(0);
  } catch (err) {
    logger.error("Error during shutdown:", err.message);
    process.exit(1);
  }
  setTimeout(() => process.exit(1), 10000).unref();
}

["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => shutdown(sig)));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err);
  process.exit(1);
});
