/** Seed dataset — mirrors the frontend's initial content. */

const U = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroSlides = [
  { eyebrow: "Nirmala Foundation · Nepal", title: "More than support — we build belonging.", text: "Empowering communities, breaking barriers, and inspiring futures for people with disabilities across Nepal.", image: U("1559027615-cd4628902d4a"), order: 0 },
  { eyebrow: "Adaptive Sports", title: "Every person deserves a place to play.", text: "From wheelchair basketball to para-badminton, sport is how many Nepalis with disabilities step into public life.", image: U("1593113598332-cd288d649433"), order: 1 },
  { eyebrow: "Inclusion is a right", title: "Breaking barriers, inspiring futures.", text: "Globally, 1 in 6 people live with a disability. We build the pathways that turn ability into opportunity.", image: U("1542810634-71277d95dcbb"), order: 2 },
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
  { slug: "adaptive-sports", title: "Adaptive Sports", icon: "🏀", color: "#6B2FA0", tagline: "Sport is a right, not a privilege.", desc: "Wheelchair basketball, para-badminton, amputee football, and inclusive recreation.", image: U("1593113598332-cd288d649433"), body: "<p>Adaptive sport is the doorway many Nepalis with disabilities use to step into public life.</p>", goals: ["Make competitive and recreational sport accessible.", "Develop athletes who can represent Nepal.", "Break public stigma through visibility."], highlights: [{ value: "250+", label: "Active athletes" }, { value: "4", label: "Disciplines" }, { value: "12", label: "Partner sites" }], gallery: [], donateSlug: "sports-equipment", published: true, order: 0 },
  { slug: "inclusive-arts", title: "Inclusive Arts", icon: "🎨", color: "#F97316", tagline: "Every voice deserves a canvas.", desc: "Visual arts, music, handicrafts, and creative expression for all abilities.", image: U("1452860606245-08befc0ff44b"), body: "<p>Arts reach where words don't.</p>", goals: ["Give people a platform for self-expression.", "Turn creative work into income.", "Build inclusive creative spaces."], highlights: [{ value: "80+", label: "Active artists" }, { value: "12wk", label: "Seasons" }, { value: "1", label: "Storefront" }], gallery: [], donateSlug: "art-music-materials", published: true, order: 1 },
  { slug: "education", title: "Education", icon: "📚", color: "#2D7A4F", tagline: "Inclusion begins in the classroom.", desc: "VAK-based inclusive learning programs and school supply distribution.", image: U("1497486751825-1233686d5d80"), body: "<p>We close the accessibility gap classroom by classroom.</p>", goals: ["Ensure children learn alongside peers.", "Equip schools with accessible materials.", "Reduce dropout."], highlights: [{ value: "7", label: "Partner schools" }, { value: "12", label: "Districts" }, { value: "500+", label: "Children" }], gallery: [], donateSlug: "school-supplies", published: true, order: 2 },
  { slug: "mobility-access", title: "Mobility & Access", icon: "♿", color: "#9B5DD5", tagline: "Freedom moves on wheels.", desc: "Assistive devices, wheelchair provision, and inclusive infrastructure.", image: U("1559757175-5700dde675bc"), body: "<p>A properly-fitted wheelchair is the start of school, work, sport, and friendship.</p>", goals: ["Provide appropriate mobility devices.", "Reduce injury through proper fitting.", "Advocate for accessible infrastructure."], highlights: [{ value: "1 in 6", label: "Lack a device" }, { value: "100%", label: "Fitted" }, { value: "Year-round", label: "Provision" }], gallery: [], donateSlug: "wheelchair-fund", published: true, order: 3 },
  { slug: "health-wellness", title: "Health & Wellness", icon: "🏥", color: "#E11D48", tagline: "Care that reaches the last mile.", desc: "Rural health camps, medicine distribution, mental wellness support.", image: U("1576091160550-2173dba999ef"), body: "<p>A predictable medicine supply is the difference between treating and only diagnosing.</p>", goals: ["Bring healthcare to rural communities.", "Support mental wellness.", "Turn no one away."], highlights: [{ value: "~120", label: "Patients/camp" }, { value: "0", label: "Turned away" }, { value: "Year-round", label: "Outreach" }], gallery: [], donateSlug: "rural-health-medicines", published: true, order: 4 },
  { slug: "community-travel", title: "Community & Travel", icon: "🌍", color: "#0891B2", tagline: "Nature and culture belong to everyone.", desc: "Adaptive hikes, treks, tours, and inclusive recreation rides across Nepal.", image: U("1488521787991-ed7bbaae773c"), body: "<p>From adaptive treks to four-wheel scooter rides — independence, wellbeing, and the open road.</p>", goals: ["Break barriers to exploring Nepal.", "Foster independence and wellness.", "Advance inclusive tourism."], highlights: [{ value: "3", label: "Trek routes" }, { value: "4-wheel", label: "Scooter rides" }, { value: "Nationwide", label: "Reach" }], gallery: [], donateSlug: "general-fund", published: true, order: 5 },
];

