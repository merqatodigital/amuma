/* ------------------------------------------------------------------ *
 *  AMUMA — editable site content.
 *  Everything rendered on the site is sourced from this object so the
 *  admin panel can change it live. Media values are either a URL or an
 *  "idb:<id>" reference to a file uploaded from the user's device.
 * ------------------------------------------------------------------ */

export type MediaBlock = {
  type: "image" | "video" | "youtube";
  image: string;
  video: string;
  youtube: string;
};

export type SectionRef = {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
};

export type CustomSection = {
  enabled: boolean;
  layout: "text" | "imageLeft" | "imageRight" | "banner" | "cards";
  tone: "light" | "muted" | "dark";
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  cards: { title: string; body: string; image: string }[];
};

export const blankCustom = (n: number): CustomSection => ({
  enabled: true,
  layout: "imageRight",
  tone: "light",
  eyebrow: `New section ${n}`,
  title: "A new chapter",
  body: "Click this text to tell your story. Add images from your device, change the layout, or move this section anywhere on the page.",
  image: "",
  ctaLabel: "",
  ctaHref: "#join",
  cards: [
    { title: "First point", body: "Describe something here.", image: "" },
    { title: "Second point", body: "Describe something here.", image: "" },
    { title: "Third point", body: "Describe something here.", image: "" },
  ],
});

export const peso = (n: number) =>
  "₱" + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

