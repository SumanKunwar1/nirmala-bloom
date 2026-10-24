/** Seed dataset — mirrors the frontend's initial content. */

const U = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// The foundation's own photography (Cloudinary) — same numbering as
// frontend/src/lib/images.ts.
const PHOTO = {
  1: "WhatsApp_Image_2026-06-21_at_14.34.00_1",
  2: "WhatsApp_Image_2026-06-21_at_14.34.00_2",
  3: "WhatsApp_Image_2026-06-21_at_14.34.00_3",
  4: "WhatsApp_Image_2026-06-21_at_14.34.00_4",
  5: "WhatsApp_Image_2026-06-21_at_14.34.00_5",
  6: "WhatsApp_Image_2026-06-21_at_14.34.01_1",
  7: "WhatsApp_Image_2026-06-21_at_14.34.01_2",
  8: "WhatsApp_Image_2026-06-21_at_14.49.39",
  9: "WhatsApp_Image_2026-06-21_at_14.49.39_1",
  10: "WhatsApp_Image_2026-06-21_at_14.49.40",
  11: "WhatsApp_Image_2026-06-21_at_14.49.40_1",
  12: "WhatsApp_Image_2026-06-21_at_14.54.48_1",
  13: "WhatsApp_Image_2026-06-21_at_14.54.48_2",
  14: "WhatsApp_Image_2026-06-21_at_14.54.48_3",
  15: "WhatsApp_Image_2026-06-21_at_14.54.48_4",
  16: "WhatsApp_Image_2026-06-21_at_14.54.50",
  17: "WhatsApp_Image_2026-06-21_at_14.54.50_1",
  18: "WhatsApp_Image_2026-06-21_at_14.54.50_2",
  19: "WhatsApp_Image_2026-06-21_at_14.54.50_3",
};
const P = (n, w = 1200) => `https://res.cloudinary.com/jrztjf3x/image/upload/f_auto,q_auto,w_${w}/${PHOTO[n]}.jpg`;
const FOUNDER_PORTRAIT =
  "https://res.cloudinary.com/dihev9qxc/image/upload/v1782112531/WhatsApp_Image_2026-06-21_at_14.34.01_kskchp.jpg";

export const heroSlides = [
  { eyebrow: "Nirmala Foundation · Nepal", title: "More than support — we build belonging.", text: "Empowering communities, breaking barriers, and inspiring futures for people with disabilities across Nepal.", image: P(12, 1600), order: 0 },
  { eyebrow: "Adaptive Sports", title: "Every person deserves a place to play.", text: "From wheelchair basketball to para-badminton, sport is how many Nepalis with disabilities step into public life.", image: P(4, 1600), order: 1 },
  { eyebrow: "Inclusion is a right", title: "Breaking barriers, inspiring futures.", text: "Globally, 1 in 6 people live with a disability. We build the pathways that turn ability into opportunity.", image: P(14, 1600), order: 2 },
];

export const impactStats = [
  { label: "Children Reached", value: 500, suffix: "+", order: 0 },
  { label: "Schools Reached", value: 7, suffix: "", order: 1 },
  { label: "Partner Organizations", value: 5, suffix: "+", order: 2 },
  { label: "Disability Types Served", value: 6, suffix: "", order: 3 },
];

export const testimonials = [
  { quote: "Nirmala Foundation gave me my first wheelchair — and the courage to play basketball at a national level.", name: "Suman R.", role: "Athlete, Wheelchair Basketball", order: 0 },
  { quote: "The art program changed my daughter's life. She found her voice through painting.", name: "Pratima D.", role: "Parent", order: 1 },
  { quote: "Working with this team showed me what real inclusion looks like in practice.", name: "Bikash T.", role: "Volunteer", order: 2 },
];

