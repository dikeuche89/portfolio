import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import WorkGallery from "@/components/WorkGallery";
import { AskDikeTrigger } from "@/components/AskDike";
import { projects } from "@/data/projects";
import { featuredTestimonial } from "@/data/testimonials";
import styles from "@/components/Gallery.module.css";

export default function Home() {
  return (
    <div id="homepage">
      <Hero />
      <div className={styles.shell}>
        <WorkGallery projects={projects} />
        <section
          className={styles.person}
          aria-labelledby="person-title"
          id="person"
        >
          <div className={styles.personGrid}>
            <div className={styles.portrait}>
              <Image
                src="/images/me-portrait.webp"
                alt="Dike Uche"
                width={584}
                height={1600}
                sizes="(max-width: 560px) 110px, 180px"
              />
            </div>
            <div>
              <p className={`${styles.label} ${styles.accentLabel}`}>
                02 / The person
              </p>
              <h2 id="person-title" className={styles.heading}>
                Good to meet you.
                <br />
                <span className={styles.serif}>I’m Dike.</span>
              </h2>
              <p className={styles.personCopy}>
                I bring product thinking, design craft, and code to the same
                table. From the big decisions to the smallest details, I stay
                involved.
              </p>
              <div className={styles.personLinks}>
                <Link className={styles.textLink} href="/about">
                  More about me &amp; how I work{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
                <AskDikeTrigger
                  className={`${styles.textLink} ${styles.secondaryLink}`}
                />
              </div>
              <ul className={styles.capabilities} aria-label="Capabilities">
                <li>Product design</li>
                <li>Design systems</li>
                <li>Frontend engineering</li>
              </ul>
            </div>
          </div>
          <figure className={styles.quote}>
            <p className={styles.label}>A collaborator’s perspective</p>
            <div>
              <blockquote>“{featuredTestimonial.excerpt}”</blockquote>
              <figcaption>
                {featuredTestimonial.name} · {featuredTestimonial.title},{" "}
                {featuredTestimonial.company}
              </figcaption>
            </div>
          </figure>
        </section>
      </div>
    </div>
  );
}
