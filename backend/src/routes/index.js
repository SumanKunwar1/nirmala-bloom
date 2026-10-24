import { Router } from "express";

import crudRouter from "./crud.routes.js";
import authRoutes from "./auth.routes.js";
import submissionRoutes from "./submission.routes.js";
import donationRoutes from "./donation.routes.js";
import settingRoutes from "./setting.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import campaignRoutes from "./campaign.routes.js";
import paymentRoutes from "./payment.routes.js";
import uploadRoutes from "./upload.routes.js";

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

const router = Router();

// Auth
router.use("/auth", authRoutes);

// Home page collections
router.use("/hero-slides", crudRouter(HeroSlide));
router.use("/impact-stats", crudRouter(ImpactStat));
router.use("/testimonials", crudRouter(Testimonial));

// Programs & about
router.use("/programs", crudRouter(Program, { hasSlug: true }));
router.use("/team", crudRouter(TeamMember));
router.use("/milestones", crudRouter(Milestone));

// Content sections
router.use("/stories", crudRouter(Story, { hasSlug: true, hasCategories: true }));
router.use("/involve-ways", crudRouter(InvolveWay));
router.use("/resources", crudRouter(Resource, { hasCategories: true }));
router.use("/gallery-albums", crudRouter(GalleryAlbum, { hasSlug: true }));
router.use("/partners", crudRouter(Partner));

// Fundraising
router.use("/campaigns", campaignRoutes);
router.use("/donations", donationRoutes);
router.use("/payments", paymentRoutes);

// Singletons + inbox + forms
router.use("/settings", settingRoutes);
router.use("/submissions", submissionRoutes);
router.use("/newsletter", newsletterRoutes);

// Admin media
router.use("/uploads", uploadRoutes);

export default router;
