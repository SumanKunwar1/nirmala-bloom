import mongoose from "mongoose";
import config from "./index.js";
import logger from "../utils/logger.js";

/** Connect to MongoDB Atlas with sensible pool + timeout settings. */
export async function connectDB() {
  mongoose.set("strictQuery", true);

  const conn = await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  logger.info(`MongoDB connected → ${conn.connection.host}/${conn.connection.name}`);

  mongoose.connection.on("error", (err) => logger.error("MongoDB error:", err.message));
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
  mongoose.connection.on("reconnected", () => logger.info("MongoDB reconnected"));

  return conn.connection;
}

export async function disconnectDB() {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
}
