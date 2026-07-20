export const socialLinks = {
  facebook: "https://www.facebook.com/profile.php?id=61552918304022",
  instagram: "https://www.instagram.com/nirmala_foundation.np?igsh=cDlic2w2cGdxZ2Y0",
  youtube: "https://www.youtube.com/@NirmalaFoundationcares.org.np./featured",
  linkedin: "https://www.linkedin.com/in/nirmalafoundation-6b2697312/",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Resources", href: "/resources" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
] as const;

export type Program = {
  slug: string;
  title: string;
  icon: string;
  color: string;
  /** Short one-line summary used on cards. */
  desc: string;
  /** Punchy motto shown on the detail hero. */
  tagline: string;
  /** 2–3 intro paragraphs describing the program's philosophy. */
  philosophy: string[];
  /** What the program sets out to achieve. */
  goals: string[];
  /** The concrete things we run, with a title + short blurb. */
  activities: { icon: string; title: string; text: string }[];
  /** Program-specific stats for the impact strip. */
  highlights: { value: string; label: string }[];
  /** What a participant walks away with. */
  outcomes: string[];
  /** Where the program runs. */
  locations: string[];
  /** Matching donation campaign slug for the "Donate now" CTA. */
  donateSlug: string;
  /** SEO overrides — fall back to title/desc when omitted. */
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
};