export const defaultContent = {
  theme: {
    displayFont: "Cormorant Garamond",
    bodyFont: "Jost",
    headingScale: 1,
    type: {
      heading: { weight: 300, tracking: -0.01, transform: "none" },
      brand: { weight: 300, tracking: 0.16, transform: "none" },
      eyebrow: { size: 10, weight: 400, tracking: 0.32, transform: "uppercase" },
      button: { size: 11, weight: 400, tracking: 0.24, transform: "uppercase" },
      nav: { size: 11, weight: 400, tracking: 0.22, transform: "uppercase" },
      body: { weight: 300, lineHeight: 1.9 },
    },
    colors: {
      sand50: "#fbf9f5",
      sand100: "#f5f0e7",
      sand200: "#ebe3d5",
      sand300: "#dbcfba",
      sand400: "#c4b092",
      clay500: "#a08863",
      clay600: "#7d6748",
      bark700: "#4a4034",
      bark800: "#332d25",
      bark900: "#221e19",
    },
  },

  /** Render order + visibility of every section. Edit in Admin → Sections. */
  sections: [
    { id: "vision", type: "vision", label: "Vision", enabled: true },
    { id: "meaning", type: "meaning", label: "Meaning", enabled: true },
    { id: "circle", type: "circle", label: "The Circle", enabled: true },
    { id: "hidden", type: "hidden", label: "Hidden Destinations", enabled: true },
    { id: "palawan", type: "palawan", label: "First Chapter", enabled: true },
    { id: "sanVicente", type: "sanVicente", label: "San Vicente", enabled: true },
    { id: "experience", type: "experience", label: "Experience", enabled: true },
    { id: "future", type: "future", label: "Future Destinations", enabled: true },
    { id: "roadmap", type: "roadmap", label: "Roadmap", enabled: true },
    { id: "tiers", type: "tiers", label: "Investment Tiers", enabled: true },
    { id: "usage", type: "usage", label: "Accommodation Usage", enabled: true },
    { id: "revenue", type: "revenue", label: "Revenue Model", enabled: true },
    { id: "flywheel", type: "flywheel", label: "Flywheel", enabled: true },
    { id: "calculator", type: "calculator", label: "Calculator", enabled: true },
    { id: "team", type: "team", label: "Team", enabled: true },
    { id: "portal", type: "portal", label: "Member Portal", enabled: true },
    { id: "join", type: "join", label: "Join / Form", enabled: true },
    { id: "faq", type: "faq", label: "FAQ", enabled: true },
  ] as SectionRef[],

  /** Extra sections the client creates themselves, keyed by section id. */
  custom: {} as Record<string, CustomSection>,

  nav: {
    brand: "AMUMA",
    tagline: "Barefoot Boutique Resorts",
    links: [
      { label: "Vision", href: "#vision" },
      { label: "The Circle", href: "#circle" },
      { label: "Destinations", href: "#destinations" },
      { label: "Model", href: "#model" },
      { label: "Calculator", href: "#calculator" },
      { label: "Team", href: "#team" },
    ],
    ctaLabel: "Join the Circle",
    ctaHref: "#join",
  },

  hero: {
    enabled: true,
    media: {
      type: "image",
      image: "/images/hero.jpg",
      video: "",
      youtube: "",
    } as MediaBlock,
    overlay: 45,
    title: "AMUMA",
    tagline: "Barefoot Boutique Resorts",
    headline: "A new way of traveling",
    subline:
      "A circle of intimate retreats in the hidden corners of the Philippines and Southeast Asia — created with care, discovered slowly.",
    primaryLabel: "Join the Founding Circle",
    primaryHref: "#join",
    secondaryLabel: "Discover AMUMA",
    secondaryHref: "#vision",
    scrollLabel: "Scroll",
  },

  vision: {
    enabled: true,
    eyebrow: "01 — The Shift",
    title: "A new way\nof traveling",
    p1: "Tourism is changing. Travelers are moving away from crowded destinations and standardized resorts. They are searching for something more rare. Not bigger places but more meaningful ones.",
    quote:
      "Hidden coastlines. Untouched islands. Villages where hospitality still feels personal. Places where beauty is not manufactured, but discovered.",
    p2: "AMUMA was created to reveal these hidden treasures — a network of intimate retreats designed for explorers who seek beauty, silence, and discovery.",
    stats: [
      { value: "6", label: "Suites & villas, first chapter" },
      { value: "4,400", label: "Circle Units total" },
      { value: "17–20%", label: "Projected annual ROI" },
      { value: "20", label: "Founding Nova places" },
    ],
  },

  meaning: {
    enabled: true,
    eyebrow: "02 — The Meaning",
    word: "AMUMA",
    pronunciation: "a·mu·ma · Visayan, verb",
    p1: "Amuma is an ancestral Filipino word, a native Visayan term with pre-colonial Austronesian roots meaning to nurture, to care for, to tend with attention.",
    p2: "It expresses the act of looking after someone or something so it can grow and flourish — whether a person, a place, a community, or an idea.",
    p3: "The essence of Amuma reflects the philosophy behind the project: creating destinations with care, respect for nature, and thoughtful attention to the places and people that surround them.",
  },

  circle: {
    enabled: true,
    eyebrow: "03 — The Circle",
    title: "The AMUMA Circle",
    intro:
      "AMUMA is not simply a collection of boutique resorts. It is a circle of travelers who share a way of exploring the world. AMUMA develops intimate boutique destinations composed of suites and villas, set in exceptional natural locations across the Philippines and Southeast Asia.",
    cards: [
      {
        title: "Belong",
        body: "Members return not only as guests but as part of a living community — discovering new places, hosting friends and family, traveling a growing network connected by the same spirit of hospitality.",
      },
      {
        title: "Return",
        body: "With a single entry into the Circle, members gain access to a constellation of places to return to again and again, each one a sanctuary in nature.",
      },
      {
        title: "Gather",
        body: "Each AMUMA is both a hideaway and a meeting point: shared tables, sunset gatherings, and the quiet company of fellow explorers.",
      },
    ],
    unitsEyebrow: "Circle Units",
    unitsTitle: "Ownership & lifestyle investment",
    unitsBody:
      "Members purchase Circle Units, representing membership shares in the AMUMA Circle and entitlement to a portion of the retreat's rental profit pool. Unit holders therefore become both:",
    unitsBullets: ["Co-creators of the destinations", "Participants in the shared rental revenues"],
    pebblesEyebrow: "Pebbles",
    pebblesTitle: "The internal currency",
    pebblesBody:
      "Pebbles are the lifestyle currency of the AMUMA ecosystem. Circle Members receive a new batch every year and use them across the retreats — from reserving accommodation to booking a private dinner, excursions, spa treatments and curated activities.",
    pebblesChips: [
      "Suite & villa nights",
      "Dining",
      "Excursions",
      "Boat trips",
      "Spa treatments",
    ],
    pebblesNote: "Pebbles expire every 9 July · a new batch is released 10 July",
  },

  hidden: {
    enabled: true,
    eyebrow: "04 — Hidden Destinations",
    title: "Where nature\nstill leads",
    p1: "AMUMA escapes are created only in places that still feel undiscovered — not where tourism already dominates, but where nature, culture, and simplicity still define the landscape.",
    p2: "These are places where a boutique hideaway can coexist with the environment while preserving the beauty that makes the destination special. From the remote islands of Balabac to the mountains of Bukidnon, from Siquijor and Sibuyan to Luang Prabang in Laos and the Togean Islands of Indonesia.",
    quote: "Each new place becomes another quiet chapter in the journey of the Circle.",
    cards: [
      { image: "/images/cove.jpg", title: "Balabac", caption: "Beachfront land already owned" },
      { image: "/images/mountains.jpg", title: "Bukidnon", caption: "Highlands & mist" },
      { image: "/images/wellness.jpg", title: "Siquijor", caption: "Slow island rituals" },
    ],
  },

  palawan: {
    enabled: true,
    eyebrow: "05 — First Chapter",
    bannerTitle: "Palawan",
    bannerSub: "San Vicente · Long Beach",
    image: "/images/hero.jpg",
    title: "The journey\nbegins here",
    p1: "The journey begins in Palawan, one of the most extraordinary natural environments in the world and the perfect foundation for the AMUMA vision.",
    p2: "The first retreat will rise along the pristine coastline of San Vicente, Long Beach — an emerging destination known for untouched landscapes, crystal waters, vibrant underwater life, and access to some of the most beautiful island hopping in Palawan. San Vicente represents a rare moment in time: a place where nature still dominates the horizon, yet the destination is only beginning to reveal its potential.",
    p3: "The second retreat will follow in Balabac, where AMUMA already owns beachfront land in one of the most remote and spectacular island regions of the Philippines. Together, these two destinations establish the foundation of the AMUMA ecosystem.",
  },

  sanVicente: {
    enabled: true,
    eyebrow: "06 — The Retreat",
    title: "AMUMA San Vicente",
    image: "/images/villa.jpg",
    p1: "An intimate collection of suites and private villas that blend naturally with the tropical landscape. Architecture follows a simple principle: open, breathable spaces that dissolve the boundary between indoors and nature.",
    p2: "Natural wood, stone textures, warm earth tones and handcrafted details create a quiet elegance. Suites and villas feature private courtyards, plunge pools and open living spaces, allowing guests to experience the tropical climate, light and vegetation as part of the architecture itself.",
    p3: "The scale remains intentionally small — a boutique hideaway rather than a resort, where design, privacy and atmosphere create a sense of calm and authenticity.",
    suiteCount: "4",
    suiteLabel: "Suites",
    villaCount: "2",
    villaLabel: "Villas",
    unlockTitle: "Unlocked by the Circle",
    unlockBody:
      "Each accommodation is brought to life through the Circle Units system. A specific number of units must be allocated before construction of a unit begins; it then joins the AMUMA rental pool and generates revenue for the Circle.",
    unlockRows: [
      { label: "Suite", value: "600 Circle Units" },
      { label: "Villa", value: "1,000 Circle Units" },
      { label: "Total — 4 suites, 2 villas", value: "4,400 Circle Units" },
      { label: "AMUMA Holding — 1 suite, 1 villa", value: "1,600 Circle Units" },
      { label: "Available to Circle Members", value: "2,800 Circle Units" },
    ],
    unlockNote:
      "To initiate the ecosystem, AMUMA Holding develops the first suite and the first villa — the proof of work of the project — operating within the rental system alongside future units unlocked by the Circle.",
  },

  experience: {
    enabled: true,
    eyebrow: "07 — The Experience",
    title: "The AMUMA experience",
    intro:
      "Every AMUMA destination offers a curated collection of experiences inspired by its natural and cultural surroundings. These experiences shape the rhythm of each stay and give every destination its own personality.",
    items: [
      {
        title: "Wellness",
        body: "Morning yoga, meditation sessions, massages, and slow moments designed to reconnect with body and mind.",
        image: "/images/wellness.jpg",
      },
      {
        title: "Sea & Adventure",
        body: "Boat excursions, snorkeling, island hopping, fishing trips, and exploration of nearby coastlines.",
        image: "/images/cove.jpg",
      },
      {
        title: "Island Exploration",
        body: "Discover hidden beaches, waterfalls, mountain trails, and local villages surrounding each destination.",
        image: "/images/mountains.jpg",
      },
      {
        title: "Culinary Journeys",
        body: "Seasonal menus inspired by local ingredients, shared dinners, seafood feasts, and cooking experiences with regional flavors.",
        image: "/images/dining.jpg",
      },
      {
        title: "Community Moments",
        body: "Shared tables, sunset gatherings, and spontaneous encounters with fellow members and travelers from the AMUMA Circle.",
        image: "/images/villa.jpg",
      },
    ],
  },

  future: {
    enabled: true,
    eyebrow: "08 — Future Destinations",
    title: "A growing constellation",
    items: [
      { name: "Balabac", region: "Palawan, Philippines", status: "Land secured" },
      { name: "Sagada", region: "Mountain Province", status: "Exploring" },
      { name: "Siquijor", region: "Central Visayas", status: "Exploring" },
      { name: "Sibuyan Island", region: "Romblon", status: "Programming" },
      { name: "Bukidnon", region: "Mindanao", status: "Programming" },
      { name: "Batanes", region: "Northern Philippines", status: "Exploring" },
      { name: "Luang Prabang", region: "Laos", status: "Exploring" },
      { name: "Togean Islands", region: "Indonesia", status: "2035 opening" },
      { name: "Timor", region: "Southeast Asia", status: "Exploring" },
    ],
  },

  roadmap: {
    enabled: true,
    eyebrow: "09 — Roadmap",
    title: "The chapters ahead",
    items: [
      { year: "2026", title: "AMUMA San Vicente", body: "Construction begins and the first Circle Members join." },
      { year: "2028", title: "AMUMA San Vicente opens", body: "First guests welcomed, rental income begins." },
      { year: "2029", title: "AMUMA Balabac groundbreaking", body: "New Circle Units offering." },
      { year: "2030", title: "Philippines expansion", body: "Land acquisition and programming of new Philippine destinations." },
      { year: "2031", title: "AMUMA Balabac opens", body: "Beachfront flagship AMUMA." },
      { year: "2032", title: "Indonesia land acquisition", body: "Togean Islands." },
      { year: "2032", title: "Groundbreaking Bukidnon / Sibuyan", body: "Expansion development in new Philippine locations." },
      { year: "2033", title: "Bukidnon or Sibuyan opens", body: "Expansion across the Philippines begins." },
      { year: "2035", title: "AMUMA Togean opens", body: "First international hideaway. International expansion begins." },
    ],
  },

  tiers: {
    enabled: true,
    eyebrow: "10 — Investment Tiers",
    title: "Depths of participation",
    intro:
      "Participation in the AMUMA Circle is organized through a limited number of investment tiers. By holding Circle Units, members benefit from two complementary yearly rewards: passive financial income from the rental profit pool, and Pebbles — a lifestyle currency for stays and experiences across the AMUMA destinations.",
    ctaLabel: "Enquire",
    items: [
      { name: "Nova", investment: 500000, units: 50, pebbles: 1000, note: "Only 20 available" },
      { name: "Aurora", investment: 1200000, units: 120, pebbles: 2200, note: "" },
      { name: "Orion", investment: 2000000, units: 210, pebbles: 4000, note: "" },
      { name: "Polaris", investment: 4000000, units: 440, pebbles: 8000, note: "" },
    ],
  },

  usage: {
    enabled: true,
    eyebrow: "11 — Accommodation Usage",
    title: "Pebbles per night",
    intro:
      "Each year members receive Pebbles, the travel currency of the AMUMA Circle. They are used to reserve nights in suites and villas across the destinations, with different amounts depending on the accommodation and season.",
    suiteTitle: "Suites",
    suiteLow: 150,
    suiteHigh: 250,
    suitePeak: 300,
    villaTitle: "Villas",
    villaLow: 275,
    villaHigh: 420,
    villaPeak: 500,
  },

  revenue: {
    enabled: true,
    eyebrow: "12 — Revenue Model",
    title: "How income is distributed",
    intro:
      "AMUMA destinations welcome both members and general travelers, with accommodations offered through our platforms and global booking channels. After operating expenses and taxes are deducted, the remaining profits are shared between Members of the Circle and AMUMA as operator.",
    ratesTitle: "Indicative nightly rates · San Vicente",
    suiteLow: 7500,
    suiteHigh: 12500,
    suitePeak: 15000,
    villaLow: 13000,
    villaHigh: 20000,
    villaPeak: 25000,
    ratesNote: "Per night, for 2 guests, including breakfast.",
    splits: [
      { value: "60%", label: "Circle Members", note: "" },
      { value: "40%", label: "AMUMA Operator", note: "" },
      {
        value: "5%",
        label: "TIEZA tourism tax",
        note: "In San Vicente, Palawan, taxation is fixed at 5% of gross following TIEZA zoning rules.",
      },
    ],
    returnsEyebrow: "Projected Returns",
    returnsBody:
      "Conservative assumptions — 55% occupancy, boutique resort and villa positioning, TIEZA 5% tourism tax.",
    roi: "17–20%",
    roiLabel: "Projected annual ROI",
  },

  flywheel: {
    enabled: true,
    eyebrow: "13 — The Flywheel",
    title: "A cycle that keeps turning",
    steps: [
      "Members join",
      "Retreats are built",
      "Experiences generate revenue",
      "Returns fund expansion",
      "New members join",
      "New destinations appear",
    ],
    note: "This cycle continuously expands the AMUMA ecosystem.",
  },

  calculator: {
    enabled: true,
    eyebrow: "14 — Your Returns",
    title: "Select a tier to see your potential",
    totalUnits: 4400,
    memberUnits: 2800,
    roiLow: 17,
    roiHigh: 20,
    avgNightPebbles: 200,
    experienceNote:
      "Suite nights per year — or multiple shorter stays plus spa, dining and boat excursions.",
    roiNote: "Based on 55% occupancy, boutique luxury positioning and TIEZA 5% tourism tax.",
    summaryTitle: "Your membership value",
    disclaimer:
      "Pebbles are annual experience credits used for accommodation, dining, spa treatments, boat excursions and curated experiences. They renew every year and encourage members to return and continue their journey. Projections are indicative and not a guarantee of future performance.",
  },

  team: {
    enabled: true,
    eyebrow: "15 — Team",
    title: "The people behind the Circle",
    members: [
      {
        name: "Giacomo Gervasutti",
        role: "Founder & Vision Director",
        bio: "Italian entrepreneur. Founder and owner of Baia Boutique Resort, Marina Terrace restaurant and accommodations, and Pasticci.ph private dining club.",
        image:
          "https://images.pexels.com/photos/2377182/pexels-photo-2377182.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Irina Feleo",
        role: "Co-Founder & Creative Director",
        bio: "Award-winning Filipino actress and creative producer, bringing her artistic vision and storytelling sensibility to shape the atmosphere and guest experience of AMUMA destinations.",
        image:
          "https://images.pexels.com/photos/12639453/pexels-photo-12639453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Joaquin Esquivias",
        role: "Chief Legal & Strategy Officer",
        bio: "Entrepreneur and tax & corporate lawyer with extensive experience building scalable businesses. He oversees the strategic, financial, and legal foundations of the AMUMA ecosystem.",
        image:
          "https://images.pexels.com/photos/7196362/pexels-photo-7196362.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
  },

  portal: {
    enabled: true,
    eyebrow: "16 — The Member Portal",
    title: "Your Pebbles. Your access.\nYour ecosystem.",
    intro:
      "The AMUMA webapp is more than an investment dashboard. It is the central hub for the entire member experience — where Pebbles become currency, connection, and community.",
    columns: [
      {
        title: "Booking & Lifestyle",
        items: [
          "Reserve stays using Pebbles",
          "Book experiences — island hopping, private cars, transfers, scooter rentals",
          "Order food and drinks within the resorts using Pebbles",
          "Book internal services — massages, spa treatments, private dinners",
        ],
      },
      {
        title: "Finance & Community",
        items: [
          "Monitor your Pebble balance in real time",
          "Track expected yearly profits",
          "Send or receive Pebbles as gifts to friends and family",
          "Direct messaging channel with resort staff",
          "Event invitations and Circle member updates",
          "New development progress tracking",
          "Internal voting system for key decisions",
        ],
      },
    ],
    closing: "Keeping members in the loop. Always.",
  },

  join: {
    enabled: true,
    eyebrow: "17 — Founding Circle",
    title: "Join the Founding Circle",
    intro:
      "Twenty exclusive Nova places at ₱500,000 — the first members of the AMUMA story.",
    bullets: [
      "₱500,000 investment · Nova tier",
      "50 Circle Units",
      "1,000 annual Pebbles",
      "Early access to future AMUMA retreats",
    ],
    spots: "20",
    spotsLabel: "places remaining",
    benefitsTitle: "Founding Circle benefits",
    benefits: [
      "Name on the founding plaque at San Vicente Retreat",
      "Early access to future AMUMA retreats",
      "First access to future share offerings",
      "Annual private video update from the founders",
      "Invitation to the annual Founders' Dinner",
      "Listed as a Founding Circle member on the website",
    ],
    formTitle: "Apply now",
    submitLabel: "Submit application",
    formNote:
      "Submitting this form is an expression of interest only and does not constitute a subscription or an offer to sell securities.",
    thanksTitle: "Thank you",
    thanksBody:
      "Your application has been received. A member of the AMUMA team will contact you personally within a few days.",
  },

  faq: {
    enabled: true,
    eyebrow: "18 — FAQ",
    title: "Questions",
    items: [
      {
        q: "What are Circle Units?",
        a: "Circle Units represent membership shares in the AMUMA Circle. Holding units makes you a co-creator of the destinations and entitles you to a proportional portion of the retreats' rental profit pool, distributed annually.",
      },
      {
        q: "What are Pebbles?",
        a: "Pebbles are the internal lifestyle currency of the AMUMA ecosystem. Members receive a new batch every year and use them for suite and villa nights, dining, spa treatments, boat trips, excursions and curated experiences. Pebbles expire every 9 July and a fresh batch is released on 10 July.",
      },
      {
        q: "Can I sell my Units?",
        a: "Circle Units are transferable subject to the transfer provisions of the subscription agreement and approval by AMUMA Holding. There is no public market for the units, so they should be considered a long-term lifestyle investment.",
      },
      {
        q: "How do I receive my revenue?",
        a: "After operating expenses and the fixed TIEZA 5% tourism tax are deducted, net profits are split 60% to Circle Members and 40% to AMUMA as operator. The member share is distributed proportionally to units held, once per year.",
      },
      {
        q: "What is the minimum investment?",
        a: "The entry point is the Nova tier at ₱500,000, which grants 50 Circle Units and 1,000 annual Pebbles. Only 20 Nova places exist.",
      },
      {
        q: "What is the Founding Circle?",
        a: "The Founding Circle is the first group of 20 Nova members. They receive their name on the founding plaque at San Vicente, early access to future retreats, first access to future share offerings, an annual private video update and an invitation to the annual Founders' Dinner.",
      },
      {
        q: "Can companies invest?",
        a: "Yes. Corporate entities may subscribe for Circle Units. Membership benefits, including Pebbles, are assigned to nominated individuals designated by the company.",
      },
      {
        q: "What returns can I expect?",
        a: "Projections indicate a 17–20% annual ROI based on conservative assumptions: 55% occupancy, boutique resort and villa positioning, and the TIEZA 5% tourism tax. Projections are indicative and not a guarantee of future performance.",
      },
    ],
  },

  footer: {
    brand: "AMUMA",
    tagline: "Barefoot Boutique Resorts",
    groups: [
      {
        title: "Links",
        items: [
          { label: "Vision", href: "#vision" },
          { label: "The Circle", href: "#circle" },
          { label: "Destinations", href: "#destinations" },
          { label: "Model", href: "#model" },
          { label: "Calculator", href: "#calculator" },
          { label: "Join", href: "#join" },
        ],
      },
      {
        title: "Legal",
        items: [
          { label: "Private Placement", href: "#legal" },
          { label: "Terms", href: "#legal" },
          { label: "Privacy", href: "#legal" },
        ],
      },
    ],
    contactTitle: "Contact",
    contacts: ["hello@amuma.ph", "legal@amuma.ph", "San Vicente, Palawan · Philippines"],
    legal: [
      {
        label: "RESTRICTIONS ON OFFERING:",
        body: "The securities offered are not being offered or sold in the United States or to U.S. persons.",
      },
      {
        label: "FORWARD-LOOKING STATEMENTS:",
        body: "This website contains forward-looking statements regarding future events, financial projections and business strategies. Past performance of Baia is not necessarily indicative of future results.",
      },
      {
        label: "RISK FACTORS:",
        body: "An investment in AMUMA properties involves significant risks, including construction delays, market conditions, regulatory changes, operational challenges and liquidity limitations.",
      },
      {
        label: "INTELLECTUAL PROPERTY:",
        body: "All content on this website is the property of AMUMA Holding and is protected by Philippine and international copyright laws.",
      },
      {
        label: "",
        body: "This website and its contents shall be governed by the laws of the Republic of the Philippines. Any disputes shall be submitted to the exclusive jurisdiction of the courts of Makati City, Philippines.",
      },
    ],
    bottomLeft: "AMUMA Holding · legal@amuma.ph",
    bottomRight: "© 2026 AMUMA Collection. All rights reserved.",
  },
};

export type Content = typeof defaultContent;
