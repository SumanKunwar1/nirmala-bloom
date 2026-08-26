import mongoose from "mongoose";

/**
 * Atomic sequence generator — used for gapless receipt numbers.
 * One document per sequence key (e.g. "receipt:2026").
 */
const schema = new mongoose.Schema(
  {
    _id: { type: String },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

const Counter = mongoose.model("Counter", schema);

/** Increment and return the next value for `key`. Safe under concurrency. */
export async function nextSequence(key) {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return doc.seq;
}

export default Counter;