export const programs: Program[] = [
  {
    slug: "adaptive-sports",
    title: "Adaptive Sports",
    icon: "🏀",
    color: "#6B2FA0",
    desc: "Wheelchair basketball, para-badminton, amputee football, and inclusive recreation.",
    tagline: "Sport is a right, not a privilege.",
    philosophy: [
      "Adaptive sport is the doorway many Nepalis with disabilities use to step into public life. On the court, a wheelchair stops being a symbol of limitation and becomes a piece of equipment — the same as anyone else's boots or racket.",
      "We run year-round training in wheelchair basketball, para-badminton, and amputee football, and we support athletes all the way from their first session to national selection. Coaching, equipment, court time, and travel grants are provided so that talent — not cost — decides who plays.",
    ],
    goals: [
      "Make competitive and recreational sport accessible to Nepalis of every ability.",
      "Develop a pipeline of athletes capable of representing Nepal nationally.",
      "Break public stigma by putting disabled athletes in front of new audiences.",
    ],
    activities: [
      { icon: "🏀", title: "Weekly training squads", text: "Regular wheelchair basketball, para-badminton, and amputee football sessions with certified coaches." },
      { icon: "🏆", title: "Tournaments & camps", text: "Seasonal competitions and intensive skill camps, including Nepal's first women's amputee football event." },
      { icon: "🎽", title: "Equipment & travel grants", text: "Sport wheelchairs, jerseys, and travel funding so athletes can compete beyond their district." },
      { icon: "🤝", title: "Coach development", text: "Training local coaches and volunteers in inclusive, para-sport methodology." },
    ],
    highlights: [
      { value: "250+", label: "Active athletes" },
      { value: "4", label: "Disciplines" },
      { value: "12", label: "Partner sites" },
    ],
    outcomes: [
      "Confidence, fitness, and a competitive outlet",
      "A team, a routine, and a community of peers",
      "A visible path to national representation",
    ],
    locations: ["Kathmandu Valley", "Vidhya Byayam", "Partner schools & courts"],
    donateSlug: "sports-equipment",
  },
  {
    slug: "inclusive-arts",
    title: "Inclusive Arts",
    icon: "🎨",
    color: "#F97316",
    desc: "Visual arts, music, handicrafts, and creative expression for all abilities.",
    tagline: "Every voice deserves a canvas.",
    philosophy: [
      "Arts reach where words don't. For many of our participants — including those who are non-verbal or living with intellectual disabilities — painting, music, and craft are the first language in which they are truly heard.",
      "Our weekly inclusive arts circles have grown into a small community enterprise. Original paintings and handicrafts made by artists with disabilities are showcased and sold at pop-ups like the Utpala Cafe stall, turning creative expression into recognition and income.",
    ],
    goals: [
      "Give people with disabilities a platform for self-expression and identity.",
      "Turn creative work into visibility, pride, and modest income.",
      "Build inclusive creative spaces that welcome every ability.",
    ],
    activities: [
      { icon: "🖌️", title: "Weekend arts circles", text: "Painting, drawing, and mixed-media sessions with adaptive grips and tools." },
      { icon: "🎵", title: "Inclusive music", text: "Harmonium, tabla, and percussion — group music-making open to all abilities." },
      { icon: "🧶", title: "Handicraft workshops", text: "Beadwork, weaving, and craft skills that build fine-motor confidence and product." },
      { icon: "🛍️", title: "Pop-up exhibitions", text: "Public showcases and sales at partner venues so artists earn and are seen." },
    ],
    highlights: [
      { value: "80+", label: "Active artists" },
      { value: "12wk", label: "Seasons per year" },
      { value: "1", label: "Community storefront" },
    ],
    outcomes: [
      "A creative outlet and a sense of authorship",
      "Public recognition through exhibitions",
      "Modest income from sold work",
    ],
    locations: ["Utpala Cafe pop-up", "Community centres", "Kathmandu Valley"],
    donateSlug: "art-music-materials",
  },
  {
    slug: "education",
    title: "Education",
    icon: "📚",
    color: "#2D7A4F",
    desc: "VAK-based inclusive learning programs and school supply distribution.",
    tagline: "Inclusion begins in the classroom.",
    philosophy: [
      "Many rural schools have inclusive policies on paper but lack the accessible materials children with disabilities need to actually participate. We close that gap classroom by classroom.",
      "Our approach is built on VAK (visual, auditory, kinaesthetic) learning — meeting each child through the channel that works best for them — alongside teacher training and the distribution of braille tools, large-print books, tactile kits, and everyday school supplies.",
    ],
    goals: [
      "Ensure children with disabilities can learn alongside their peers.",
      "Equip partner schools with accessible materials and trained teachers.",
      "Reduce dropout by removing practical and attitudinal barriers.",
    ],
    activities: [
      { icon: "🧑‍🏫", title: "Teacher training", text: "Workshops in inclusive, VAK-based classroom practice for partner-school staff." },
      { icon: "📖", title: "Accessible materials", text: "Braille slates, large-print textbooks, and tactile learning kits distributed to classrooms." },
      { icon: "🎒", title: "School supply drives", text: "Bags, stationery, and inclusive furniture for students who need them most." },
      { icon: "👨‍👩‍👧", title: "Family engagement", text: "Working with parents so support continues beyond the school gate." },
    ],
    highlights: [
      { value: "7", label: "Partner schools" },
      { value: "12", label: "Districts reached" },
      { value: "500+", label: "Children reached" },
    ],
    outcomes: [
      "Learning materials matched to each child",
      "Teachers confident in inclusive methods",
      "Higher attendance and lower dropout",
    ],
    locations: ["12 districts", "Partner schools", "Rural Nepal"],
    donateSlug: "school-supplies",
  },
  {
    slug: "mobility-access",
    title: "Mobility & Access",
    icon: "♿",
    color: "#9B5DD5",
    desc: "Assistive devices, wheelchair provision, and inclusive infrastructure projects.",
    tagline: "Freedom moves on wheels.",
    philosophy: [
      "A properly-fitted wheelchair is the start of school, work, sport, and friendship. Yet for many young Nepalis with mobility impairments, the wait for one stretches into years.",
      "We provide manual and sport wheelchairs, pediatric chairs, custom cushions, and repairs — all fitted with physiotherapy support — and we advocate for accessible infrastructure so that the journey doesn't end at the front door.",
    ],
    goals: [
      "Put an appropriate mobility device in the hands of everyone who needs one.",
      "Reduce injury and dependence through proper fitting and follow-up.",
      "Push for ramps, accessible transport, and inclusive public spaces.",
    ],
    activities: [
      { icon: "🦽", title: "Wheelchair provision", text: "Manual, pediatric, and sport-grade chairs, fitted to the individual." },
      { icon: "🩺", title: "Fitting & physiotherapy", text: "Assessment, fitting, and follow-up to prevent shoulder injury and pressure sores." },
      { icon: "🔧", title: "Repairs & maintenance", text: "Cushions, spares, and basic repairs that keep a device usable for years." },
      { icon: "🏗️", title: "Access advocacy", text: "Working with partners on ramps, accessible routes, and inclusive infrastructure." },
    ],
    highlights: [
      { value: "1 in 6", label: "Nepalis lack a device" },
      { value: "100%", label: "Fitted to the person" },
      { value: "Year-round", label: "Provision & repair" },
    ],
    outcomes: [
      "Independent movement at home and outside",
      "A device fitted to prevent long-term injury",
      "Access to school, work, and sport",
    ],
    locations: ["Community camps", "Kathmandu Valley", "Rural outreach"],
    donateSlug: "wheelchair-fund",
  },
  {
    slug: "health-wellness",
    title: "Health & Wellness",
    icon: "🏥",
    color: "#E11D48",
    desc: "Rural health camps, medicine distribution, mental wellness support.",
    tagline: "Care that reaches the last mile.",
    philosophy: [
      "Disability and chronic illness intersect, and rural communities are furthest from consistent care. A predictable medicine supply is the difference between a camp that treats and a camp that only diagnoses.",
      "We run rural health outreach camps in partnership with district clinics — providing basic medicines, wound care, chronic-disease management, and mental wellness support — alongside inclusive wellness retreats that treat rest and belonging as part of health.",
    ],
    goals: [
      "Bring essential healthcare to rural and underserved communities.",
      "Support mental wellness alongside physical treatment.",
      "Ensure no one is turned away for lack of supply.",
    ],
    activities: [
      { icon: "⛑️", title: "Rural health camps", text: "Half- and full-day camps with volunteer physicians treating ~120 patients each." },
      { icon: "💊", title: "Medicine distribution", text: "Essential medicines, wound care, and supplements delivered where clinics are scarce." },
      { icon: "🧘", title: "Wellness retreats", text: "Inclusive yoga and nature retreats, like our first at Godawari Botanical Gardens." },
      { icon: "💬", title: "Mental wellness support", text: "Peer support and counselling woven into every camp and program." },
    ],
    highlights: [
      { value: "~120", label: "Patients per camp" },
      { value: "0", label: "Turned away" },
      { value: "Year-round", label: "Outreach" },
    ],
    outcomes: [
      "Treatment and medicine, not just diagnosis",
      "Mental wellness support alongside physical care",
      "Dignity in how care is delivered",
    ],
    locations: ["Rural districts", "District clinics", "Godawari retreats"],
    donateSlug: "rural-health-medicines",
  },
  {
    slug: "community-travel",
    title: "Community & Travel",
    icon: "🌍",
    color: "#0891B2",
    desc: "Adaptive hikes, treks, tours, and inclusive recreation rides across Nepal.",
    tagline: "Nature and culture belong to everyone — every step tells a story.",
    philosophy: [
      "Nepal's mountains, temples, and villages are part of every citizen's inheritance. We design accessible experiences so that people with disabilities can explore that inheritance on their own terms — breaking down barriers to exploration and advancing inclusive tourism.",
      "From adaptive hikes and treks on iconic routes to cultural tours and our four-wheel scooter recreation rides, the goal is the same: independence, wellbeing, and the simple joy of the open road. Modified is more, denied — we break the barrier.",
    ],
    goals: [
      "Break down the physical barriers to exploring Nepal's landscapes and heritage.",
      "Foster independence, confidence, and physical & mental wellness.",
      "Advance inclusive tourism practices across the country.",
    ],
    activities: [
      { icon: "🥾", title: "Adaptive Hikes", text: "Accessible pathways through Nepal's scenic landscapes, designed to remove physical barriers and build mobility." },
      { icon: "🏔️", title: "Adaptive Treks", text: "Making iconic routes — Everest Base Camp, Annapurna Circuit, Langtang Valley — reachable for people with mobility challenges." },
      { icon: "🛕", title: "Adaptive Tours", text: "Cultural experiences at temples and traditional villages, open to every mobility level." },
      { icon: "🛵", title: "Recreation Rides", text: "Four-wheel scooter training and community rides — 'four wheels for free will' — through Nepal's hills and heritage." },
    ],
    highlights: [
      { value: "3", label: "Iconic trek routes" },
      { value: "4-wheel", label: "Scooter rides" },
      { value: "Nationwide", label: "Reach" },
    ],
    outcomes: [
      "Access to landscapes and heritage once out of reach",
      "Independence and confidence on the move",
      "Community, adventure, and belonging",
    ],
    locations: ["Everest Base Camp", "Annapurna & Langtang", "Boudha · Nagarkot · Lele"],
    donateSlug: "general-fund",
  },
];

