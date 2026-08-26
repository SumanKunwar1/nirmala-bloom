/* ------------------------------------------------------------------ *
 * Donation campaigns
 *
 * `raisedOffset` / `donorsOffset` are the historic totals raised BEFORE
 * this system went live. Online donations are counted separately and the
 * two are summed into the `raised` / `donors` values the site displays —
 * so seeding never fights with real money coming in.
 * ------------------------------------------------------------------ */

export const campaigns = [
  {
    slug: "wheelchair-fund",
    title: "Wheelchair Fund",
    icon: "🦽",
    color: "#6B2FA0",
    goal: 500000,
    raisedOffset: 215000,
    donorsOffset: 87,
    urgent: true,
    featured: true,
    order: 0,
    programSlug: "mobility-access",
    desc: "Provide wheelchairs and mobility devices to Nepali youth with disabilities.",
    longDesc:
      "A wheelchair is more than a device — it's the start of school, work, sport, and friendship. For many young Nepalis with mobility impairments, the wait for a properly-fitted chair stretches for years. The Wheelchair Fund covers manual chairs, sport chairs, pediatric chairs, custom cushions, and basic repairs for beneficiaries identified through our community partners and rural camps.",
    why: "Roughly 1 in 6 Nepalis with disabilities lacks an appropriate mobility device. Locally-fitted chairs reduce shoulder injury, increase school attendance, and unlock participation in our adaptive sports programmes.",
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
    seoTitle: "Wheelchair Fund — Donate · Nirmala Foundation Nepal",
    seoDescription: "Fund fitted wheelchairs and mobility devices for Nepali youth with disabilities.",
    seoKeywords: "wheelchair donation Nepal, mobility devices, disability Nepal",
  },
  {
    slug: "school-supplies",
    title: "School Supplies",
    icon: "🎒",
    color: "#0891B2",
    goal: 200000,
    raisedOffset: 140000,
    donorsOffset: 64,
    order: 1,
    programSlug: "education",
    desc: "Educational materials for inclusive classrooms across rural Nepal.",
    longDesc:
      "Textbooks in large print, braille tools, tactile learning kits, school bags, stationery, and accessible furniture for classrooms partnering with us on inclusive education across 12 districts.",
    why: "Many rural schools have inclusive policies on paper but lack the basic accessible learning materials children with disabilities need to actually participate. We close that gap school by school.",
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
    seoTitle: "School Supplies — Donate · Nirmala Foundation Nepal",
    seoDescription: "Fund braille kits, large-print books and accessible classrooms in rural Nepal.",
    seoKeywords: "inclusive education Nepal, braille, school supplies donation",
  },
  {
    slug: "sports-equipment",
    title: "Sports Equipment",
    icon: "🏀",
    color: "#F97316",
    goal: 300000,
    raisedOffset: 88000,
    donorsOffset: 41,
    order: 2,
    programSlug: "adaptive-sports",
    desc: "Adaptive sports gear for wheelchair basketball and para-sports programs.",
    longDesc:
      "Basketballs, jerseys, para-badminton rackets, amputee football crutches, training cones, court time, referee fees, and travel grants for athletes competing nationally.",
    why: "Adaptive sport is the gateway many Nepalis with disabilities use to step into public life. Affordable equipment and travel are still the two biggest barriers.",
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
    seoTitle: "Sports Equipment — Donate · Nirmala Foundation Nepal",
    seoDescription: "Fund adaptive sports gear and travel grants for para-athletes in Nepal.",
    seoKeywords: "adaptive sports Nepal, wheelchair basketball, para sports donation",
  },
  {
    slug: "art-music-materials",
    title: "Art & Music Materials",
    icon: "🎨",
    color: "#E11D48",
    goal: 150000,
    raisedOffset: 62000,
    donorsOffset: 29,
    order: 3,
    programSlug: "inclusive-arts",
    desc: "Paints, instruments, and craft supplies for the inclusive arts program.",
    longDesc:
      "Acrylic paints, canvases, hand-sized brushes, adaptive grips, harmonium, tabla, jingles, beads and looms for our weekend handicraft circles — plus stipends for our visiting tutors.",
    why: "Arts give voice where words don't reach. Our weekly inclusive arts circles have grown into a small community business selling work at the Utpala Cafe pop-up.",
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
    seoTitle: "Art & Music Materials — Donate · Nirmala Foundation Nepal",
    seoDescription: "Fund paints, instruments and adaptive craft tools for inclusive arts circles.",
    seoKeywords: "inclusive arts Nepal, adaptive art supplies, music therapy donation",
  },
  {
    slug: "rural-health-medicines",
    title: "Rural Health Medicines",
    icon: "💊",
    color: "#2D7A4F",
    goal: 250000,
    raisedOffset: 175000,
    donorsOffset: 73,
    order: 4,
    programSlug: "health-wellness",
    desc: "Essential medicines for rural health outreach camps across Nepal.",
    longDesc:
      "Basic medicines, wound care, hypertension and diabetes management, pediatric supplements, and mental wellness support delivered through our rural health camps in partnership with district clinics.",
    why: "Disability and chronic illness intersect. A predictable medicine supply is the difference between a camp that treats and a camp that just diagnoses.",
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
    seoTitle: "Rural Health Medicines — Donate · Nirmala Foundation Nepal",
    seoDescription: "Fund essential medicines for rural health camps across Nepal.",
    seoKeywords: "rural health Nepal, medicine donation, health camps",
  },
  {
    slug: "general-fund",
    title: "General Fund",
    icon: "🌐",
    color: "#9B5DD5",
    goal: 1000000,
    raisedOffset: 320000,
    donorsOffset: 156,
    featured: true,
    order: 5,
    desc: "Support all Nirmala Foundation programs — allocated where most needed.",
    longDesc:
      "Flexible funding lets us respond quickly: emergency wheelchairs after a road accident, a sudden travel grant for a national tournament, last-minute medicine for a camp, a roof repair at a partner school. Unrestricted giving is the most powerful gift you can make.",
    why: "Restricted grants don't cover the things that actually keep an NGO running — rent, electricity, salaries, accountancy, the rapid yes when a community asks for help. The General Fund does.",
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
    seoTitle: "General Fund — Donate · Nirmala Foundation Nepal",
    seoDescription: "Unrestricted giving that lets us respond wherever the need is greatest.",
    seoKeywords: "donate Nepal NGO, general fund, disability inclusion",
  },
];

export default campaigns;