export const programs = [
  { slug: "adaptive-sports", title: "Adaptive Sports", icon: "🏀", color: "#6B2FA0", tagline: "Sport is a right, not a privilege.", desc: "Wheelchair basketball, para-badminton, amputee football, and inclusive recreation.", image: P(4, 1000), body: "<p>Adaptive sport is the doorway many Nepalis with disabilities use to step into public life.</p>", goals: ["Make competitive and recreational sport accessible.", "Develop athletes who can represent Nepal.", "Break public stigma through visibility."], highlights: [{ value: "250+", label: "Active athletes" }, { value: "4", label: "Disciplines" }, { value: "12", label: "Partner sites" }], gallery: [], donateSlug: "sports-equipment", published: true, order: 0 },
  { slug: "inclusive-arts", title: "Inclusive Arts", icon: "🎨", color: "#F97316", tagline: "Every voice deserves a canvas.", desc: "Visual arts, music, handicrafts, and creative expression for all abilities.", image: U("1452860606245-08befc0ff44b"), body: "<p>Arts reach where words don't.</p>", goals: ["Give people a platform for self-expression.", "Turn creative work into income.", "Build inclusive creative spaces."], highlights: [{ value: "80+", label: "Active artists" }, { value: "12wk", label: "Seasons" }, { value: "1", label: "Storefront" }], gallery: [], donateSlug: "art-music-materials", published: true, order: 1 },
  { slug: "education", title: "Education", icon: "📚", color: "#2D7A4F", tagline: "Inclusion begins in the classroom.", desc: "VAK-based inclusive learning programs and school supply distribution.", image: P(14, 1000), body: "<p>We close the accessibility gap classroom by classroom.</p>", goals: ["Ensure children learn alongside peers.", "Equip schools with accessible materials.", "Reduce dropout."], highlights: [{ value: "7", label: "Partner schools" }, { value: "12", label: "Districts" }, { value: "500+", label: "Children" }], gallery: [], donateSlug: "school-supplies", published: true, order: 2 },
  { slug: "mobility-access", title: "Mobility & Access", icon: "♿", color: "#9B5DD5", tagline: "Freedom moves on wheels.", desc: "Assistive devices, wheelchair provision, and inclusive infrastructure.", image: P(1, 1000), body: "<p>A properly-fitted wheelchair is the start of school, work, sport, and friendship.</p>", goals: ["Provide appropriate mobility devices.", "Reduce injury through proper fitting.", "Advocate for accessible infrastructure."], highlights: [{ value: "1 in 6", label: "Lack a device" }, { value: "100%", label: "Fitted" }, { value: "Year-round", label: "Provision" }], gallery: [], donateSlug: "wheelchair-fund", published: true, order: 3 },
  { slug: "health-wellness", title: "Health & Wellness", icon: "🏥", color: "#E11D48", tagline: "Care that reaches the last mile.", desc: "Rural health camps, medicine distribution, mental wellness support.", image: P(13, 1000), body: "<p>A predictable medicine supply is the difference between treating and only diagnosing.</p>", goals: ["Bring healthcare to rural communities.", "Support mental wellness.", "Turn no one away."], highlights: [{ value: "~120", label: "Patients/camp" }, { value: "0", label: "Turned away" }, { value: "Year-round", label: "Outreach" }], gallery: [], donateSlug: "rural-health-medicines", published: true, order: 4 },
  { slug: "community-travel", title: "Community & Travel", icon: "🌍", color: "#0891B2", tagline: "Nature and culture belong to everyone.", desc: "Adaptive hikes, treks, tours, and inclusive recreation rides across Nepal.", image: P(10, 1000), body: "<p>From adaptive treks to four-wheel scooter rides — independence, wellbeing, and the open road.</p>", goals: ["Break barriers to exploring Nepal.", "Foster independence and wellness.", "Advance inclusive tourism."], highlights: [{ value: "3", label: "Trek routes" }, { value: "4-wheel", label: "Scooter rides" }, { value: "Nationwide", label: "Reach" }], gallery: [], donateSlug: "general-fund", published: true, order: 5 },
];

export const team = [
  { name: "Nirmala Bhandari", role: "Founder & Executive Director", bio: "National wheelchair basketball player, para-powerlifter, D-30 Honoree 2025.", photo: FOUNDER_PORTRAIT, order: 0 },
  { name: "Anjali Sharma", role: "Programs Director", bio: "Leads the adaptive sports and inclusive arts portfolios.", photo: U("1507003211169-0a1dd7228f2d", 600), order: 1 },
  { name: "Bikash Thapa", role: "Operations Lead", bio: "Coordinates logistics, partnerships, and community outreach.", photo: U("1438761681033-6461ffad8d80", 600), order: 2 },
  { name: "Sita Gurung", role: "Education Coordinator", bio: "Designs VAK-based inclusive curricula.", photo: U("1531123897727-8f129e1688ce", 600), order: 3 },
  { name: "Rajan KC", role: "Community Liaison", bio: "Connects beneficiaries with program opportunities.", photo: U("1599566150163-29194dcaad36", 600), order: 4 },
  { name: "Maya Shrestha", role: "Communications", bio: "Storytelling, press, and digital advocacy.", photo: U("1573496359142-b8d87734a5a2", 600), order: 5 },
];

