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
    tagline: "Getting more people to stick around on Germany's №1 sportsbook, now in the US.",
    year: "2022 to 2023",
    role: "UI/UX Designer",
    type: "iOS & Android app",
    accent: "#e0312d",
    intro: [
      "Tipico is Germany's №1 sportsbook, and its US app has more than 125,000 active players on iOS and Android. While I was there I worked on redesigns and new features, teamed up with people across the company to set our goals, and looked after a big design system.",
      "Three of those projects are below: a rework of our most visited screens (Project “Clear”), a brand new betting product (Prebuilt Parlays), and a rebuild of the app's second most visited page (My Bets).",
      "It all added up. While I was on the team, retention climbed from 21% to 46%, and Tipico jumped from 12th to 4th in the UX rankings of US sportsbooks.",
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
        lede: "A push to rework the UI and UX of our most visited screens, making them faster and richer so we could close the gap with the competition.",
        blocks: [
          {
            type: "process",
            steps: [
              "Understand where things stood",
              "Research the market and gather inspiration",
              "Run a design workshop and ideate",
              "Build first designs and prototypes",
              "Develop and ship",
              "Test, gather feedback, iterate",
            ],
          },
          {
            type: "text",
            heading: "Where we stood",
            body: [
              "Eilers & Krejcik's 2021 quarterly gaming report ranked Tipico 12th among US sportsbooks. A quick survey of 450 customers told us why: the app was hard to use and harder to get around. When we asked what fell short next to other apps, 77% pointed at promotions and 51% at the interface itself.",
              "The research also told us exactly what players cared about. Game lines and parlays dominated bet preferences, and a third of players bet a few times a week. Speed to bet was everything.",
            ],
          },
          {
            type: "stats",
            items: [
              { value: "89%", label: "of players bet game lines, with parlays close behind at 78%" },
              { value: "$170.50", label: "average deposit amount" },
              { value: "$87", label: "average single bet" },
            ],
          },
          {
            type: "text",
            heading: "The homepage",
            body: [
              "The homepage is where people find their favorite leagues and bets, so it got the first pass. To design it honestly, I had to name the main task. Why do people open the app at all? Simple: they come to place a bet. Every decision after that got measured against it.",
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
            caption: "The homepage, 2022 vs now",
          },
          {
            type: "compare",
            left: {
              title: "What needed fixing",
              items: [
                "Too cluttered",
                "Quick links got overlooked, so engagement stayed low",
                "Top Events ate 33% of the screen and was mostly a jumping off point",
                "It often repeated the same content as Featured",
              ],
            },
            right: {
              title: "How we fixed it",
              items: [
                "Used Hick's Law to cut the clutter; account settings moved into a hamburger menu",
                "Swapped Top Events for Prebuilt Parlays, which people engage with far more",
                "Folded Top Events into the Featured section",
                "A new icon set for a fresher look and feel",
              ],
            },
          },
          {
            type: "image",
            image: {
              src: "/images/tipico-icons.webp",
              width: 1396,
              height: 910,
              alt: "Icon set before and after, flatter rounder icons in default, selected and dark variants",
            },
            caption: "The new icons. Flatter and rounder, for clarity, consistency, and brand.",
          },
          {
            type: "text",
            heading: "Leaning into the brand",
            body: [
              "Tipico is a red, black, and yellow company. The brand and marketing always were, but the product wasn't. The old UI leaned on blues and greens, so we pushed the brand red through the interface and gave it a positive spin.",
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
                caption: "Buttons, before",
              },
              {
                image: {
                  src: "/images/tipico-buttons.webp",
                  width: 870,
                  height: 630,
                  alt: "New button system in brand red, yellow and black",
                },
                caption: "After, in brand red, yellow, and black",
              },
            ],
          },
          {
            type: "text",
            heading: "The league & event pages",
            body: [
              "About 54% of bets get placed at the league and event level, so these pages got their own pass. Team names were cutting off past a character limit, and stats panels opened by default, which pushed the actual bets below the fold. We lined up the names and logos and kept event stats closed by default, so more bets show at a glance.",
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
            caption: "Event page, before and after",
          },
          {
            type: "text",
            heading: "Measuring results",
            body: [
              "We set the targets up front: conversion (how many finish the main task), time to bet (how long it takes), retention (how often people come back), and daily and monthly active users. By August the numbers had moved. App Store five star ratings were up 82% since January, monthly bets per person climbed from 13.5 to 22.3, and the time from picking a bet to placing it dropped from 2.1 minutes to 38 seconds.",
            ],
          },
        ],
      },
      {
        title: "Prebuilt Parlays",
        lede: "Ready made parlays, offered like products, to make betting simpler for casual players and take the mystery out of parlays for newcomers.",
        blocks: [
          {
            type: "list",
            heading: "Why we built it",
            items: [
              "People found it hard to build their own parlays. A survey showed about 40% of parlay bettors would be keen if we suggested some",
              "New customers didn't really get parlays, so prebuilts work as a gentle intro to a feature that can feel intimidating",
            ],
          },
          {
            type: "text",
            heading: "Brainstorming",
            body: [
              "A lot of digging went into the most popular leagues, teams, and markets. The leagues were obvious (NFL and NBA), but the real challenge was picking the right markets to combine. The data pointed to game lines (who wins), spreads, and player props.",
            ],
          },
          {
            type: "text",
            heading: "Design decisions",
            body: [
              "Plenty of competitors ship prebuilts as big flashy banners. I steered away from that on purpose, because people tune banners out (banner blindness). I wanted these to feel like part of the product, not a marketing push.",
            ],
          },
          {
            type: "list",
            intro: "Three rules shaped the card:",
            items: [
              "The header carries the sport icon, event time, matchup, and type of parlay",
              "It stays visually consistent with the betslip and My Bets, which keeps people from getting confused",
              "Picking an offer feels exactly like tapping the regular odds buttons used everywhere else",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/tipico-prebuilt.webp",
              width: 1726,
              height: 770,
              alt: "Prebuilt parlay cards: Cavaliers at Bets, Heat at Nuggets, Root for the Underdog",
            },
            caption: "Prebuilt parlay cards. Product, not marketing.",
          },
          {
            type: "stats",
            items: [
              { value: "~31%", label: "of all bets are now prebuilts (Mixpanel, since the June launch)" },
              { value: "~60%", label: "of prebuilts get placed from the homepage" },
              { value: "League level", label: "surfacing followed once the feature earned it" },
            ],
          },
        ],
      },
      {
        title: "My Bets",
        lede: "The most visited page after the homepage, where players track their money. The problem: it barely told them anything beyond won, lost, or still going.",
        blocks: [
          {
            type: "quotes",
            heading: "What players said",
            intro: "A quick survey turned up real confusion. Straight from players:",
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
              title: "What needed fixing",
              items: [
                "Headers didn't give enough information",
                "The buttons were overwhelming and the hierarchy was off",
              ],
            },
            right: {
              title: "How we fixed it",
              items: [
                "A clear, simple way to know the status of every bet",
                "More about each bet, with the market and odds on every card",
                "A calmer, clearer cashout button",
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
            caption: "My Bets, 2021 vs now. Live, open, and won states readable at a glance.",
          },
          {
            type: "list",
            heading: "Results",
            items: [
              "Easier to scan and a better experience overall",
              "A more engaging live betting experience, with more sessions per person on live events",
              "Active player days went up 46%",
            ],
          },
        ],
      },
    ],
    outcomes: [
      { value: "21→46%", label: "Retention while I was on the team" },
      { value: "12th→4th", label: "In the UX rankings of US sportsbooks" },
      { value: "2.1m→38s", label: "Picking a bet to placing it" },
      { value: "13.5→22.3", label: "Monthly bets per person" },
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
    tagline: "Starting a community app with a friend and taking it from first sketch to shipped.",
    year: "Since 2023",
    role: "Cofounder · design & build",
    type: "Mobile app",
    accent: "#56aed6",
    intro: [
      "Nigeria is packed. Its population density is roughly seven times that of the United States. If the US were that dense, it would hold 2.3 billion people. Gated communities there have a real problem: letting residents and visitors in safely and quickly when traffic is heavy. The old way, physical gate passes and phone calls to the security post, is full of errors and bottlenecks.",
      "Kiphar is the app a friend and I built to fix that. Easy visitor access, a direct line to security, and emergency help, all in one place, replacing the WhatsApp groups and paper logbooks most estates still run on.",
      "It's also where I stopped handing designs over a wall. I own Kiphar end to end: the research, the design system, every screen, and the build.",
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
        lede: "The goal: really understand what residents and visitors in gated communities need, and what drives them up the wall.",
        blocks: [
          {
            type: "list",
            heading: "Method",
            items: [
              "My partner and I ran interviews, in person and remote, with all kinds of potential users: residents, security staff, and property managers",
              "We asked open questions to understand how they felt about the access systems they already used",
            ],
          },
          {
            type: "list",
            heading: "What we learned",
            items: [
              "Residents hate the long waits at the gate during rush hours",
              "Security staff struggle to manage and check physical gate passes",
              "People want convenience, safety, and instant notifications",
            ],
          },
          {
            type: "text",
            heading: "The competition",
            body: [
              "There was exactly one other product out there, and it was clunky with no real time communication. Its users complained constantly about access codes not working. The gap was obvious: people wanted something complete and easy to use.",
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
            caption: "Snapshots of Clannit, the only other product out there",
            narrow: true,
          },
        ],
      },
      {
        title: "Designing Kiphar",
        lede: "Version one shipped with two core features: creating and checking access codes, and emergencies.",
        blocks: [
          {
            type: "text",
            heading: "Onboarding",
            body: [
              "Onboarding starts with the estate. You create an account, link your home to a specific community with an estate code, and unlock the app once you're verified. From there it wears your estate's branding, so people in Bera Estate see Bera Estate.",
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
            caption: "Sign up starts with the estate: pick it, enter its code, verify your number",
          },
          {
            type: "text",
            heading: "Creating codes",
            body: [
              "Letting visitors in easily was the biggest pain point, and it's really the heart of the app. The “Invite Guest” button sits front and center on the home screen, and once you generate a code it's one tap of the share sheet to send it to your guest.",
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
            caption: "Home screen → guest details → access code → sharing",
          },
          {
            type: "text",
            heading: "Checking codes",
            body: [
              "We built a separate app just for security, available only to the estate and its guards. It does one thing: check access codes, fast. The whole thing is designed to be read at a glance at a busy gate.",
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
            caption: "The security app, with valid, invalid, and expired states",
          },
          {
            type: "text",
            heading: "Emergencies",
            body: [
              "The emergency page puts the essentials one tap away. Raise an alarm, reach security, and call fire, police, medical, or estate lines. Quick help and peace of mind when it counts.",
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
            caption: "Emergency details, one tap from the tab bar",
            narrow: true,
          },
        ],
      },
      {
        title: "Wearing every hat",
        lede: "At a small startup, the design role doesn't stop at the product.",
        blocks: [
          {
            type: "text",
            body: [
              "I took on the marketing too: App Store screenshots, flyers, pricing sheets, and brand bits. When you're a founding team of two, “full stack” means a lot more than code.",
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
                caption: "Flyers and branding",
              },
            ],
          },
        ],
      },
    ],
    outcomes: [
      { value: "2", label: "Gated communities live on the platform" },
      { value: "2", label: "Apps shipped, resident and security" },
      { value: "0→1", label: "Founded, designed, and built" },
    ],
  },
  {
    slug: "cst",
    title: "CST Savings",
    tagline: "Designing a 35 screen onboarding for Canada's education savings foundation.",
    year: "2023",
    role: "Product Designer",
    type: "Mobile app",
    accent: "#18a999",
    intro: [
      "CST Foundation has helped Canadian families save for college since 1960, more than 600,000 families so far. I came on to design the mobile experience for their college savings product.",
      "Starting from a design system I set up for the team, I designed an onboarding flow of more than 35 screens that takes students and parents from first open to a set up plan, tested with real users along the way.",
    ],
    note: "Most of this work is covered by IP agreements, so I can only show approved material here. Happy to walk you through the whole thing in a conversation.",
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
        lede: "The approved glimpse: sign up, profile setup, the welcome, and the progress dashboard.",
        blocks: [
          {
            type: "text",
            body: [
              "The flow had to serve two very different people at once: students dreaming about their university path, and parents setting up a savings plan. It moves from a warm sign up (“Discover your perfect university experience”) through profile setup to a progress screen that turns a complex financial product into a checklist anyone can follow.",
              "Every step was wireframed, prototyped, and tested with users before it went into the design system I'd set up for the team.",
            ],
          },
          {
            type: "image",
            image: {
              src: "/images/cst-02.webp",
              width: 1670,
              height: 991,
              alt: "Four CST app screens: sign up, profile setup, completion confirmation, progress overview",
            },
            caption: "Sign up → profile → welcome → progress",
          },
        ],
      },
    ],
    outcomes: [
      { value: "35+", label: "Onboarding screens designed" },
      { value: "600K+", label: "Families served by CST since 1960" },
      { value: "1", label: "Design system built from scratch" },
    ],
  },
  {
    slug: "trust-bank",
    title: "Trust Bank",
    tagline: "A dark mode banking dashboard playing with depth, light, and hierarchy.",
    year: "2021",
    role: "Designer",
    type: "Concept · Web dashboard",
    accent: "#6fbfa6",
    intro: [
      "Trust Bank is a concept I started on my own: a dark mode banking dashboard to push my craft in elevation, light, and hierarchy. Dark UI falls apart when everything sits flat, so I modeled the whole thing with layered shadow to make it feel dimensional, almost physical.",
    ],
    tools: ["Figma", "Visual design", "Dark UI", "Design exploration"],
    hero: {
      src: "/images/trust-bank-01.webp",
      width: 1800,
      height: 1308,
      alt: "Trust Bank dark mode dashboard with messaging view",
    },
    chapters: [
      {
        title: "Light as hierarchy",
        lede: "If everything glows, nothing matters. Depth had to carry the information architecture.",
        blocks: [
          {
            type: "text",
            body: [
              "The dashboard covers the basics of banking: cards, transfers, payments, a currency converter, account management, and messaging. Every surface sits at a chosen height. The main actions rise toward the light, and the reference info sits back. Shadows do the job that borders and dividers usually do, so it stays clean without going flat.",
              "The messaging view pushed it hardest. List, thread, and detail panes at three different depths, readable in an instant without a single hairline divider.",
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
            caption: "The dashboard home: cards, transfers, payments, operations",
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
    tagline: "A clean little website for an interior design studio.",
    year: "2021",
    role: "Designer",
    type: "Concept · Website",
    accent: "#c49a6c",
    intro: [
      "InHaus is a concept website for an interior design studio. The brief I gave myself was simple: the furniture is the hero, and the interface should get out of the way.",
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
              "The whole design language comes from the studio's own logo: an inky near black (#0C1416) and a warm cream (#FFEECB), set in Poppins. A clean layout and lots of whitespace keep the work front and center, so the interface stays quiet and the interiors do the talking.",
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
            caption: "The whole system: Poppins, ink, and cream",
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
  title: "Dike Uche · UX Designer & Full Stack Builder",
  description:
    "UX designer turned full stack builder. I design digital products end to end, then write the code that ships them.",
};
