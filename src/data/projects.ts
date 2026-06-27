export type CaseImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Block =
  | { type: "text"; heading?: string; body: string[] }
  | { type: "list"; heading?: string; intro?: string; items: string[] }
  | { type: "quotes"; heading?: string; intro?: string; items: string[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | {
      type: "compare";
      left: { title: string; items: string[] };
      right: { title: string; items: string[] };
    }
  | { type: "process"; steps: string[] }
  | { type: "image"; image: CaseImage; caption?: string; narrow?: boolean }
  | { type: "pair"; images: { image: CaseImage; caption?: string }[] };

export type Chapter = {
  title: string;
  lede?: string;
  blocks: Block[];
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  type: string;
  accent: string;
  intro: string[];
  note?: string;
  tools: string[];
  hero: CaseImage;
  chapters: Chapter[];
  outcomes?: { value: string; label: string }[];
  closingImage?: CaseImage;
};

export const projects: Project[] = [
  {
    slug: "tipico",
    title: "Tipico",
    tagline: "Raising retention for Germany's №1 sportsbook, stateside.",
    year: "2022—2023",
    role: "UI/UX Designer",
    type: "iOS & Android app",
    accent: "#e0312d",
    intro: [
      "Tipico is Germany's №1 sportsbook — and its US app serves more than 125,000 active players across iOS and Android. During my time there I worked across redesigns and new features, spearheaded cross-departmental collaboration with key stakeholders to define strategic goals, and oversaw a robust design system.",
      "Three of those projects are below: an overhaul of our most-visited screens (Project “Clear”), a brand-new betting product (Pre-built Parlays), and a rework of the app's second-most-visited page (My Bets).",
      "The work compounded. Over my tenure, user retention climbed from 21% to 46%, and Tipico moved from 12th to 4th in UX rankings of US sportsbooks.",
    ],
    tools: ["Figma", "Design system", "Prototyping", "Usability testing"],
    hero: {
      src: "/images/tipico-01.webp",
      width: 1800,
      height: 1201,
      alt: "Tipico Sportsbook app shown on three phones against a red backdrop",
    },
    chapters: [
      {
        title: "Project “Clear”",
        lede: "An initiative to overhaul the UI and UX of our most-visited screens — boosting performance, speed and market offerings to bridge the parity gap with competitors.",
        blocks: [
          {
            type: "process",
            steps: [
              "Initial understanding of current state",
              "Market research and inspiration",
              "Design workshop and ideation",
              "Initial design and prototypes",
              "Develop and implement",
              "Test, feedback and iterate",
            ],
          },
          {
            type: "text",
            heading: "Where we stood",
            body: [
              "Eilers & Krejcik's 2021 quarterly gaming report ranked Tipico 12th among US sportsbooks. A pulse survey of 450 customers told us why: the app was difficult to use and navigate. Asked what wasn't as good in Tipico versus other apps, 77% of respondents pointed at promotions — and 51% at the interface itself.",
              "The research also told us exactly what players cared about: game lines and parlays dominated bet preferences, and a third of players bet multiple times a week. Speed-to-bet was everything.",
            ],
          },
          {
            type: "stats",
            items: [
              { value: "89%", label: "of players bet game lines — parlays close behind at 78%" },
              { value: "$170.50", label: "average deposit amount" },
              { value: "$87", label: "average single bet" },
            ],
          },
          {
            type: "text",
            heading: "The homepage",
            body: [
              "The homepage is where users find their favorite leagues and bets, so it deserved the first pass. To design it honestly, I had to define the primary task — why do people open the app at all? The answer is simple: they come to place a bet. Every decision that followed was measured against that task.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/tipico-clear-compare.webp",
              width: 1665,
              height: 1330,
              alt: "Tipico homepage before and after the redesign",
            },
            caption: "The homepage — 2022 vs now",
          },
          {
            type: "compare",
            left: {
              title: "Areas to improve",
              items: [
                "Very cluttered",
                "Quick links overlooked — not enough engagement",
                "Top Events took up 33% of the screen, mostly used as a jump-off point",
                "Often duplicated the same content as Featured",
              ],
            },
            right: {
              title: "How it was improved",
              items: [
                "Applied Hick's Law to cut cognitive overload — a hamburger menu now houses account settings",
                "Top Events replaced with Pre-built Parlays, which earn far more engagement",
                "Top Events merged into the Featured section",
                "A new icon set for a modern look and feel",
              ],
            },
          },
          {
            type: "image",
            image: {
              src: "/images/tipico-icons.webp",
              width: 1396,
              height: 910,
              alt: "Icon set before and after — flatter, rounder icons in default, selected and dark variants",
            },
            caption: "The new iconography — flatter and rounder for clarity, consistency and brand identity",
          },
          {
            type: "text",
            heading: "Embracing the brand",
            body: [
              "Tipico is a red, black and yellow company — the brand and marketing had always been that, but the product didn't reflect it. The old UI leaned on blues and greens. We infused the brand red through the interface and put a positive spin on it.",
            ],
          },
          {
            type: "pair",
            images: [
              {
                image: {
                  src: "/images/tipico-buttons-before.webp",
                  width: 870,
                  height: 650,
                  alt: "Old button system in blue, yellow and green",
                },
                caption: "Button system — before",
              },
              {
                image: {
                  src: "/images/tipico-buttons.webp",
                  width: 870,
                  height: 630,
                  alt: "New button system in brand red, yellow and black",
                },
                caption: "After — brand red, yellow and black",
              },
            ],
          },
          {
            type: "text",
            heading: "The league & event pages",
            body: [
              "Roughly 54% of bets are placed at the league and event level, so these pages got a revamp of their own. Team names were truncating past a character limit, and stats panels opened by default — pushing actual bets below the fold. We realigned names and logos, and closed event stats by default so more bets are visible at a glance.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/tipico-league.webp",
              width: 1396,
              height: 1030,
              alt: "League and event pages before and after",
            },
            caption: "Event page — before and after",
          },
          {
            type: "text",
            heading: "Measuring results",
            body: [
              "Success was defined up front: conversion rate (how many complete the primary task), time-to-X (how long it takes), retention (how often they come back) and daily/monthly active users. By August the numbers had moved: app-store 5-star ratings up 82% since January, monthly bets per user up from 13.5 to 22.3, and bet selection to placement down from 2.1 minutes to 38 seconds.",
            ],
          },
        ],
      },
      {
        title: "Pre-built Parlays",
        lede: "Ready-made parlays, offered like products — designed to simplify betting for casuals and de-mystify parlays for newcomers.",
        blocks: [
          {
            type: "list",
            heading: "Why build it",
            items: [
              "Customers found it difficult to build their own parlays — a survey showed ~40% of parlay bettors would be interested if we recommended them",
              "New customers didn't understand parlays at all; pre-builts act as an introduction to a feature that can feel intimidating",
            ],
          },
          {
            type: "text",
            heading: "Brainstorming",
            body: [
              "A lot of analysis went into finding the most popular leagues, teams and betting markets. The leagues were obvious — NFL and NBA — but the real challenge was choosing the right markets to combine. The data pointed to game lines (who will win), spreads and player props.",
            ],
          },
          {
            type: "text",
            heading: "Design decisions",
            body: [
              "Many competitors ship pre-builts as big flashy banners. I deliberately avoided that strategy — users gloss over banners (banner blindness). I opted to have them look and feel like part of the product, not a marketing push.",
            ],
          },
          {
            type: "list",
            intro: "Three rules shaped the card design:",
            items: [
              "The card header carries the sport icon, event time, matchup and type of parlay",
              "Visual consistency with the betslip and My Bets was vital for reducing user confusion",
              "Selecting an offer feels identical to tapping the standard odds buttons used throughout the app",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/tipico-prebuilt.webp",
              width: 1726,
              height: 770,
              alt: "Pre-built parlay cards: Cavaliers at Bets, Heat at Nuggets, Root for the Underdog",
            },
            caption: "Pre-built parlay cards — product, not marketing",
          },
          {
            type: "stats",
            items: [
              { value: "~31%", label: "of all bets are now pre-builts (Mixpanel, since June launch)" },
              { value: "~60%", label: "of pre-builts are placed from the homepage" },
              { value: "League-level", label: "surfacing followed — the feature earned its expansion" },
            ],
          },
        ],
      },
      {
        title: "My Bets",
        lede: "The most-visited page outside the homepage — where players track their money. The problem: it told them almost nothing beyond won, lost, or still going.",
        blocks: [
          {
            type: "quotes",
            heading: "What players said",
            intro: "A pulse survey showed real confusion. Verbatims from the findings:",
            items: [
              "Where are the odds?",
              "The information is confusing",
              "I don't know which ones are live",
              "Feels cluttered",
              "Does the open mean expand?",
              "Am I supposed to cash out now?",
            ],
          },
          {
            type: "compare",
            left: {
              title: "Areas to improve",
              items: [
                "Headers didn't give enough information",
                "Button UI very overwhelming — hierarchy out of balance",
              ],
            },
            right: {
              title: "How it was improved",
              items: [
                "A clear, concise way of knowing the status of each bet",
                "More information about the bet — market and odds on every card",
                "A calmer, clearer cash-out button",
              ],
            },
          },
          {
            type: "image",
            image: {
              src: "/images/tipico-mybets-compare.webp",
              width: 1517,
              height: 1230,
              alt: "My Bets page in 2021 versus now, with live, open and won bet states",
            },
            caption: "My Bets — 2021 vs now. Live, open and won states readable at a glance",
          },
          {
            type: "list",
            heading: "Results",
            items: [
              "Easier scanability and an enhanced user experience",
              "A more engaging live-betting experience, with more sessions per user on live events",
              "Active player days increased by 46%",
            ],
          },
        ],
      },
    ],
    outcomes: [
      { value: "21→46%", label: "User retention over my tenure" },
      { value: "12th→4th", label: "In UX rankings of US sportsbooks" },
      { value: "2.1m→38s", label: "Bet selection to bet placement" },
      { value: "13.5→22.3", label: "Monthly bets per user" },
    ],
    closingImage: {
      src: "/images/tipico-06.webp",
      width: 1800,
      height: 1106,
      alt: "Collage of Tipico app screens",
    },
  },
  {
    slug: "kiphar",
    title: "Kiphar",
    tagline: "Co-founding a community utility app — from first sketch to shipped product.",
    year: "2023—Present",
    role: "Co-founder · Design & Build",
    type: "Mobile app",
    accent: "#56aed6",
    intro: [
      "Nigeria's population density is roughly seven times that of the United States — if the US matched it, it would hold 2.3 billion people. Gated communities there face a hard problem: secure, efficient access for residents and visitors under heavy traffic. The traditional fix — physical gate passes and phone calls to the security outpost — is riddled with errors and congestion.",
      "Kiphar is the app my co-founder and I built to fix that: streamlined visitor access, direct lines to security personnel, and emergency services — replacing the WhatsApp groups and gate logbooks most estates still run on.",
      "This is also the project where I stopped handing designs over a wall. I own Kiphar end to end: research, design system, every screen — and the build.",
    ],
    tools: ["Product strategy", "Figma", "Design system", "Prototyping", "Frontend build"],
    hero: {
      src: "/images/kiphar-01.webp",
      width: 1800,
      height: 1201,
      alt: "Kiphar app onboarding shown on three phones against a blue backdrop",
    },
    chapters: [
      {
        title: "Research",
        lede: "The objective: understand the pain points, needs and expectations of residents and visitors in gated communities.",
        blocks: [
          {
            type: "list",
            heading: "Method",
            items: [
              "My partner and I conducted in-person and remote interviews with a diverse sample of potential users — residents, security personnel and property managers",
              "Open-ended questions gathered qualitative insight into their experience with existing access systems",
            ],
          },
          {
            type: "list",
            heading: "Key findings",
            items: [
              "Residents are frustrated by long wait times at gates during peak hours",
              "Security personnel struggle to manage and verify physical gate passes",
              "Users value convenience, security and real-time notifications",
            ],
          },
          {
            type: "text",
            heading: "Competitive analysis",
            body: [
              "There was exactly one existing solution on the market — and it lacked a user-friendly interface and real-time communication. Its users complained constantly about access-code validity. The gap was clear: the market wanted something comprehensive and intuitive.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/kiphar-05.webp",
              width: 914,
              height: 593,
              alt: "Two screenshots of the Clannit app",
            },
            caption: "Snapshots of Clannit — the only existing solution",
            narrow: true,
          },
        ],
      },
      {
        title: "Designing Kiphar",
        lede: "Version one shipped with two core features: generating & validating access codes, and emergencies.",
        blocks: [
          {
            type: "text",
            heading: "Onboarding",
            body: [
              "Onboarding is estate-first: users create an account, link their residency to a specific gated community with an estate code, and unlock the app's features once verified. The app then wears the estate's own branding — residents of Bera Estate see Bera Estate.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/kiphar-onboarding.webp",
              width: 1434,
              height: 900,
              alt: "Kiphar onboarding: choose your estate, input estate code, enter phone number",
            },
            caption: "Estate-first sign-up — pick your estate, enter its code, verify your number",
          },
          {
            type: "text",
            heading: "Generating codes",
            body: [
              "Seamlessly granting visitor access was the major pain point that needed addressing — for us it's the primary function of the app. The “Invite Guest” button sits front and center on the homescreen, and a generated code is one native share-sheet away from the visitor's phone.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/kiphar-08.webp",
              width: 1537,
              height: 1278,
              alt: "Four screens: homescreen, guest details, access code, native sharing",
            },
            caption: "Homescreen → guest details → access code → native sharing",
          },
          {
            type: "text",
            heading: "Validating codes",
            body: [
              "A dedicated security app was developed exclusively for access-code validation, accessible only to the estate community and their security personnel. Emphasizing simplicity, its sole purpose is to efficiently and effectively validate access codes — designed for glanceability at a busy gate.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/kiphar-09.webp",
              width: 1534,
              height: 1448,
              alt: "Security app screens: enter code, valid code with guest details, invalid code, expired code",
            },
            caption: "The security app — valid, invalid and expired states",
          },
          {
            type: "text",
            heading: "Emergencies",
            body: [
              "The emergency page gives residents immediate access to essential security features: trigger an alarm, contact security personnel, and reach fire, police, medical and estate security lines — swift response and peace of mind in urgent situations.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/kiphar-emergency.webp",
              width: 400,
              height: 620,
              alt: "Emergency page with fire, police, medical and estate security contacts and a raise alarm button",
            },
            caption: "Emergency details — one tap from the tab bar",
            narrow: true,
          },
        ],
      },
      {
        title: "Wearing every hat",
        lede: "Startup resource constraints meant the design role didn't stop at the product.",
        blocks: [
          {
            type: "text",
            body: [
              "I personally undertook the marketing materials too — App Store screenshots, flyers, pricing one-pagers and brand collateral. When you're a founding team of two, “full-stack” covers more than code.",
            ],
          },
          {
            type: "pair",
            images: [
              {
                image: {
                  src: "/images/kiphar-11.webp",
                  width: 1697,
                  height: 1420,
                  alt: "Kiphar App Store screenshots",
                },
                caption: "App Store assets",
              },
              {
                image: {
                  src: "/images/kiphar-12.webp",
                  width: 1463,
                  height: 1351,
                  alt: "Kiphar flyers and brand collateral",
                },
                caption: "Flyers & branding",
              },
            ],
          },
        ],
      },
    ],
    outcomes: [
      { value: "2", label: "Gated communities live on the platform" },
      { value: "2", label: "Apps shipped — resident & security" },
      { value: "0→1", label: "Founded, designed and built" },
    ],
  },
  {
    slug: "cst",
    title: "CST Savings",
    tagline: "Onboarding 35+ screens for Canada's education savings foundation.",
    year: "2023",
    role: "Product Designer",
    type: "Mobile app",
    accent: "#18a999",
    intro: [
      "CST Foundation has helped Canadian families save for post-secondary education since 1960 — over 600,000 families to date. I joined to design the mobile experience for their college-savings product.",
      "Working from a design system I established for the team, I designed an onboarding journey spanning more than 35 screens — taking students and parents from first open to a configured plan, validated through usability testing along the way.",
    ],
    note: "Most of this engagement is covered by IP agreements, so the visuals shown here are limited to approved material. I'm happy to walk through the full case study in a conversation.",
    tools: ["Figma", "Design system", "Wireframing", "Usability testing"],
    hero: {
      src: "/images/cst-01.webp",
      width: 1800,
      height: 1201,
      alt: "CST app onboarding shown on three phones in front of a university campus",
    },
    chapters: [
      {
        title: "What I can show",
        lede: "The approved glimpse: sign-up, profile setup, completion and the progress dashboard.",
        blocks: [
          {
            type: "text",
            body: [
              "The onboarding flow had to serve two very different users at once — students discovering their university path, and parents configuring a savings plan. It moves from an emotive sign-up (“Discover your perfect university experience”) through profile setup to a progress overview that turns a complex financial product into a checklist anyone can follow.",
              "Every step was wireframed, prototyped and run through usability testing before it shipped to the design system I'd established for the team.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/cst-02.webp",
              width: 1670,
              height: 991,
              alt: "Four CST app screens: sign-up, profile setup, completion confirmation, progress overview",
            },
            caption: "Sign-up → profile → confirmation → progress overview",
          },
        ],
      },
    ],
    outcomes: [
      { value: "35+", label: "Onboarding screens designed" },
      { value: "600K+", label: "Families served by CST since 1960" },
      { value: "1", label: "Design system established from scratch" },
    ],
  },
  {
    slug: "trust-bank",
    title: "Trust Bank",
    tagline: "A dark-mode banking dashboard exploring depth, light and hierarchy.",
    year: "2021",
    role: "Designer",
    type: "Concept · Web dashboard",
    accent: "#6fbfa6",
    intro: [
      "Trust Bank is a self-initiated concept: a dark-mode banking dashboard built to push my craft in elevation, light and hierarchy. Dark UI fails when everything sits flat — so the entire interface is modelled with layered shadow to give it a dimensional, almost physical feel.",
    ],
    tools: ["Figma", "Visual design", "Dark UI", "Design exploration"],
    hero: {
      src: "/images/trust-bank-01.webp",
      width: 1800,
      height: 1308,
      alt: "Trust Bank dark-mode dashboard with messaging view",
    },
    chapters: [
      {
        title: "Light as hierarchy",
        lede: "If everything glows, nothing matters. Depth had to carry the information architecture.",
        blocks: [
          {
            type: "text",
            body: [
              "The dashboard covers the core of a banking experience — cards, transfers, payments, a currency converter, account management and messaging. Each surface sits at a deliberate elevation: primary actions rise toward the light, reference information recedes. Shadows do the work that borders and dividers usually do, so the interface stays clean without going flat.",
              "The messaging view pushed the system hardest — list, thread and detail panes at three distinct depths, readable instantly without a single hairline divider.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/trust-bank-02.webp",
              width: 1800,
              height: 1308,
              alt: "Trust Bank dashboard home: cards, transfer funds, payments and latest operations",
            },
            caption: "The dashboard home — cards, transfers, payments, operations",
          },
        ],
      },
    ],
    closingImage: {
      src: "/images/trust-bank-03.webp",
      width: 1800,
      height: 1225,
      alt: "Trust Bank dashboard on desktop and laptop with brand logo",
    },
  },
  {
    slug: "inhaus",
    title: "InHaus",
    tagline: "A minimalist web presence for an interior design studio.",
    year: "2021",
    role: "Designer",
    type: "Concept · Website",
    accent: "#c49a6c",
    intro: [
      "InHaus is a concept website for an interior design studio. The brief I set myself: the furniture is the hero, and the interface should disappear.",
    ],
    tools: ["Figma", "Art direction", "Web design"],
    hero: {
      src: "/images/inhaus-01.webp",
      width: 1800,
      height: 1225,
      alt: "InHaus website shown on a desktop monitor and laptop",
    },
    chapters: [
      {
        title: "Quiet by design",
        lede: "Two colors, one typeface, and a layout that gets out of the way.",
        blocks: [
          {
            type: "text",
            body: [
              "The entire design language is built from the studio's own logo: an ink near-black (#0C1416) and a warm cream (#FFEECB), set in Poppins. A minimalist layout and generous whitespace keep the studio's work as the focal point — the interface stays quiet so the interiors can speak.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/inhaus-style.webp",
              width: 1080,
              height: 390,
              alt: "Type and palette: Poppins, ink #0C1416 and cream #FFEECB",
            },
            caption: "The whole system — Poppins, ink and cream",
          },
          {
            type: "image",
            image: {
              src: "/images/inhaus-landing.webp",
              width: 1080,
              height: 890,
              alt: "InHaus landing page on an iMac",
            },
            caption: "The landing page",
            narrow: true,
          },
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export const site = {
  name: "Dike Uche",
  email: "dikeuche3@gmail.com",
  linkedin: "https://www.linkedin.com/in/dikeuche/",
  url: "https://www.dikeuche.com",
  title: "Dike Uche — UX Designer & Full-Stack Builder",
  description:
    "UX designer turned full-stack builder. I design digital products end to end — then write the code that ships them.",
};