export const impactStats = [
  { label: "Children Reached", value: 500, suffix: "+" },
  { label: "Schools Reached", value: 7, suffix: "" },
  { label: "Partner Organizations", value: 5, suffix: "+" },
  { label: "Disability Types Served", value: 6, suffix: "" },
];

export type DonationCampaign = {
  id: number;
  slug: string;
  title: string;
  icon: string;
  color: string;
  goal: number;
  raised: number;
  donors: number;
  urgent?: boolean;
  desc: string;
  longDesc: string;
  why: string;
  tiers: { amount: number; impact: string }[];
  stories: { name: string; quote: string; role: string }[];
};

export const donationCampaigns: DonationCampaign[] = [
  {
    id: 1,
    slug: "wheelchair-fund",
    title: "Wheelchair Fund",
    icon: "🦽",
    color: "#6B2FA0",
    goal: 500000,
    raised: 215000,
    donors: 87,
    urgent: true,
    desc: "Provide wheelchairs and mobility devices to Nepali youth with disabilities.",
    longDesc:
      "A wheelchair is more than a device — it's the start of school, work, sport, and friendship. For many young Nepalis with mobility impairments, the wait for a properly-fitted chair stretches for years. The Wheelchair Fund covers manual chairs, sport chairs, pediatric chairs, custom cushions, and basic repairs for beneficiaries identified through our community partners and rural camps.",
    why:
      "Roughly 1 in 6 Nepalis with disabilities lacks an appropriate mobility device. Locally-fitted chairs reduce shoulder injury, increase school attendance, and unlock participation in our adaptive sports programmes.",
    tiers: [
      { amount: 500, impact: "1 day of fitting & physiotherapy" },
      { amount: 5000, impact: "Custom cushions & basic repairs" },
      { amount: 25000, impact: "One full manual wheelchair, fitted" },
      { amount: 75000, impact: "One sport-grade basketball wheelchair" },
    ],
    stories: [
      {
        name: "Suman R.",
        role: "Athlete · Wheelchair Basketball",
        quote: "My first wheelchair came from this fund. Today I play at a national level.",
      },
    ],
  },
  {
    id: 2,
    slug: "school-supplies",
    title: "School Supplies",
    icon: "🎒",
    color: "#0891B2",
    goal: 200000,
    raised: 140000,
    donors: 64,
    desc: "Educational materials for inclusive classrooms across rural Nepal.",
    longDesc:
      "Textbooks in large print, braille tools, tactile learning kits, school bags, stationery, and accessible furniture for classrooms partnering with us on inclusive education across 12 districts.",
    why:
      "Many rural schools have inclusive policies on paper but lack the basic accessible learning materials children with disabilities need to actually participate. We close that gap school by school.",
    tiers: [
      { amount: 500, impact: "Stationery kit for one child" },
      { amount: 2500, impact: "Braille slate & tactile learning kit" },
      { amount: 10000, impact: "Library shelf for one classroom" },
      { amount: 50000, impact: "Full inclusive learning kit for a school" },
    ],
    stories: [
      {
        name: "Pratima D.",
        role: "Parent",
        quote: "My daughter could finally read her textbooks. Her teacher said she changed overnight.",
      },
    ],
  },
  {
    id: 3,
    slug: "sports-equipment",
    title: "Sports Equipment",
    icon: "🏀",
    color: "#F97316",
    goal: 300000,
    raised: 88000,
    donors: 41,
    desc: "Adaptive sports gear for wheelchair basketball and para-sports programs.",
    longDesc:
      "Basketballs, jerseys, para-badminton rackets, amputee football crutches, training cones, court time, referee fees, and travel grants for athletes competing nationally.",
    why:
      "Adaptive sport is the gateway many Nepalis with disabilities use to step into public life. Affordable equipment and travel are still the two biggest barriers.",
    tiers: [
      { amount: 1000, impact: "One basketball + jersey" },
      { amount: 5000, impact: "Training session for a 10-athlete squad" },
      { amount: 20000, impact: "Travel for an athlete to a national tournament" },
      { amount: 60000, impact: "Set of 5 sport wheelchairs (rentals)" },
    ],
    stories: [
      {
        name: "Bikash T.",
        role: "Coach",
        quote: "We went from one ball between fifteen players to a full kit. The level jumped overnight.",
      },
    ],
  },
  {
    id: 4,
    slug: "art-music-materials",
    title: "Art & Music Materials",
    icon: "🎨",
    color: "#E11D48",
    goal: 150000,
    raised: 62000,
    donors: 29,
    desc: "Paints, instruments, and craft supplies for the inclusive arts program.",
    longDesc:
      "Acrylic paints, canvases, hand-sized brushes, adaptive grips, harmonium, tabla, jingles, beads and looms for our weekend handicraft circles — plus stipends for our visiting tutors.",
    why:
      "Arts give voice where words don't reach. Our weekly inclusive arts circles have grown into a small community business selling work at the Utpala Cafe pop-up.",
    tiers: [
      { amount: 500, impact: "Paint & brush set for one artist" },
      { amount: 2500, impact: "Adaptive instrument grip kit" },
      { amount: 8000, impact: "One harmonium for the music circle" },
      { amount: 30000, impact: "Sponsor one full arts season (12 weeks)" },
    ],
    stories: [
      {
        name: "Anjali S.",
        role: "Artist",
        quote: "Selling my first painting at Utpala was the proudest day of my life.",
      },
    ],
  },
  {
    id: 5,
    slug: "rural-health-medicines",
    title: "Rural Health Medicines",
    icon: "💊",
    color: "#2D7A4F",
    goal: 250000,
    raised: 175000,
    donors: 73,
    desc: "Essential medicines for rural health outreach camps across Nepal.",
    longDesc:
      "Basic medicines, wound care, hypertension and diabetes management, pediatric supplements, and mental wellness support delivered through our rural health camps in partnership with district clinics.",
    why:
      "Disability and chronic illness intersect. A predictable medicine supply is the difference between a camp that treats and a camp that just diagnoses.",
    tiers: [
      { amount: 500, impact: "Medicines for one rural patient" },
      { amount: 2500, impact: "Wound-care kit for a camp day" },
      { amount: 10000, impact: "Run one half-day rural camp" },
      { amount: 40000, impact: "Sponsor a full rural camp (1 day, ~120 patients)" },
    ],
    stories: [
      {
        name: "Dr. Rina S.",
        role: "Volunteer Physician",
        quote: "We never have to turn anyone away anymore. The dignity of that is huge.",
      },
    ],
  },
  {
    id: 6,
    slug: "general-fund",
    title: "General Fund",
    icon: "🌐",
    color: "#9B5DD5",
    goal: 1000000,
    raised: 320000,
    donors: 156,
    desc: "Support all Nirmala Foundation programs — allocated where most needed.",
    longDesc:
      "Flexible funding lets us respond quickly: emergency wheelchairs after a road accident, a sudden travel grant for a national tournament, last-minute medicine for a camp, a roof repair at a partner school. Unrestricted giving is the most powerful gift you can make.",
    why:
      "Restricted grants don't cover the things that actually keep an NGO running — rent, electricity, salaries, accountancy, the rapid yes when a community asks for help. The General Fund does.",
    tiers: [
      { amount: 1000, impact: "One day of office operations" },
      { amount: 5000, impact: "One staff training session" },
      { amount: 25000, impact: "Emergency response for one beneficiary" },
      { amount: 100000, impact: "One month of programme overhead" },
    ],
    stories: [
      {
        name: "Maya S.",
        role: "Operations",
        quote: "Unrestricted donors trust us to read the room. That trust shows up in everything we do.",
      },
    ],
  },
];

