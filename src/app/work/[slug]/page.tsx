import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ParallaxImage from "@/components/ParallaxImage";
import ScrollProgress from "@/components/ScrollProgress";
import { ClipReveal, Reveal, SplitReveal } from "@/components/reveal";
import {
  getProject,
  nextProject,
  projects,
  type Block,
  type Project,
} from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { images: [project.hero.src] },
  };
}

const CONTENT_SIZES = "(min-width: 768px) 70vw, 100vw";

function CaseBlock({ block, accent }: { block: Block; accent: string }) {
  switch (block.type) {
    case "text":
      return (
        <Reveal>
          <div className="max-w-[65ch]">
            {block.heading && (
              <h3 className="display mb-5 text-xl md:text-2xl">{block.heading}</h3>
            )}
            <div className="space-y-5">
              {block.body.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-fg/85">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      );

    case "list":
      return (
        <Reveal>
          <div className="max-w-[68ch]">
            {block.heading && (
              <h3 className="display mb-5 text-xl md:text-2xl">{block.heading}</h3>
            )}
            {block.intro && (
              <p className="mb-5 text-lg leading-relaxed text-fg/85">{block.intro}</p>
            )}
            <ol className="border-b border-line">
              {block.items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-5 border-t border-line py-4 text-base leading-relaxed text-fg/85"
                >
                  <span
                    className="font-mono text-[0.6875rem] leading-[1.9] tracking-[0.18em]"
                    style={{ color: accent }}
                  >
                    0{i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      );

    case "quotes":
      return (
        <Reveal>
          <div>
            {block.heading && (
              <h3 className="display mb-5 text-xl md:text-2xl">{block.heading}</h3>
            )}
            {block.intro && (
              <p className="mb-8 max-w-[65ch] text-lg leading-relaxed text-fg/85">
                {block.intro}
              </p>
            )}
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {block.items.map((quote, i) => (
                <blockquote
                  key={i}
                  className="serif-italic border-l pl-5 text-xl leading-snug text-fg/90 md:text-2xl"
                  style={{ borderColor: `${accent}66` }}
                >
                  “{quote}”
                </blockquote>
              ))}
            </div>
          </div>
        </Reveal>
      );

    case "stats":
      return (
        <Reveal>
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {block.items.map((stat) => (
              <div key={stat.label} className="bg-bg p-6 md:p-7">
                <p
                  className="display text-[clamp(1.75rem,3vw,2.5rem)]"
                  style={{ color: accent }}
                >
                  {stat.value}
                </p>
                <p className="kicker mt-3 normal-case tracking-[0.08em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      );

    case "compare":
      return (
        <Reveal>
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {[block.left, block.right].map((side, s) => (
              <div key={side.title} className="bg-bg p-6 md:p-8">
                <p className="kicker mb-6" style={s === 1 ? { color: accent } : undefined}>
                  {s === 0 ? "— " : "+ "}
                  {side.title}
                </p>
                <ul className="space-y-4">
                  {side.items.map((item, i) => (
                    <li key={i} className="flex gap-4 text-sm leading-relaxed text-fg/85">
                      <span
                        className="font-mono text-[0.625rem] leading-[1.9] tracking-[0.18em]"
                        style={{ color: s === 1 ? accent : "var(--color-muted)" }}
                      >
                        0{i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      );

    case "process":
      return (
        <Reveal>
          <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {block.steps.map((step, i) => (
              <li key={step} className="bg-bg p-6">
                <span className="kicker block" style={{ color: accent }}>
                  0{i + 1}
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-fg/85">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      );

    case "image":
      return (
        <figure className={block.narrow ? "max-w-xl" : undefined}>
          <ClipReveal>
            <Image
              src={block.image.src}
              width={block.image.width}
              height={block.image.height}
              alt={block.image.alt}
              sizes={block.narrow ? "(min-width: 768px) 36rem, 100vw" : CONTENT_SIZES}
              className="h-auto w-full"
            />
          </ClipReveal>
          {block.caption && (
            <Reveal delay={0.3} y={14}>
              <figcaption className="kicker mt-4 normal-case tracking-[0.08em]">
                {block.caption}
              </figcaption>
            </Reveal>
          )}
        </figure>
      );

    case "pair":
      return (
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-8">
          {block.images.map(({ image, caption }, i) => (
            <figure key={image.src}>
              <ClipReveal delay={i * 0.15}>
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  sizes="(min-width: 768px) 35vw, 100vw"
                  className="h-auto w-full"
                />
              </ClipReveal>
              {caption && (
                <Reveal delay={0.3 + i * 0.15} y={14}>
                  <figcaption className="kicker mt-4 normal-case tracking-[0.08em]">
                    {caption}
                  </figcaption>
                </Reveal>
              )}
            </figure>
          ))}
        </div>
      );
  }
}

function Chapters({ project }: { project: Project }) {
  return (
    <div>
      {project.chapters.map((chapter, ci) => (
        <section
          key={chapter.title}
          className="grid gap-8 border-t border-line pt-10 md:grid-cols-12 md:pt-14 mt-20 md:mt-28"
        >
          <div className="md:col-span-3">
            <p className="kicker md:sticky md:top-28">
              ( Chapter 0{ci + 1} / 0{project.chapters.length} )
            </p>
          </div>
          <div className="md:col-span-9">
            <SplitReveal as="h2" mode="chars" className="display text-[clamp(2rem,5vw,4rem)]">
              {chapter.title}
            </SplitReveal>
            {chapter.lede && (
              <Reveal delay={0.1}>
                <p className="serif-italic mt-5 max-w-2xl text-xl leading-relaxed text-muted md:text-2xl">
                  {chapter.lede}
                </p>
              </Reveal>
            )}
            <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
              {chapter.blocks.map((block, bi) => (
                <CaseBlock key={bi} block={block} accent={project.accent} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = nextProject(slug);

  return (
    <article className="px-5 pt-32 md:px-10 md:pt-44">
      <ScrollProgress color={project.accent} />
      {/* hero */}
      <header className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full opacity-[0.13] blur-[120px]"
          style={{ background: project.accent }}
        />
        <Reveal>
          <p className="kicker">
            ( Case study — 0{index + 1} / 0{projects.length} )
          </p>
        </Reveal>
        <SplitReveal
          as="h1"
          immediate
          mode="chars"
          delay={0.15}
          className="display mt-6 text-[clamp(3rem,11vw,11rem)]"
        >
          {project.title}
        </SplitReveal>
        <SplitReveal
          as="p"
          immediate
          delay={0.35}
          className="serif-italic mt-6 max-w-3xl text-[clamp(1.35rem,2.8vw,2.25rem)] leading-[1.25] text-fg/90"
        >
          {project.tagline}
        </SplitReveal>

        <Reveal delay={0.3}>
          <dl className="mt-14 grid grid-cols-2 gap-y-8 border-t border-line pt-6 md:grid-cols-4">
            {[
              ["Role", project.role],
              ["Type", project.type],
              ["Year", project.year],
              ["Tools", project.tools.join(", ")],
            ].map(([label, value]) => (
              <div key={label} className="pr-6">
                <dt className="kicker mb-2.5">{label}</dt>
                <dd className="text-sm leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      <div className="mt-14 md:mt-20">
        <ParallaxImage
          src={project.hero.src}
          width={project.hero.width}
          height={project.hero.height}
          alt={project.hero.alt}
          priority
          clipReveal
          sizes="(min-width: 768px) 95vw, 100vw"
        />
      </div>

      {/* overview */}
      <section className="grid gap-8 pt-20 md:grid-cols-12 md:pt-32">
        <div className="md:col-span-3">
          <Reveal>
            <p className="kicker md:sticky md:top-28">( Overview )</p>
          </Reveal>
        </div>
        <div className="space-y-7 md:col-span-8 md:col-start-4 lg:col-span-7">
          {project.intro.map((para, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-lg leading-relaxed text-fg/90 md:text-xl">{para}</p>
            </Reveal>
          ))}
          {project.note && (
            <Reveal>
              <p
                className="serif-italic border-l pl-5 text-lg leading-relaxed text-muted"
                style={{ borderColor: project.accent }}
              >
                {project.note}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* chapters */}
      <Chapters project={project} />

      {/* outcomes */}
      {project.outcomes && (
        <section className="mt-24 border-t border-line pt-10 md:mt-32 md:pt-14">
          <Reveal>
            <p className="kicker mb-8">( Outcomes )</p>
          </Reveal>
          <div
            className={`grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 ${
              project.outcomes.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {project.outcomes.map((stat, i) => (
              <div key={stat.label} className="bg-bg p-7 md:p-9">
                <Reveal delay={i * 0.07}>
                  <p
                    className="display text-[clamp(2rem,4vw,3.25rem)]"
                    style={{ color: project.accent }}
                  >
                    {stat.value}
                  </p>
                  <p className="kicker mt-4 normal-case tracking-[0.08em]">{stat.label}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* closing image */}
      {project.closingImage && (
        <div className="mt-16 md:mt-24">
          <ParallaxImage
            src={project.closingImage.src}
            width={project.closingImage.width}
            height={project.closingImage.height}
            alt={project.closingImage.alt}
            sizes="(min-width: 768px) 95vw, 100vw"
            amount={4}
            clipReveal
          />
        </div>
      )}

      {/* next project */}
      <section className="mt-28 md:mt-40">
        <Reveal>
          <p className="kicker">( Next project )</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Link href={`/work/${next.slug}`} className="group mt-6 block" data-cursor>
            <span className="display block text-[clamp(2.75rem,9vw,9rem)] transition-colors duration-500 group-hover:text-muted">
              {next.title}
              <span className="inline-block transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2">
                ↗
              </span>
            </span>
          </Link>
        </Reveal>
      </section>
    </article>
  );
}
