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

export const programs = [
  { slug: "adaptive-sports", title: "Adaptive Sports", icon: "🏀", color: "#6B2FA0", desc: "Wheelchair basketball, para-badminton, amputee football, and inclusive recreation." },
  { slug: "inclusive-arts", title: "Inclusive Arts", icon: "🎨", color: "#F97316", desc: "Visual arts, music, handicrafts, and creative expression for all abilities." },
  { slug: "education", title: "Education", icon: "📚", color: "#2D7A4F", desc: "VAK-based inclusive learning programs and school supply distribution." },
  { slug: "mobility-access", title: "Mobility & Access", icon: "♿", color: "#9B5DD5", desc: "Assistive devices, wheelchair provision, and inclusive infrastructure projects." },
  { slug: "health-wellness", title: "Health & Wellness", icon: "🏥", color: "#E11D48", desc: "Rural health camps, medicine distribution, mental wellness support." },
  { slug: "community-travel", title: "Community & Travel", icon: "🌍", color: "#0891B2", desc: "Inclusive travel experiences, community advocacy, and empowerment workshops." },
];

export const impactStats = [
  { label: "Beneficiaries Reached", value: 1200, suffix: "+" },
  { label: "Active Programs", value: 8, suffix: "" },
  { label: "Partner Organizations", value: 15, suffix: "+" },
  { label: "Years of Impact", value: 2, suffix: "+" },
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