export const milestones = [
  { year: "Jan 2024", title: "Foundation Established", desc: "Nirmala Bhandari founds Nirmala Foundation Nepal in Kathmandu.", order: 0 },
  { year: "Mar 2024", title: "First Pilot Program", desc: "Inclusive sports pilot launches at Vidhya Byayam.", order: 1 },
  { year: "Aug 2024", title: "Godawari Yoga Retreat", desc: "First inclusive wellness retreat at Godawari Botanical Gardens.", order: 2 },
  { year: "Jul 2025", title: "Utpala Cafe Pop-Up", desc: "Handicraft stall by artisans with disabilities.", order: 3 },
  { year: "Oct 2025", title: "D-30 Honoree", desc: "Founder named to D-30 Disability Impact List 2025.", order: 4 },
  { year: "Dec 2025", title: "Women's Amputee Football", desc: "Nepal's first women's amputee football tournament.", order: 5 },
];

/**
 * News & stories. Enough entries that the public listing actually pages
 * (9 per page), across every category the filter tabs offer.
 */
export const stories = [
  { slug: "women-amputee-football-2025", title: "Women's Amputee Football Launches in Kathmandu", category: "Events", date: "December 8, 2025", excerpt: "Nepal's inaugural women's amputee football tournament brought together 24 athletes from across the country.", readTime: "4 min", image: U("1542751371-adc38448a05e"), body: "<p>A historic first for inclusion in Nepali sport. Twenty-four athletes from seven districts met in Kathmandu for a weekend that many players described as the first time they had competed in front of a crowd.</p><p>The tournament was run with volunteer referees and donated kit, and closed with a commitment to make it an annual fixture.</p>", published: true, order: 0 },
  { slug: "d30-honoree-2025", title: "Founder Named to D-30 Disability Impact List", category: "News", date: "October 15, 2025", excerpt: "Recognized globally for advancing inclusion through sport and advocacy across the Himalayan region.", readTime: "3 min", image: P(6, 1000), body: "<p>A proud moment for the whole team. The D-30 list recognises thirty people worldwide whose work has measurably advanced disability inclusion.</p>", published: true, order: 1 },
  { slug: "godawari-yoga-retreat", title: "Inclusive Yoga at Godawari Botanical Gardens", category: "Stories", date: "August 22, 2025", excerpt: "A morning of breath, movement, and belonging in nature — our first inclusive wellness retreat.", readTime: "5 min", image: P(13, 1000), body: "<p>Our first inclusive wellness retreat brought together participants with and without disabilities for a morning of adaptive yoga among the gardens.</p>", published: true, order: 2 },
  { slug: "utpala-cafe-stall", title: "Handicrafts at the Utpala Cafe Pop-Up", category: "Events", date: "July 4, 2025", excerpt: "Artisans with disabilities showcased and sold original handicrafts to a packed weekend crowd.", readTime: "3 min", image: U("1513475382585-d06e58bcb0e0"), body: "<p>Every piece on the table was made in our weekend arts circles. By Sunday afternoon most of the stall had sold, and three artists took home their first earnings from their own work.</p>", published: true, order: 3 },
  { slug: "vidhya-byayam-pilot", title: "Pilot Sports Programme Expands at Vidhya Byayam", category: "News", date: "May 10, 2025", excerpt: "Our wheelchair basketball pilot grew to include para-badminton sessions for youth.", readTime: "4 min", image: P(5, 1000), body: "<p>What began as a single weekly basketball session now runs four days a week, with para-badminton added after players asked for it directly.</p>", published: true, order: 4 },
  { slug: "press-coverage-himalayan", title: "Press Feature in The Himalayan Times", category: "Press", date: "March 1, 2025", excerpt: "A founder profile tracing Nirmala's journey from Hope Centre resident to national para-athlete.", readTime: "6 min", image: P(3, 1000), body: "<p>The feature traced a path that started at the Hope Centre and runs through national wheelchair basketball, para-powerlifting and the founding of this organisation.</p>", published: true, order: 5 },
  { slug: "wheelchair-fitting-camp-pokhara", title: "Wheelchair Fitting Camp Reaches Pokhara", category: "Events", date: "February 18, 2025", excerpt: "Forty-two people were assessed and fitted over two days, with follow-up physiotherapy scheduled.", readTime: "4 min", image: P(1, 1000), body: "<p>Proper fitting matters as much as the chair itself. Over two days a visiting physiotherapist assessed forty-two people, and every chair issued was adjusted on site.</p>", published: true, order: 6 },
  { slug: "braille-library-partner-school", title: "A Braille Library Opens at a Partner School", category: "Stories", date: "January 22, 2025", excerpt: "Large-print and braille titles reached a classroom that had inclusive policy but no materials.", readTime: "5 min", image: U("1497486751825-1233686d5d80"), body: "<p>The school had an inclusive-education policy on paper for three years. What it did not have was a single book a blind student could read.</p>", published: true, order: 7 },
  { slug: "coach-training-cohort-2024", title: "First Coach Development Cohort Graduates", category: "News", date: "November 30, 2024", excerpt: "Eighteen local coaches completed inclusive para-sport methodology training.", readTime: "3 min", image: P(16, 1000), body: "<p>Eighteen coaches from five districts completed the programme, which covers classification, adaptive drills and injury prevention.</p>", published: true, order: 8 },
  { slug: "rural-health-camp-sindhupalchok", title: "Rural Health Camp Treats 120 in Sindhupalchok", category: "Events", date: "October 5, 2024", excerpt: "Volunteer physicians ran a full-day camp with essential medicines distributed free.", readTime: "4 min", image: U("1576091160550-2173dba999ef"), body: "<p>A full day, four volunteer physicians, and roughly a hundred and twenty patients seen — many of whom had not been examined by a doctor in over a year.</p>", published: true, order: 9 },
  { slug: "adaptive-trek-langtang", title: "Adaptive Trek Reaches Langtang Valley", category: "Stories", date: "September 12, 2024", excerpt: "Six trekkers with mobility impairments completed a route long assumed to be closed to them.", readTime: "7 min", image: P(8, 1000), body: "<p>The route was mapped over three scouting trips. Six trekkers, four guides and a great deal of improvised engineering later, the group reached the valley.</p>", published: true, order: 10 },
  { slug: "un-women-nepal-recognition", title: "UN Women Nepal Recognition", category: "Press", date: "June 20, 2024", excerpt: "Our founder was honoured for work at the intersection of gender and disability.", readTime: "3 min", image: P(7, 1000), body: "<p>The recognition highlighted work at the intersection of gender and disability — an area still badly under-served across the region.</p>", published: true, order: 11 },
  { slug: "inclusive-music-circle-launch", title: "Inclusive Music Circle Launches in Lalitpur", category: "News", date: "April 8, 2024", excerpt: "Harmonium, tabla and percussion sessions open to every ability level.", readTime: "3 min", image: U("1511671782779-c97d3d27a1d4"), body: "<p>Adaptive grips and a patient tutor turned out to be the only two things standing between a lot of people and making music together.</p>", published: true, order: 12 },
  { slug: "foundation-established-2024", title: "Nirmala Foundation Nepal Is Established", category: "News", date: "January 15, 2024", excerpt: "A woman with a disability founds the organisation her own life made necessary.", readTime: "4 min", image: P(12, 1000), body: "<p>Registered in Kathmandu in January 2024, founded and led by people with lived experience of disability.</p>", published: true, order: 13 },
];

