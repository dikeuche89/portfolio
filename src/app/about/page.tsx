import type { Metadata } from "next";
import ParallaxImage from "@/components/ParallaxImage";
import Portrait from "@/components/Portrait";
import { Reveal, SplitReveal, WordScrub } from "@/components/reveal";
import { site } from "@/data/projects";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dike Uche, UX designer turned full stack builder. Eight years of product design, now shipping the code too.",
};

const experience = [
  {
    company: "Kiphar",
    role: "Cofounder · design & build",
    period: "2023 to now",
  },
  {
    company: "CST Savings",
    role: "Product Designer",
    period: "2023",
  },
  {
    company: "Tipico",
    role: "UI/UX Designer",
    period: "2022 to 2023",
  },
  {
    company: "BookingPal",
    role: "Product Designer",
    period: "2020 to 2022",
  },
  {
    company: "Upwork",
    role: "Freelance designer, 20+ projects",
    period: "2018 to 2022",
  },
];

const toolbox = [
  {
    label: "Design",
    items: [
      "Figma & Figma Make",
      "Design systems",
      "Prototyping",
      "User research",
      "Usability testing",
      "Interaction design",
    ],
  },
  {
    label: "Build",
    items: [
      "React & Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node & APIs",
      "Builder.io",
      "Claude & AI workflows",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="px-5 pt-32 md:px-10 md:pt-44">
      {/* intro */}
      <Reveal>
        <p className="kicker">( About · Dike Uche )</p>
      </Reveal>
      <SplitReveal
        as="h1"
        immediate
        mode="chars"
        delay={0.15}
        className="display mt-6 text-[clamp(2.75rem,9.5vw,9.5rem)]"
      >
        Designer <span className="serif-italic">who builds.</span>
      </SplitReveal>

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Portrait className="aspect-[4/5] w-full md:aspect-[3/4]" />
        </div>
        <div className="space-y-7 text-lg leading-relaxed text-fg/90 md:col-span-6 md:col-start-7 md:text-xl">
          <Reveal>
            <p>
              I&apos;m Dike, a product designer who got tired of watching good
              design die in handoff. So I learned to build.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              I started freelancing on Upwork back in 2018 and shipped 20+
              projects across fintech, travel, and ecommerce. From there I led
              interface design at BookingPal, then the core betting experience
              at Tipico, where retention climbed from 21% to 46% while I was
              there, and design systems for CST Savings. In 2023 a friend and I
              started Kiphar, a community app, and for the first time I owned the
              whole thing: the research, the design, and the build.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              These days my toolkit runs from Figma all the way to production
              code: React, Next.js, TypeScript, Tailwind, with a good amount of
              AI in the mix to get from idea to working software fast. A
              business degree keeps me honest about the part that matters:
              design only counts when it ships and the numbers move.
            </p>
          </Reveal>
        </div>
      </div>

      {/* experience */}
      <section className="pt-28 md:pt-44">
        <Reveal>
          <p className="kicker mb-10 md:mb-14">( Experience )</p>
        </Reveal>
        <div className="border-b border-line">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.05}>
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-t border-line py-6 md:grid-cols-[1fr_1fr_auto] md:py-8">
                <h3 className="display text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold">
                  {job.company}
                </h3>
                <p className="kicker hidden md:block">{job.role}</p>
                <p className="kicker text-right">{job.period}</p>
                <p className="kicker col-span-2 mt-2 md:hidden">{job.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="kicker mt-6">
            BA Business Management, De Montfort University
          </p>
        </Reveal>
      </section>

      {/* toolbox */}
      <section className="pt-28 md:pt-44">
        <Reveal>
          <p className="kicker mb-10 md:mb-14">( Toolbox )</p>
        </Reveal>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {toolbox.map((col, i) => (
            <div key={col.label} className="bg-bg p-7 md:p-9">
              <Reveal delay={i * 0.08}>
                <h3 className="display text-2xl md:text-[1.75rem]">{col.label}</h3>
                <ul className="mt-8 space-y-2.5 border-t border-line pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                  {col.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* off the clock */}
      <section className="grid gap-10 pt-28 md:grid-cols-12 md:gap-8 md:pt-44">
        <div className="flex flex-col justify-center md:col-span-6">
          <Reveal>
            <p className="kicker mb-8">( Off the clock )</p>
          </Reveal>
          <WordScrub className="display max-w-xl text-[clamp(1.6rem,3.6vw,3rem)] font-bold normal-case leading-[1.08]">
            Hiking trails, behind a camera, in the kitchen, or watching soccer.
            And mentoring junior designers making the same jump I did.
          </WordScrub>
          <Reveal delay={0.1}>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-10 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted hover:text-accent"
            >
              Say hello ↗
            </a>
          </Reveal>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <ParallaxImage
            src="/images/home-02.webp"
            width={1800}
            height={2400}
            alt="Dike Uche hiking on a mountain trail"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[4/5] [&_img]:h-full [&_img]:object-cover"
            clipReveal
          />
        </div>
      </section>
    </div>
  );
}
