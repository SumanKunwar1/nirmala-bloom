/**
 * Curated Unsplash photo references for the Nirmala Foundation site.
 * Photos are hot-linked via Unsplash's CDN with sensible width/quality params.
 * The client can swap any of these for real foundation photography later
 * — every consumer reads from this file, so it's a single point of change.
 */

const U = (id: string, w = 1200, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const imgs = {
  // Hero collage — sports + community + joy
  heroAthlete: U("1593113598332-cd288d649433", 900),
  heroCommunity: U("1559027615-cd4628902d4a", 900),
  heroJoy: U("1542810634-71277d95dcbb", 900),
  heroNepal: U("1488521787991-ed7bbaae773c", 1400),

  // Founder — Nirmala Bhandari (real foundation photography)
  founderPortrait:
    "https://res.cloudinary.com/dihev9qxc/image/upload/v1782112531/WhatsApp_Image_2026-06-21_at_14.34.01_kskchp.jpg",
  founderAction: U("1593113598332-cd288d649433", 1100),
  founderCommunity:
    "https://res.cloudinary.com/dihev9qxc/image/upload/v1782112730/WhatsApp_Image_2026-06-21_at_14.54.48_hz72m6.jpg",
  founderAbout:
    "https://res.cloudinary.com/dihev9qxc/image/upload/v1782229980/WhatsApp_Image_2026-06-21_at_14.34.00_uhye5p.jpg",

  // About — story / founder / team feel
  aboutStory: U("1573497019418-b400bb3ab074", 1100),
  aboutFounder: U("1573497019940-1c28c88b4f3e", 900),
  aboutTeam: U("1517048676732-d65bc937f952", 1200),

  // Page heroes — soft contextual imagery
  pageAbout: U("1582213782179-e0d53f98f2ca", 900),
  pagePrograms: U("1574623452334-1e0ac2b3ccb4", 900),
  pageNews: U("1504711434969-e33886168f5c", 900),
  pageGallery: U("1492684223066-81342ee5ff30", 900),
  pageResources: U("1481627834876-b7833e8f5570", 900),
  pagePartners: U("1521737711867-e3b97375f902", 900),
  pageContact: U("1551632811-561732d1e306", 900),
  pageDonate: U("1532629345422-7515f3d16bb6", 900),

  // Programs — one image per program slug
  programAdaptiveSports: U("1593113598332-cd288d649433", 1000),
  programInclusiveArts: U("1452860606245-08befc0ff44b", 1000),
  programEducation: U("1497486751825-1233686d5d80", 1000),
  programMobilityAccess: U("1597764690523-15bea4c581c9", 1000),
  programHealthWellness: U("1576091160550-2173dba999ef", 1000),
  programCommunityTravel: U("1488521787991-ed7bbaae773c", 1000),

  // News thumbnails (will rotate by post)
  newsAmputeeFootball: U("1542751371-adc38448a05e", 1000),
  newsD30: U("1573164574572-cb89e39749b4", 1000),
  newsGodawari: U("1545389336-cf090694435e", 1000),
  newsUtpala: U("1452860606245-08befc0ff44b", 1000),
  newsVidhya: U("1574623452334-1e0ac2b3ccb4", 1000),
  newsPress: U("1495020689067-958852a7765e", 1000),

  // Gallery albums
  gallerySports: U("1504450758481-7338eba7524a", 900),
  galleryArts: U("1513475382585-d06e58bcb0e0", 900),
  galleryRetreat: U("1545389336-cf090694435e", 900),
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
  "adaptive-sports": [
    U("1593113598332-cd288d649433", 700),
    U("1542751371-adc38448a05e", 700),
    U("1571019613454-1cb2f99b2d8b", 700),
    U("1519861531473-9200262188bf", 700),
    U("1504450758481-7338eba7524a", 700),
    U("1574623452334-1e0ac2b3ccb4", 700),
  ],
  "inclusive-arts": [
    U("1452860606245-08befc0ff44b", 700),
    U("1513475382585-d06e58bcb0e0", 700),
    U("1460661419201-fd4cecdf8a8b", 700),
    U("1560421683-6856ea585c78", 700),
    U("1547891654-e66ed7ebb968", 700),
    U("1541961017774-22349e4a1262", 700),
  ],
  education: [
    U("1497486751825-1233686d5d80", 700),
    U("1503676260728-1c00da094a0b", 700),
    U("1509062522246-3755977927d7", 700),
    U("1524995997946-a1c2e315a42f", 700),
    U("1580582932707-520aed937b7b", 700),
    U("1427504494785-3a9ca7044f45", 700),
  ],
  "mobility-access": [
    U("1597764690523-15bea4c581c9", 700),
    U("1576765608535-5f04d1e3f289", 700),
    U("1584515933487-779824d29309", 700),
    U("1519494026892-80bbd2d6fd0d", 700),
    U("1454165804606-c3d57bc86b40", 700),
    U("1488521787991-ed7bbaae773c", 700),
  ],
  "health-wellness": [
    U("1576091160550-2173dba999ef", 700),
    U("1505751172876-fa1923c5c528", 700),
    U("1545389336-cf090694435e", 700),
    U("1544367567-0f2fcb009e0b", 700),
    U("1571019614242-c5c5dee9f50b", 700),
    U("1518241353330-0f7941c2d9b5", 700),
  ],
  "community-travel": [
    U("1488521787991-ed7bbaae773c", 700),
    U("1544735716-392fe2489ffa", 700),
    U("1464822759023-fed622ff2c3b", 700),
    U("1506905925346-21bda4d32df4", 700),
    U("1519681393784-d120267933ba", 700),
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
  "UN Women Nepal": U("1573164574572-cb89e39749b4", 900),
  "New Futures Nepal": U("1559027615-cd4628902d4a", 900),
  "Bodhisattvas in Action": U("1542178243-bc20204b769f", 900),
  "Utpala Cafe": U("1554118811-1e0d58224f24", 900),
  "Vidhya Byayam": U("1519861531473-9200262188bf", 900),
  "Godawari Botanical Gardens": U("1545389336-cf090694435e", 900),
  "The Himalayan Times": U("1495020689067-958852a7765e", 900),
  "Daraz Nepal": U("1607082348824-0a96f2a4b9da", 900),
};

export const campaignImages: Record<string, string> = {
  "wheelchair-fund": U("1597764690523-15bea4c581c9", 1100),
  "school-supplies": U("1497486751825-1233686d5d80", 1100),
  "sports-equipment": U("1542810634-71277d95dcbb", 1100),
  "art-music-materials": U("1513475382585-d06e58bcb0e0", 1100),
  "rural-health-medicines": U("1576091160550-2173dba999ef", 1100),
  "general-fund": U("1559027615-cd4628902d4a", 1100),
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