export const involveWays = [
  { icon: "🙌", title: "Volunteer", text: "Give your time at camps, tournaments, and tutoring circles.", cta: "Become a volunteer", order: 0 },
  { icon: "🤝", title: "Partner with us", text: "Co-design inclusive programmes and share resources.", cta: "Start a partnership", order: 1 },
  { icon: "💛", title: "Donate", text: "Fund wheelchairs, equipment, school supplies, and health camps.", cta: "Make a donation", order: 2 },
  { icon: "📣", title: "Fundraise", text: "Run a campaign among friends, family, or colleagues.", cta: "Start fundraising", order: 3 },
];

export const resources = [
  { title: "Annual Report 2024", category: "Annual Reports", year: "2024", desc: "Year in review: programs, beneficiaries, financials.", url: "#", order: 0 },
  { title: "Disability Inclusion in Nepali Schools", category: "Research", year: "2025", desc: "Field study across 12 districts on inclusive classroom practices.", url: "#", order: 1 },
  { title: "Policy Brief: Mobility Access in Kathmandu", category: "Policy Briefs", year: "2025", desc: "Recommendations for inclusive urban infrastructure.", url: "#", order: 2 },
  { title: "Adaptive Sports Coaching Guide", category: "Guides", year: "2024", desc: "Practical handbook for inclusive sports coaches.", url: "#", order: 3 },
];

