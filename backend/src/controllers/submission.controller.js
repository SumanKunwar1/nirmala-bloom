import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success, created } from "../utils/ApiResponse.js";
import { sendMail, notifyAdmin } from "../utils/mailer.js";
import Submission from "../models/Submission.js";

/** POST /submissions — PUBLIC (contact form). */
export const create = asyncHandler(async (req, res) => {
  const { name, email, message, phone, subject } = req.body;
  if (!name || !email || !message) {
    throw ApiError.badRequest("Name, email and message are required");
  }
  const doc = await Submission.create({ name, email, phone, subject, message });

  // Notify the team (safe no-op if SMTP is off).
  notifyAdmin({
    subject: `New contact message: ${doc.subject}`,
    text: `From: ${doc.name} <${doc.email}>${doc.phone ? ` (${doc.phone})` : ""}\n\n${doc.message}`,
  });

  return created(res, { id: doc.id }, "Thanks — your message has been received.");
});

/** PATCH /submissions/:id/read — toggle read state. */
export const markRead = asyncHandler(async (req, res) => {
  const read = req.body.read !== undefined ? Boolean(req.body.read) : true;
  const doc = await Submission.findByIdAndUpdate(req.params.id, { read }, { new: true });
  if (!doc) throw ApiError.notFound("Submission not found");
  return success(res, doc, "Updated");
});

/** POST /submissions/:id/reply — email a reply and record it. */
export const reply = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) throw ApiError.badRequest("Reply message is required");

  const doc = await Submission.findById(req.params.id);
  if (!doc) throw ApiError.notFound("Submission not found");

  const result = await sendMail({
    to: doc.email,
    subject: `Re: ${doc.subject} — Nirmala Foundation`,
    text: message,
  });

  doc.replied = true;
  doc.replyMessage = message;
  doc.repliedAt = new Date();
  doc.read = true;
  await doc.save();

  return success(res, doc, result.sent ? "Reply sent" : "Reply saved (email delivery skipped/unavailable)");
});

/** GET /submissions/stats — unread + total counts. */
export const stats = asyncHandler(async (req, res) => {
  const [total, unread] = await Promise.all([
    Submission.countDocuments(),
    Submission.countDocuments({ read: false }),
  ]);
  return success(res, { total, unread });
});