export const newsPosts = [
  { slug: "women-amputee-football-2025", title: "Women's Amputee Football Launches in Kathmandu", category: "Events", date: "December 8, 2025", excerpt: "A historic first — Nepal's inaugural women's amputee football tournament brought together 24 athletes from across the country.", readTime: "4 min" },
  { slug: "d30-honoree-2025", title: "Founder Nirmala Bhandari Named to D-30 Disability Impact List", category: "News", date: "October 15, 2025", excerpt: "Recognized globally for advancing inclusion through sport and advocacy across the Himalayan region.", readTime: "3 min" },
  { slug: "godawari-yoga-retreat", title: "Inclusive Yoga at Godawari Botanical Gardens", category: "Stories", date: "August 22, 2025", excerpt: "A morning of breath, movement, and belonging — our first inclusive wellness retreat in nature.", readTime: "5 min" },
  { slug: "utpala-cafe-stall", title: "Handicrafts at Utpala Cafe Pop-Up", category: "Events", date: "July 4, 2025", excerpt: "Artisans with disabilities showcased and sold original handicrafts to a packed weekend crowd.", readTime: "3 min" },
  { slug: "vidhya-byayam", title: "Pilot Sports Program at Vidhya Byayam", category: "News", date: "May 10, 2025", excerpt: "Our wheelchair basketball pilot expanded to include para-badminton sessions for youth.", readTime: "4 min" },
  { slug: "press-coverage-himalayan", title: "Press Feature in The Himalayan Times", category: "Press", date: "March 1, 2025", excerpt: "Founder profile traces Nirmala's journey from Hope Centre resident to national para-athlete.", readTime: "6 min" },
];