export const team = [
  { name: "Nirmala Bhandari", role: "Founder & Executive Director", bio: "National wheelchair basketball player, para-powerlifter, D-30 Honoree 2025.", photo: U("1494790108377-be9c29b29330", 600), order: 0 },
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

export const stories = [
  { slug: "women-amputee-football-2025", title: "Women's Amputee Football Launches in Kathmandu", category: "Events", date: "December 8, 2025", excerpt: "Nepal's inaugural women's amputee football tournament brought together 24 athletes.", readTime: "4 min", image: U("1542751371-adc38448a05e"), body: "<p>A historic first for inclusion in Nepali sport.</p>", published: true, order: 0 },
  { slug: "d30-honoree-2025", title: "Founder Named to D-30 Disability Impact List", category: "News", date: "October 15, 2025", excerpt: "Recognized globally for advancing inclusion through sport and advocacy.", readTime: "3 min", image: U("1573164574572-cb89e39749b4"), body: "<p>A proud moment for the whole team.</p>", published: true, order: 1 },
  { slug: "godawari-yoga-retreat", title: "Inclusive Yoga at Godawari Botanical Gardens", category: "Stories", date: "August 22, 2025", excerpt: "A morning of breath, movement, and belonging in nature.", readTime: "5 min", image: U("1545389336-cf090694435e"), body: "<p>Our first inclusive wellness retreat.</p>", published: true, order: 2 },
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
  { slug: "sports-2024", title: "Sports Programs 2024", color: "#6B2FA0", cover: U("1626284800725-30c4e6cfa39d", 900), images: [], order: 0 },
  { slug: "arts-exhibition", title: "Arts Exhibition", color: "#F97316", cover: U("1513475382585-d06e58bcb0e0", 900), images: [], order: 1 },
  { slug: "godawari-retreat", title: "Godawari Yoga Retreat", color: "#2D7A4F", cover: U("1545389336-cf090694435e", 900), images: [], order: 2 },
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
    phone: "+977 9800000000",
    email: "info@nirmalafoundation.org.np",
    whatsapp: "9779800000000",
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

export const donations = [
  { donor: "Ram Shrestha", email: "ram.s@example.com", amount: 5000, campaignSlug: "wheelchair-fund", campaignTitle: "Wheelchair Fund", method: "eSewa", status: "completed", anonymous: false, message: "Keep up the great work!" },
  { donor: "Anonymous", email: "hidden@example.com", amount: 25000, campaignSlug: "wheelchair-fund", campaignTitle: "Wheelchair Fund", method: "Bank transfer", status: "completed", anonymous: true },
  { donor: "Sarah Mitchell", email: "sarah.m@example.org", amount: 10000, campaignSlug: "school-supplies", campaignTitle: "School Supplies", method: "Card", status: "completed", anonymous: false },
  { donor: "Kavita Joshi", email: "kavita.j@example.com", amount: 50000, campaignSlug: "general-fund", campaignTitle: "General Fund", method: "Bank transfer", status: "pending", anonymous: false },
  { donor: "Daniel Roberts", email: "d.roberts@example.org", amount: 8000, campaignSlug: "rural-health-medicines", campaignTitle: "Rural Health Medicines", method: "Card", status: "completed", anonymous: false },
];

export const submissions = [
  { name: "Aarati Koirala", email: "aarati.k@example.com", phone: "+977 9812345678", subject: "Volunteer", message: "I'd love to volunteer at your rural health camps. How can I get involved?", read: false },
  { name: "James Whitfield", email: "j.whitfield@example.org", phone: "", subject: "Partnership", message: "We'd like to explore a partnership for your wheelchair basketball programme.", read: false },
];

export const subscribers = [
  { email: "supporter1@example.com", source: "footer", active: true },
  { email: "supporter2@example.com", source: "newsletter-strip", active: true },
];
