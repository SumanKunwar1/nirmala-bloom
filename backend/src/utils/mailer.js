import config from "../config/index.js";
import logger from "./logger.js";

let transporter = null;
let attempted = false;

async function getTransporter() {
  if (!config.smtp.host) return null;
  if (attempted) return transporter;
  attempted = true;
  try {
    const nodemailer = (await import("nodemailer")).default;
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    });
    logger.info("SMTP transporter ready");
  } catch (err) {
    logger.error("Failed to init SMTP transporter:", err.message);
    transporter = null;
  }
  return transporter;
}

/**
 * Send an email. If SMTP is not configured the message is logged and skipped,
 * so callers never fail. Fire-and-forget friendly.
 */
export async function sendMail({ to, subject, text, html }) {
  if (!to) return { skipped: true, reason: "no recipient" };
  const t = await getTransporter();
  if (!t) {
    logger.info(`[mail skipped — SMTP off] to=${to} subject="${subject}"`);
    return { skipped: true };
  }
  try {
    const info = await t.sendMail({ from: config.smtp.from, to, subject, text, html });
    logger.info(`[mail sent] to=${to} id=${info.messageId}`);
    return { sent: true, id: info.messageId };
  } catch (err) {
    logger.error("[mail error]", err.message);
    return { error: err.message };
  }
}

/** Notify the admin inbox address, if configured. */
export function notifyAdmin({ subject, text, html }) {
  if (!config.adminNotifyEmail) return Promise.resolve({ skipped: true });
  return sendMail({ to: config.adminNotifyEmail, subject, text, html });
}