export const galleryAlbums = [
  { slug: "sports-2024", title: "Sports Programs 2024", color: "#6B2FA0", cover: P(5, 900), images: [P(4, 1400), P(5, 1400), P(1, 1400), P(2, 1400), P(6, 1400), P(19, 1400)], order: 0 },
  { slug: "arts-exhibition", title: "Arts Exhibition", color: "#F97316", cover: U("1513475382585-d06e58bcb0e0", 900), images: [], order: 1 },
  { slug: "godawari-retreat", title: "Godawari Yoga Retreat", color: "#2D7A4F", cover: P(13, 900), images: [P(13, 1400), P(16, 1400), P(17, 1400), P(9, 1400), P(15, 1400), P(18, 1400)], order: 2 },
];

export const partners = [
  { name: "UN Women Nepal", tagline: "Gender equality & advocacy", desc: "Partner on gender and disability advocacy initiatives.", region: "International", type: "Strategic", since: "2024", areas: ["Gender", "Advocacy", "Research"], url: "https://nepal.unwomen.org", color: "#0091D5", logo: "", featured: true, order: 0 },
  { name: "New Futures Nepal", tagline: "Inclusion & rehabilitation", desc: "Long-term strategic collaborator on disability inclusion.", region: "International", type: "Strategic", since: "2024", areas: ["Inclusion", "Rehabilitation"], url: "https://newfuturesnepal.org", color: "#6B2FA0", logo: "", featured: false, order: 1 },
  { name: "Utpala Cafe", tagline: "Arts pop-ups & community", desc: "Hosts inclusive arts pop-ups and handicraft sales.", region: "National", type: "Community", since: "2024", areas: ["Arts", "Retail"], url: "#", color: "#E11D48", logo: "", featured: false, order: 2 },
];

export const settings = {
  site: {
    siteName: "Nirmala Foundation Nepal",
    tagline: "Breaking Barriers, Building Belonging",
    description: "Empowering people with disabilities through sports, arts, education & mobility in Nepal.",
    logo: "",
    primaryColor: "#5B2C86",
    seoTitle: "Nirmala Foundation Nepal — Breaking Barriers, Building Belonging",
    seoDescription: "Empowering people with disabilities through sports, arts, education & mobility in Nepal.",
    seoKeywords: "disability inclusion Nepal, adaptive sports, Nirmala Foundation, Kathmandu NGO",
  },
  about: {
    heroTitle: "Building belonging across Nepal.",
    heroSubtitle: "A Kathmandu-based foundation working on disability inclusion.",
    founderName: "Nirmala Bhandari",
    founderRole: "Founder & Executive Director",
    founderImage: "",
    founderStory: "<p>Founded in January 2024 by Nirmala Bhandari — a woman with a disability whose own life is the reason this organisation exists.</p>",
    founderHonours: ["National wheelchair basketball player", "Para-powerlifter", "Miss Disability Queen", "D-30 Disability Impact List 2025"],
    mission: "To empower people with disabilities in Nepal through inclusive sports, arts, education, and mobility.",
    vision: "A Nepal where every person — regardless of ability — belongs, contributes, and thrives.",
    values: "Dignity, accessibility, joy, community, and unwavering advocacy.",
  },
  contact: {
    address: "Kathmandu, Nepal",
    phone: "+977 986-8948425",
    email: "info@nirmalafoundation.org.np",
    whatsapp: "9779868948425",
    hours: "Sun–Fri, 10:00 AM – 5:00 PM",
    mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=85.30%2C27.69%2C85.34%2C27.72&layer=mapnik",
    facebook: "https://www.facebook.com/profile.php?id=61552918304022",
    instagram: "https://www.instagram.com/nirmala_foundation.np",
    youtube: "https://www.youtube.com/@NirmalaFoundationcares.org.np.",
    linkedin: "https://www.linkedin.com/in/nirmalafoundation-6b2697312/",
  },
  footer: {
    aboutText: "Empowering communities, breaking barriers, and inspiring futures for people with disabilities across Nepal.",
    newsletterHeading: "Add hope to your inbox",
    newsletterText: "Monthly stories from the field, program updates, and simple ways to get involved.",
    copyright: "© 2025 Nirmala Foundation Nepal. Registered NGO, Nepal.",
    legalLinks: [{ label: "Privacy Policy", url: "#" }, { label: "Terms", url: "#" }],
  },
};

