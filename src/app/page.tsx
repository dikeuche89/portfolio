import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import WorkList from "@/components/WorkList";
import Portrait from "@/components/Portrait";
import { Reveal, SplitReveal, WordScrub } from "@/components/reveal";
import { projects } from "@/data/projects";

const capabilities = [
  {
    title: "Product Design",
    blurb: "Research, flows and interfaces that earn their place on the screen.",
    items: [
      "UX strategy",
      "User research",
      "Wireframing & prototyping",
      "Interaction design",
      "Usability testing",
    ],
  },
  {
    title: "Design Systems",
    blurb: "Three systems built from zero — tokens, components, and the docs to scale them.",
    items: [
      "Token architecture",
      "Component libraries",
      "Figma libraries",
      "Documentation",
      "Cross-team governance",
    ],
  },
  {
    title: "Full-Stack Build",
    blurb: "From Figma to production. I ship what I design.",
    items: [
      "React & Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node & APIs",
      "AI-powered workflows",
    ],
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <Marquee
        items={[
          "Product design",
          "Design systems",
          "Frontend engineering",
          "UX strategy",
          "Full-stack build",
        ]}
        className="mt-6"
      />

      {/* selected work */}
      <section id="work" className="scroll-mt-24 px-5 pt-24 md:px-10 md:pt-36">
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <Reveal>
            <p className="kicker">( 01 — Selected work )</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="kicker">2020 — 2026</p>
          </Reveal>
        </div>
        <WorkList projects={projects} />
      </section>

      {/* manifesto */}
      <section className="px-5 pt-28 md:px-10 md:pt-44">
        <Reveal>
          <p className="kicker mb-8">( 02 — The point )</p>
        </Reveal>
        <WordScrub className="display max-w-6xl text-[clamp(1.75rem,4.5vw,4rem)] font-bold normal-case leading-[1.05]">
          Most designers stop at handoff. I keep going — through the
          components, the edge cases, and the deploy. Design that ships is the
          only design that counts.
        </WordScrub>
        <Reveal delay={0.15} className="mt-10">
          <Link
            href="/about"
            className="link-underline font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted hover:text-accent"
          >
            More about me ↗
          </Link>
        </Reveal>
      </section>

      {/* capabilities */}
      <section className="px-5 pt-28 md:px-10 md:pt-44">
        <Reveal>
          <p className="kicker mb-10 md:mb-14">( 03 — What I do )</p>
        </Reveal>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <div key={cap.title} className="bg-bg p-7 md:p-9">
              <Reveal delay={i * 0.08}>
                <p className="kicker accent mb-8">0{i + 1}</p>
                <h3 className="display text-2xl md:text-[1.75rem]">{cap.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{cap.blurb}</p>
                <ul className="mt-8 space-y-2.5 border-t border-line pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                  {cap.items.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* about teaser */}
      <section className="grid gap-10 px-5 pt-28 md:grid-cols-12 md:gap-8 md:px-10 md:pt-44">
        <div className="md:col-span-5">
          <Portrait className="aspect-[4/5] w-full md:aspect-[3/4]" />
        </div>
        <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="kicker mb-8">( 04 — About )</p>
          </Reveal>
          <SplitReveal className="display text-[clamp(2rem,4.5vw,3.75rem)]">
            A designer who got tired of watching good work die in handoff.
          </SplitReveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md leading-relaxed text-muted">
              I design and build digital products from idea to launch —
              combining product thinking, UX craft, and AI-powered workflows.
              Figma to production code, with everything in between.
            </p>
            <Link
              href="/about"
              className="link-underline mt-8 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted hover:text-accent"
            >
              The full story ↗
            </Link>
          </Reveal>
        </div>
      </section>

      {/* testimonial */}
      <section className="px-5 pt-28 md:px-10 md:pt-44">
        <Reveal>
          <p className="kicker mb-10">( 05 — Word on the street )</p>
        </Reveal>
        <SplitReveal
          as="blockquote"
          className="serif-italic max-w-5xl text-[clamp(1.5rem,3.6vw,3rem)] leading-[1.2]"
        >
          “Dike&apos;s design style is both modern and visually appealing. He has an
          intuitive knack for creating designs that are not only functional but
          also aesthetically pleasing. His work showcases a contemporary design
          language that is sure to resonate with users and clients alike.”
        </SplitReveal>
        <Reveal delay={0.15}>
          <p className="kicker mt-10">
            Daniel Eordogh — SVP of Product & Technology, LeoVegas Group
          </p>
        </Reveal>
      </section>
    </>
  );
}
