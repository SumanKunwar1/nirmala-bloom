/**
 * Curated Unsplash photo references for the Nirmala Foundation site.
 * Photos are hot-linked via Unsplash's CDN with sensible width/quality params.
 * The client can swap any of these for real foundation photography later
 * — every consumer reads from this file, so it's a single point of change.
 */

const U = (id: string, w = 1200, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/**
 * The foundation's own photography, hosted on its Cloudinary account.
 * Numbered in upload order; f_auto/q_auto let Cloudinary pick WebP/AVIF.
 */
const PHOTOS = [
  "WhatsApp_Image_2026-06-21_at_14.34.00_1", // 1  wheelchair push-rim close-up
  "WhatsApp_Image_2026-06-21_at_14.34.00_2", // 2  founder at a Sport 4 Community session
  "WhatsApp_Image_2026-06-21_at_14.34.00_3", // 3  speaking at an advocacy event
  "WhatsApp_Image_2026-06-21_at_14.34.00_4", // 4  wheelchair athlete throwing on court
  "WhatsApp_Image_2026-06-21_at_14.34.00_5", // 5  sport wheelchair, outdoor training
  "WhatsApp_Image_2026-06-21_at_14.34.01_1", // 6  founder at a stadium
  "WhatsApp_Image_2026-06-21_at_14.34.01_2", // 7  panel discussion
  "WhatsApp_Image_2026-06-21_at_14.49.39", //   8  riders' group photo under prayer flags
  "WhatsApp_Image_2026-06-21_at_14.49.39_1", // 9  community circle on a terrace
  "WhatsApp_Image_2026-06-21_at_14.49.40", //   10 scooter ride, arms raised by the lake
  "WhatsApp_Image_2026-06-21_at_14.49.40_1", // 11 resting on a mountain road
  "WhatsApp_Image_2026-06-21_at_14.54.48_1", // 12 Nirmala Foundation banner group
  "WhatsApp_Image_2026-06-21_at_14.54.48_2", // 13 outdoor yoga session
  "WhatsApp_Image_2026-06-21_at_14.54.48_3", // 14 children cheering with the team
  "WhatsApp_Image_2026-06-21_at_14.54.48_4", // 15 visitors with a young participant
  "WhatsApp_Image_2026-06-21_at_14.54.50", //   16 sharing circle on the grass
  "WhatsApp_Image_2026-06-21_at_14.54.50_1", // 17 wide sharing circle with children
  "WhatsApp_Image_2026-06-21_at_14.54.50_2", // 18 founder laughing (portrait)
  "WhatsApp_Image_2026-06-21_at_14.54.50_3", // 19 thumbs up on the field (portrait)
];
const P = (n: number, w = 1200) =>
  `https://res.cloudinary.com/jrztjf3x/image/upload/f_auto,q_auto,w_${w}/${PHOTOS[n - 1]}.jpg`;

export const imgs = {
  // Hero collage — sports + community + joy
  heroAthlete: P(4, 900),
  heroCommunity: P(9, 1400),
  heroJoy: P(14, 1400),
  heroNepal: P(8, 1400),

  // Founder — Nirmala Bhandari (real foundation photography)
  founderPortrait:
    "https://res.cloudinary.com/dihev9qxc/image/upload/v1782112531/WhatsApp_Image_2026-06-21_at_14.34.01_kskchp.jpg",
  founderAction: P(5, 1100),
  founderCommunity: P(12, 1600),
  founderAbout: P(2, 1200),

  // About — story / founder / team feel
  aboutStory: P(3, 1100),
  aboutFounder: P(6, 900),
  aboutTeam: P(12, 1200),

  // Page heroes — soft contextual imagery
  pageAbout: P(3, 900),
  pagePrograms: P(5, 900),
  pageNews: P(7, 900),
  pageGallery: P(8, 900),
  pageResources: P(16, 900),
  pagePartners: P(15, 900),
  pageContact: P(9, 900),
  pageDonate: P(14, 900),

  // Programs — one image per program slug
  programAdaptiveSports: P(4, 1000),
  programInclusiveArts: U("1452860606245-08befc0ff44b", 1000),
  programEducation: P(14, 1000),
  programMobilityAccess: P(1, 1000),
  programHealthWellness: P(13, 1000),
  programCommunityTravel: P(10, 1000),

  // News thumbnails (will rotate by post)
  newsAmputeeFootball: U("1542751371-adc38448a05e", 1000),
  newsD30: P(6, 1000),
  newsGodawari: P(13, 1000),
  newsUtpala: U("1452860606245-08befc0ff44b", 1000),
  newsVidhya: P(5, 1000),
  newsPress: P(3, 1000),

  // Gallery albums
  gallerySports: P(5, 900),
  galleryArts: U("1513475382585-d06e58bcb0e0", 900),
  galleryRetreat: P(13, 900),
  galleryFootball: U("1571019613454-1cb2f99b2d8b", 900),
  galleryUtpala: U("1452860606245-08befc0ff44b", 900),
  galleryHealth: U("1576091160550-2173dba999ef", 900),

  // Team / people — generic warm portraits to stand in
  person1: U("1494790108377-be9c29b29330", 600),
  person2: U("1507003211169-0a1dd7228f2d", 600),
  person3: U("1438761681033-6461ffad8d80", 600),
  person4: U("1531123897727-8f129e1688ce", 600),
  person5: U("1599566150163-29194dcaad36", 600),
  person6: U("1573496359142-b8d87734a5a2", 600),
};

export const programImages: Record<string, string> = {
  "adaptive-sports": imgs.programAdaptiveSports,
  "inclusive-arts": imgs.programInclusiveArts,
  education: imgs.programEducation,
  "mobility-access": imgs.programMobilityAccess,
  "health-wellness": imgs.programHealthWellness,
  "community-travel": imgs.programCommunityTravel,
};

/** A small set of gallery photos per program slug for the detail page. */
export const programGallery: Record<string, string[]> = {
  "adaptive-sports": [P(4, 700), P(5, 700), P(1, 700), P(2, 700), P(6, 700), P(19, 700)],
  "inclusive-arts": [
    U("1452860606245-08befc0ff44b", 700),
    U("1513475382585-d06e58bcb0e0", 700),
    U("1460661419201-fd4cecdf8a8b", 700),
    U("1560421683-6856ea585c78", 700),
    U("1547891654-e66ed7ebb968", 700),
    U("1541961017774-22349e4a1262", 700),
  ],
  education: [
    P(14, 700),
    P(17, 700),
    P(16, 700),
    P(12, 700),
    U("1580582932707-520aed937b7b", 700),
    U("1427504494785-3a9ca7044f45", 700),
  ],
  "mobility-access": [
    P(1, 700),
    P(4, 700),
    P(5, 700),
    U("1519494026892-80bbd2d6fd0d", 700),
    U("1454165804606-c3d57bc86b40", 700),
    U("1488521787991-ed7bbaae773c", 700),
  ],
  "health-wellness": [
    P(13, 700),
    P(16, 700),
    P(9, 700),
    U("1544367567-0f2fcb009e0b", 700),
    U("1571019614242-c5c5dee9f50b", 700),
    U("1518241353330-0f7941c2d9b5", 700),
  ],
  "community-travel": [
    P(10, 700),
    P(8, 700),
    P(11, 700),
    P(9, 700),
    P(15, 700),
    U("1476514525535-07fb3b4ae5f1", 700),
  ],
};

export const newsImages: Record<string, string> = {
  "women-amputee-football-2025": imgs.newsAmputeeFootball,
  "d30-honoree-2025": imgs.newsD30,
  "godawari-yoga-retreat": imgs.newsGodawari,
  "utpala-cafe-stall": imgs.newsUtpala,
  "vidhya-byayam": imgs.newsVidhya,
  "press-coverage-himalayan": imgs.newsPress,
};

export const partnerImages: Record<string, string> = {
  "UN Women Nepal": P(7, 900),
  "New Futures Nepal": P(15, 900),
  "Bodhisattvas in Action": U("1542178243-bc20204b769f", 900),
  "Utpala Cafe": U("1554118811-1e0d58224f24", 900),
  "Vidhya Byayam": P(5, 900),
  "Godawari Botanical Gardens": P(13, 900),
  "The Himalayan Times": U("1495020689067-958852a7765e", 900),
  "Daraz Nepal": U("1607082348824-0a96f2a4b9da", 900),
};

export const campaignImages: Record<string, string> = {
  "wheelchair-fund": P(1, 1100),
  "school-supplies": P(14, 1100),
  "sports-equipment": P(4, 1100),
  "art-music-materials": U("1513475382585-d06e58bcb0e0", 1100),
  "rural-health-medicines": U("1576091160550-2173dba999ef", 1100),
  "general-fund": P(12, 1100),
};

export const galleryImages: Record<string, string> = {
  "sports-2024": imgs.gallerySports,
  "arts-exhibition": imgs.galleryArts,
  "godawari-retreat": imgs.galleryRetreat,
  "amputee-football": imgs.galleryFootball,
  "utpala-popup": imgs.galleryUtpala,
  "rural-health": imgs.galleryHealth,
};

export const teamPhotos = [
  imgs.person1,
  imgs.person2,
  imgs.person3,
  imgs.person4,
  imgs.person5,
  imgs.person6,
];

export const sharedValues = [
  { icon: "🤝", label: "Dignity", text: "Every person, every ability." },
  { icon: "🌈", label: "Inclusion", text: "Built into every program." },
  { icon: "✨", label: "Joy", text: "Belonging that feels alive." },
];