export const team = [
  { name: "Nirmala Bhandari", role: "Founder & Executive Director", bio: "National wheelchair basketball player, para-powerlifter, Miss Disability Queen, D-30 Honoree 2025." },
  { name: "Anjali Sharma", role: "Programs Director", bio: "Leads the adaptive sports and inclusive arts portfolios across our Kathmandu sites." },
  { name: "Bikash Thapa", role: "Operations Lead", bio: "Coordinates logistics, partnerships, and community outreach for rural programs." },
  { name: "Sita Gurung", role: "Education Coordinator", bio: "Designs VAK-based inclusive curricula and trains partner-school teachers." },
  { name: "Rajan KC", role: "Community Liaison", bio: "Connects beneficiaries with mobility, health, and travel program opportunities." },
  { name: "Maya Shrestha", role: "Communications", bio: "Storytelling, press, and digital advocacy for the foundation." },
];

export type Partner = {
  name: string;
  tagline: string;
  desc: string;
  region: "International" | "National";
  type: "Strategic" | "Programme" | "Corporate" | "Community" | "Media";
  since: string;
  areas: string[];
  url: string;
  color: string;
  initials?: string;
  /** Real logo CDN URL — falls back to initials tile if it 404s. */
  logoDomain?: string;
  featured?: boolean;
};

