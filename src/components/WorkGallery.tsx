import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import styles from "./Gallery.module.css";

const featuredSlugs = ["tipico", "kiphar", "cst"];
const captions: Record<string, string> = {
  tipico: "Finding clarity in a complex sportsbook.",
  kiphar: "A community app, from first sketch to shipped.",
  cst: "A clearer start to saving for college.",
};

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const retention =
    project.slug === "tipico" ? project.outcomes?.[0] : undefined;
  return (
    <article className={featured ? styles.feature : undefined}>
      <Link
        className={styles.projectLink}
        href={`/work/${project.slug}`}
        aria-label={`View ${project.title} case study`}
      >
        <div className={styles.art}>
          <Image
            {...project.hero}
            alt={project.hero.alt}
            sizes={
              featured
                ? "(min-width: 1280px) 1200px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
                : "(min-width: 1280px) 584px, (min-width: 768px) calc((100vw - 112px) / 2), (min-width: 561px) calc((100vw - 62px) / 2), calc(100vw - 40px)"
            }
          />
        </div>
        <div className={styles.caption}>
          <div>
            <h3 className={styles.projectTitle}>
              {project.title}
              <span className={styles.projectArrow} aria-hidden="true">
                ↗
              </span>
            </h3>
            <p className={styles.description}>
              {captions[project.slug] ?? project.tagline}
            </p>
            <p className={styles.role}>
              {project.role} · {project.type}
            </p>
          </div>
          {featured && retention && (
            <div className={styles.proof}>
              <span className={styles.proofValue}>21% → 46%</span>
              <span className={styles.proofLabel}>{retention.label}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default function WorkGallery({ projects }: { projects: Project[] }) {
  const featured = featuredSlugs.flatMap((slug) =>
    projects.filter((project) => project.slug === slug),
  );
  const archive = projects.filter(
    (project) => !featuredSlugs.includes(project.slug),
  );
  return (
    <section id="work" className={styles.work} aria-labelledby="work-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={`${styles.label} ${styles.accentLabel}`}>
            01 / Selected work
          </p>
          <h2 id="work-title" className={styles.heading}>
            Made with purpose.
            <br />
            <span className={styles.serif}>Built for people.</span>
          </h2>
        </div>
        <span className={styles.layers} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      {featured[0] && <ProjectCard project={featured[0]} featured />}
      <div className={styles.pair}>
        {featured.slice(1).map((project) => (
          <ProjectCard project={project} key={project.slug} />
        ))}
      </div>
      {archive.length > 0 && (
        <details className={styles.archive}>
          <summary>
            More work{" "}
            <span className={styles.archiveCount}>
              {String(archive.length).padStart(2, "0")}
            </span>
          </summary>
          <div className={styles.archiveLinks}>
            {archive.map((project) => (
              <Link
                key={project.slug}
                className={styles.archiveLink}
                href={`/work/${project.slug}`}
              >
                {project.title} ↗ <span>{project.type}</span>
              </Link>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
