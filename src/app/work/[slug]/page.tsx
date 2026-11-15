import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollProgress from "@/components/ScrollProgress";
import {
  getProject,
  nextProject,
  projects,
  type Block,
  type Project,
} from "@/data/projects";
import styles from "@/components/Gallery.module.css";

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
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: { images: [project.hero.src] },
  };
}

// full width of the page shell, and of the chapter column inside it
const SHELL_SIZES =
  "(min-width: 1280px) 1200px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)";
const CONTENT_SIZES =
  "(min-width: 1280px) 880px, (min-width: 768px) 72vw, calc(100vw - 40px)";

function CaseBlock({ block, accent }: { block: Block; accent: string }) {
  switch (block.type) {
    case "text":
      return (
        <div className="max-w-[65ch]">
          {block.heading && (
            <h3 className={styles.blockTitle}>{block.heading}</h3>
          )}
          <div className="space-y-5">
            {block.body.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-fg/85">
                {para}
              </p>
            ))}
          </div>
        </div>
      );

    case "list":
      return (
        <div className="max-w-[68ch]">
          {block.heading && (
            <h3 className={styles.blockTitle}>{block.heading}</h3>
          )}
          {block.intro && (
            <p className="mb-5 text-lg leading-relaxed text-fg/85">
              {block.intro}
            </p>
          )}
          <ol className="border-b border-line">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="flex gap-5 border-t border-line py-4 text-base leading-relaxed text-fg/85"
              >
                <span
                  className="font-mono text-[0.6875rem] leading-[1.9] tracking-[0.13em]"
                  style={{ color: accent }}
                >
                  0{i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "quotes":
      return (
        <div>
          {block.heading && (
            <h3 className={styles.blockTitle}>{block.heading}</h3>
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
                className={styles.pullQuote}
                style={{ borderColor: `${accent}66` }}
              >
                “{quote}”
              </blockquote>
            ))}
          </div>
        </div>
      );

    case "stats":
      return (
        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {block.items.map((stat) => (
            <div key={stat.label} className="bg-bg p-6 md:p-7">
              <p className={styles.statValue} style={{ color: accent }}>
                {stat.value}
              </p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      );

    case "compare":
      return (
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {[block.left, block.right].map((side, s) => (
            <div key={side.title} className="bg-bg p-6 md:p-8">
              <p
                className={styles.label}
                style={s === 1 ? { color: accent } : undefined}
              >
                {s === 0 ? "✕ " : "✓ "}
                {side.title}
              </p>
              <ul className="mt-6 space-y-4">
                {side.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-sm leading-relaxed text-fg/85"
                  >
                    <span
                      className="font-mono text-[0.625rem] leading-[1.9] tracking-[0.13em]"
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
      );

    case "process":
      return (
        <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {block.steps.map((step, i) => (
            <li key={step} className="bg-bg p-6">
              <span
                className={`${styles.label} block`}
                style={{ color: accent }}
              >
                0{i + 1}
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-fg/85">
                {step}
              </span>
            </li>
          ))}
        </ol>
      );

    case "image":
      return (
        <figure className={block.narrow ? "max-w-xl" : undefined}>
          <Image
            src={block.image.src}
            width={block.image.width}
            height={block.image.height}
            alt={block.image.alt}
            sizes={
              block.narrow
                ? "(min-width: 768px) 36rem, calc(100vw - 40px)"
                : CONTENT_SIZES
            }
            className="h-auto w-full"
          />
          {block.caption && (
            <figcaption className={styles.figcaption}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "pair":
      return (
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-8">
          {block.images.map(({ image, caption }) => (
            <figure key={image.src}>
              <Image
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                sizes="(min-width: 1280px) 430px, (min-width: 768px) 35vw, calc(100vw - 40px)"
                className="h-auto w-full"
              />
              {caption && (
                <figcaption className={styles.figcaption}>{caption}</figcaption>
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
          className={`${styles.chapter} mt-20 grid gap-8 border-t border-line pt-10 md:mt-28 md:grid-cols-12 md:pt-14`}
        >
          <div className="md:col-span-3">
            <p className={`${styles.label} md:sticky md:top-28`}>
              Chapter 0{ci + 1} / 0{project.chapters.length}
            </p>
          </div>
          <div className="md:col-span-9">
            <h2 className={styles.heading}>{chapter.title}</h2>
            {chapter.lede && (
              <p className={styles.chapterLede}>{chapter.lede}</p>
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

  const next = nextProject(slug);

  return (
    <article className={`${styles.shell} ${styles.page}`}>
      <ScrollProgress color={project.accent} />
      {/* hero */}
      <header className={styles.caseHeader}>
        <div
          aria-hidden
          className={styles.caseGlow}
          style={{ background: project.accent }}
        />
        <p className={styles.label}>Case study</p>
        <h1 className={styles.pageTitle}>{project.title}</h1>
        <p className={styles.lede}>{project.tagline}</p>

        <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t border-line pt-6 md:mt-14 md:grid-cols-4">
          {[
            ["Role", project.role],
            ["Type", project.type],
            ["Year", project.year],
            ["Tools", project.tools.join(", ")],
          ].map(([label, value]) => (
            <div
              key={label}
              className={`pr-6 ${label === "Tools" ? "col-span-2 md:col-span-1" : ""}`}
            >
              <dt className={styles.label}>{label}</dt>
              <dd className="mt-2.5 text-sm leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className={styles.cover}>
        <Image
          src={project.hero.src}
          width={project.hero.width}
          height={project.hero.height}
          alt={project.hero.alt}
          sizes={SHELL_SIZES}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* overview */}
      <section
        className="grid gap-8 pt-20 md:grid-cols-12 md:pt-28"
        aria-labelledby="overview-title"
      >
        <div className="md:col-span-3">
          <h2
            id="overview-title"
            className={`${styles.label} md:sticky md:top-28`}
          >
            Overview
          </h2>
        </div>
        <div className="space-y-7 md:col-span-8 md:col-start-4 lg:col-span-7">
          {project.intro.map((para, i) => (
            <p key={i} className="text-lg leading-relaxed text-fg/90 md:text-xl">
              {para}
            </p>
          ))}
          {project.note && (
            <p
              className={styles.aside}
              style={{ borderColor: project.accent }}
            >
              {project.note}
            </p>
          )}
        </div>
      </section>

      {/* chapters */}
      <Chapters project={project} />

      {/* outcomes */}
      {project.outcomes && (
        <section
          className="mt-24 border-t border-line pt-10 md:mt-32 md:pt-14"
          aria-labelledby="outcomes-title"
        >
          <h2 id="outcomes-title" className={styles.label}>
            Outcomes
          </h2>
          <div
            className={`mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 ${
              project.outcomes.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {project.outcomes.map((stat) => (
              <div key={stat.label} className="bg-bg p-7 md:p-9">
                <p
                  className={`${styles.statValue} ${styles.outcomeValue}`}
                  style={{ color: project.accent }}
                >
                  {stat.value}
                </p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* closing image */}
      {project.closingImage && (
        <div className="mt-16 md:mt-24">
          <Image
            src={project.closingImage.src}
            width={project.closingImage.width}
            height={project.closingImage.height}
            alt={project.closingImage.alt}
            sizes={SHELL_SIZES}
            className="h-auto w-full"
          />
        </div>
      )}

      {/* next project */}
      <section className="mt-28 md:mt-40">
        <p className={styles.label}>Next project</p>
        <Link href={`/work/${next.slug}`} className={styles.nextLink}>
          {next.title}
          <span className={styles.projectArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
      </section>
    </article>
  );
}