export const partners: Partner[] = [
  {
    name: "UN Women Nepal",
    tagline: "Gender equality & advocacy",
    desc: "Partner on gender and disability advocacy initiatives — co-designed our Women & Disability research and the Miss Disability Queen platform.",
    region: "International",
    type: "Strategic",
    since: "2024",
    areas: ["Gender", "Advocacy", "Research"],
    url: "https://nepal.unwomen.org",
    color: "#0091D5",
    initials: "UN",
    logoDomain: "unwomen.org",
    featured: true,
  },
  {
    name: "New Futures Nepal",
    tagline: "Inclusion & rehabilitation",
    desc: "Long-term strategic collaborator on disability inclusion programming and rehabilitation pathways across the Kathmandu Valley.",
    region: "International",
    type: "Strategic",
    since: "2024",
    areas: ["Inclusion", "Rehabilitation", "Capacity-building"],
    url: "https://newfuturesnepal.org",
    color: "#6B2FA0",
    initials: "NF",
    logoDomain: "newfuturesnepal.org",
  },
  {
    name: "Bodhisattvas in Action",
    tagline: "Volunteers & outreach",
    desc: "Volunteer mobilization and community outreach support — runs our weekend tutoring circles and rural camp logistics.",
    region: "International",
    type: "Community",
    since: "2024",
    areas: ["Volunteers", "Outreach"],
    url: "https://bodhisattvasinaction.org",
    color: "#F97316",
    initials: "BA",
    logoDomain: "bodhisattvasinaction.org",
  },
  {
    name: "Utpala Cafe",
    tagline: "Arts pop-ups & community",
    desc: "Hosts inclusive arts pop-ups and community gatherings. The cafe's monthly stall has become the foundation's storefront for handicraft sales.",
    region: "National",
    type: "Community",
    since: "2024",
    areas: ["Arts", "Retail", "Events"],
    url: "#",
    color: "#E11D48",
    initials: "UC",
  },
  {
    name: "Vidhya Byayam",
    tagline: "Adaptive sports facility",
    desc: "Sports facility partner — provides court time, training space, and equipment storage for our wheelchair basketball and para-badminton programmes.",
    region: "National",
    type: "Programme",
    since: "2024",
    areas: ["Adaptive sports", "Facility"],
    url: "#",
    color: "#2D7A4F",
    initials: "VB",
  },
  {
    name: "Godawari Botanical Gardens",
    tagline: "Accessible nature retreats",
    desc: "Hosted our first inclusive wellness retreat. Continuing collaborator on accessible nature programming and outdoor therapy.",
    region: "National",
    type: "Community",
    since: "2024",
    areas: ["Wellness", "Outdoor"],
    url: "#",
    color: "#0891B2",
    initials: "GB",
  },
  {
    name: "The Himalayan Times",
    tagline: "English-language press",
    desc: "Media partner — featured the founder's profile and continues to cover our programmes across English print and digital.",
    region: "National",
    type: "Media",
    since: "2025",
    areas: ["Press", "Storytelling"],
    url: "https://thehimalayantimes.com",
    color: "#9B5DD5",
    initials: "HT",
    logoDomain: "thehimalayantimes.com",
  },
  {
    name: "Daraz Nepal",
    tagline: "E-commerce & CSR",
    desc: "Corporate partner — facilitated our online handicraft pop-up and matched donations to the school supplies campaign for two seasons.",
    region: "International",
    type: "Corporate",
    since: "2025",
    areas: ["E-commerce", "Matching"],
    url: "https://daraz.com.np",
    color: "#F85606",
    initials: "DZ",
    logoDomain: "daraz.com.np",
  },
];