export { campaigns } from "./campaigns.js";

/**
 * Sample donation records.
 *
 * `baseAmount` is set explicitly because insertMany() bypasses the model's
 * pre-save hook. Foreign-currency rows show the multi-currency path Global
 * IME's international acquiring enables.
 */
export const donations = [
  { donor: "Ram Shrestha", email: "ram.s@example.com", amount: 5000, currency: "NPR", baseAmount: 5000, fxRate: 1, campaignSlug: "wheelchair-fund", campaignTitle: "Wheelchair Fund", gateway: "globalime", method: "Global IME · Mobile Banking", status: "completed", anonymous: false, message: "Keep up the great work!", source: "web", receiptNo: "NF-2025-000001", completedAt: new Date("2025-11-14T04:20:00Z") },
  { donor: "Anonymous", email: "hidden@example.com", amount: 25000, currency: "NPR", baseAmount: 25000, fxRate: 1, campaignSlug: "wheelchair-fund", campaignTitle: "Wheelchair Fund", gateway: "manual", method: "Bank transfer", status: "completed", anonymous: true, source: "manual", receiptNo: "NF-2025-000002", completedAt: new Date("2025-12-02T09:05:00Z") },
  { donor: "Sarah Mitchell", email: "sarah.m@example.org", amount: 150, currency: "USD", baseAmount: 21225, fxRate: 141.5, country: "United States", campaignSlug: "school-supplies", campaignTitle: "School Supplies", gateway: "globalime", method: "Global IME · VISA ****4242", status: "completed", anonymous: false, source: "web", receiptNo: "NF-2025-000003", completedAt: new Date("2026-01-19T16:40:00Z") },
  { donor: "Kavita Joshi", email: "kavita.j@example.com", amount: 50000, currency: "NPR", baseAmount: 50000, fxRate: 1, campaignSlug: "general-fund", campaignTitle: "General Fund", gateway: "manual", method: "Bank transfer", status: "pending", anonymous: false, source: "web" },
  { donor: "Daniel Roberts", email: "d.roberts@example.org", amount: 60, currency: "GBP", baseAmount: 10704, fxRate: 178.4, country: "United Kingdom", campaignSlug: "rural-health-medicines", campaignTitle: "Rural Health Medicines", gateway: "globalime", method: "Global IME · MASTERCARD ****8891", status: "completed", anonymous: false, source: "web", receiptNo: "NF-2026-000001", completedAt: new Date("2026-03-07T11:15:00Z") },
  { donor: "Prakash Adhikari", email: "prakash.a@example.com", amount: 12000, currency: "NPR", baseAmount: 12000, fxRate: 1, campaignSlug: "sports-equipment", campaignTitle: "Sports Equipment", gateway: "globalime", method: "Global IME · Internet Banking", status: "completed", anonymous: false, recurring: true, frequency: "monthly", message: "For the basketball squad.", source: "web", receiptNo: "NF-2026-000002", completedAt: new Date("2026-06-11T06:30:00Z") },
];

/** Highest receipt sequence used per year above — keeps live numbering gapless. */
export const receiptCounters = { 2025: 3, 2026: 2 };

export const submissions = [
  { name: "Aarati Koirala", email: "aarati.k@example.com", phone: "+977 9812345678", subject: "Volunteer", message: "I'd love to volunteer at your rural health camps. How can I get involved?", read: false },
  { name: "James Whitfield", email: "j.whitfield@example.org", phone: "", subject: "Partnership", message: "We'd like to explore a partnership for your wheelchair basketball programme.", read: false },
];

export const subscribers = [
  { email: "supporter1@example.com", source: "footer", active: true },
  { email: "supporter2@example.com", source: "newsletter-strip", active: true },
];
