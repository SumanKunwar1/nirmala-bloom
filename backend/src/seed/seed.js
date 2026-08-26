import mongoose from "mongoose";
import config from "../config/index.js";
import { connectDB, disconnectDB } from "../config/db.js";
import logger from "../utils/logger.js";

import User from "../models/User.js";
import HeroSlide from "../models/HeroSlide.js";
import ImpactStat from "../models/ImpactStat.js";
import Testimonial from "../models/Testimonial.js";
import Program from "../models/Program.js";
import TeamMember from "../models/TeamMember.js";
import Milestone from "../models/Milestone.js";
import Story from "../models/Story.js";
import InvolveWay from "../models/InvolveWay.js";
import Resource from "../models/Resource.js";
import GalleryAlbum from "../models/GalleryAlbum.js";
import Partner from "../models/Partner.js";
import Setting from "../models/Setting.js";
import Donation from "../models/Donation.js";
import Submission from "../models/Submission.js";
import Subscriber from "../models/Subscriber.js";
import Campaign from "../models/Campaign.js";
import Payment from "../models/Payment.js";
import Counter from "../models/Counter.js";
import { syncAllCampaignTotals } from "../services/donation.service.js";

import * as data from "./data.js";

const contentModels = [
  HeroSlide, ImpactStat, Testimonial, Program, TeamMember, Milestone,
  Story, InvolveWay, Resource, GalleryAlbum, Partner, Setting, Campaign, Donation, Payment,
  Counter, Submission, Subscriber,
];

async function destroy() {
  await Promise.all([...contentModels.map((M) => M.deleteMany({})), User.deleteMany({})]);
  logger.warn("All collections cleared.");
}

async function seed() {
  // Clear content collections (keep it idempotent), then insert.
  await Promise.all(contentModels.map((M) => M.deleteMany({})));

  // Admin user (upsert so re-seeding doesn't duplicate)
  const existing = await User.findOne({ email: config.seedAdmin.email });
  if (!existing) {
    await User.create({
      name: config.seedAdmin.name,
      email: config.seedAdmin.email,
      password: config.seedAdmin.password,
      role: "admin",
    });
    logger.info(`Admin created → ${config.seedAdmin.email}`);
  } else {
    logger.info(`Admin already exists → ${config.seedAdmin.email}`);
  }

  await HeroSlide.insertMany(data.heroSlides);
  await ImpactStat.insertMany(data.impactStats);
  await Testimonial.insertMany(data.testimonials);
  await Program.insertMany(data.programs);
  await TeamMember.insertMany(data.team);
  await Milestone.insertMany(data.milestones);
  await Story.insertMany(data.stories);
  await InvolveWay.insertMany(data.involveWays);
  await Resource.insertMany(data.resources);
  await GalleryAlbum.insertMany(data.galleryAlbums);
  await Partner.insertMany(data.partners);
  await Campaign.insertMany(data.campaigns);
  await Donation.insertMany(data.donations);

  // Continue receipt numbering from the seeded records rather than restarting
  // at 1 — a duplicate receipt number is an accounting problem, not a bug.
  await Counter.bulkWrite(
    Object.entries(data.receiptCounters).map(([year, seq]) => ({
      updateOne: { filter: { _id: `receipt:${year}` }, update: { seq }, upsert: true },
    })),
  );
  await Submission.insertMany(data.submissions);
  await Subscriber.insertMany(data.subscribers);

  await Setting.bulkWrite(
    Object.entries(data.settings).map(([key, value]) => ({
      updateOne: { filter: { key }, update: { data: value }, upsert: true },
    })),
  );

  // Derive each campaign's online totals from the donations just inserted.
  const synced = await syncAllCampaignTotals();
  logger.info(`Campaign totals synced → ${synced} campaign(s)`);

  logger.info("✅ Seed complete.");
}

async function run() {
  try {
    await connectDB();
    if (process.argv.includes("--destroy")) {
      await destroy();
    } else {
      await seed();
    }
  } catch (err) {
    logger.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
    await mongoose.disconnect();
  }
}

run();