export const testimonials = [
  { quote: "Nirmala Foundation gave me my first wheelchair — and the courage to play basketball at a national level.", name: "Suman R.", role: "Athlete, Wheelchair Basketball" },
  { quote: "The art program changed my daughter's life. She found her voice through painting.", name: "Pratima D.", role: "Parent" },
  { quote: "Working with this team showed me what real inclusion looks like in practice.", name: "Bikash T.", role: "Volunteer" },
];

export const milestones = [
  { year: "Jan 2024", title: "Foundation Established", desc: "Nirmala Bhandari founds Nirmala Foundation Nepal in Kathmandu." },
  { year: "Mar 2024", title: "First Pilot Program", desc: "Inclusive sports pilot launches at Vidhya Byayam." },
  { year: "Aug 2024", title: "Godawari Yoga Retreat", desc: "First inclusive wellness retreat at Godawari Botanical Gardens." },
  { year: "Jul 2025", title: "Utpala Cafe Pop-Up", desc: "Handicraft stall by artisans with disabilities." },
  { year: "Oct 2025", title: "D-30 Honoree", desc: "Founder named to D-30 Disability Impact List 2025." },
  { year: "Dec 2025", title: "Women's Amputee Football", desc: "Nepal's first women's amputee football tournament." },
];

export const resources = [
  { title: "Annual Report 2024", category: "Annual Reports", year: "2024", desc: "Year in review: programs, beneficiaries, financials." },
  { title: "Disability Inclusion in Nepali Schools", category: "Research", year: "2025", desc: "Field study across 12 districts on inclusive classroom practices." },
  { title: "Policy Brief: Mobility Access in Kathmandu", category: "Policy Briefs", year: "2025", desc: "Recommendations for inclusive urban infrastructure." },
  { title: "Adaptive Sports Coaching Guide", category: "Guides", year: "2024", desc: "Practical handbook for inclusive sports coaches." },
  { title: "Women & Disability in Nepal", category: "Research", year: "2025", desc: "Intersectional analysis of gender and disability access." },
  { title: "Volunteer Handbook", category: "Guides", year: "2024", desc: "Onboarding guide for new Nirmala Foundation volunteers." },
];

export const galleryAlbums = [
  { slug: "sports-2024", title: "Sports Programs 2024", count: 24, color: "#6B2FA0" },
  { slug: "arts-exhibition", title: "Arts Exhibition", count: 18, color: "#F97316" },
  { slug: "godawari-retreat", title: "Godawari Yoga Retreat", count: 32, color: "#2D7A4F" },
  { slug: "amputee-football", title: "Women's Amputee Football", count: 27, color: "#9B5DD5" },
  { slug: "utpala-popup", title: "Utpala Cafe Pop-Up", count: 15, color: "#E11D48" },
  { slug: "rural-health", title: "Rural Health Camps", count: 21, color: "#0891B2" },
];
