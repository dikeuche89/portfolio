import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/projects";
import { capabilities, howItWorks } from "@/data/services";
import Testimonials from "@/components/Testimonials";
import styles from "@/components/Gallery.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dike Uche, UX designer turned full stack builder. Eight years of product design, now shipping the code too.",
  alternates: {
    canonical: "/about",
  },
};

// Marks this page as Dike's profile; the Person entity itself lives in the root layout.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: { "@id": `${site.url}/#person` },
};

const experience = [
  {
    company: "Western Union",
    role: "UX Manager",
    period: "2024 to now",
  },
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
    company: "Independent",
    role: "Client projects, 20+ shipped",
    period: "2018 to now",
  },
];

export default function AboutPage() {
  return (
    <div className={`${styles.shell} ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* intro */}
      <p className={styles.label}>About</p>
      <h1 className={styles.pageTitle}>
        Designer <span className={styles.serif}>who builds.</span>
      </h1>

      <div className={styles.aboutIntro}>
        <div className={styles.aboutPhoto}>
          <Image
            {...site.portrait}
            alt={site.portrait.alt}
            sizes="(min-width: 1280px) 450px, (min-width: 768px) 36vw, calc(100vw - 40px)"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className={styles.bio}>
          <p className={styles.bioLead}>
            I&apos;m Dike, a product designer who got tired of watching good
            design die in handoff. So I learned to build.
          </p>
          <p>
            I started freelancing on Upwork back in 2018 and shipped 20+
            projects across fintech, travel, and ecommerce. From there I led
            interface design at BookingPal, then the core betting experience at
            Tipico, where retention climbed from 21% to 46% while I was there,
            and design systems for CST Savings. In 2023 a friend and I started
            Kiphar, a community app, and for the first time I owned the whole
            thing: the research, the design, and the build. Today I&apos;m the
            UX Manager at Western Union, where I set what the team focuses on
            and still get hands-on with the work myself.
          </p>
          <p>
            These days my toolkit runs from Figma all the way to production
            code: React, Next.js, TypeScript, Tailwind, with a good amount of AI
            in the mix to get from idea to working software fast. A business
            degree keeps me honest about the part that matters: design only
            counts when it ships and the numbers move.
          </p>
          <p>
            Alongside the day job I take on a small number of independent
            projects a year, usually for founders and teams who would rather
            brief one person on the design and the build than coordinate two.
          </p>
        </div>
      </div>

      {/* experience */}
      <section
        className={styles.serviceSection}
        aria-labelledby="experience-title"
      >
        <h2 id="experience-title" className={styles.label}>
          Experience
        </h2>
        <ul className={styles.experience}>
          {experience.map((job) => (
            <li key={job.company}>
              <h3>{job.company}</h3>
              <p className={styles.jobRole}>{job.role}</p>
              <p className={styles.jobPeriod}>{job.period}</p>
            </li>
          ))}
        </ul>
        <p className={styles.footnote}>
          BA Business Management, De Montfort University
        </p>
      </section>

      <section
        id="how-i-work"
        className={styles.serviceSection}
        aria-labelledby="services-title"
      >
        <p className={styles.label}>How I can help</p>
        <h2 id="services-title" className={styles.heading}>
          From the idea to the details.
        </h2>
        <div className={styles.serviceList}>
          {capabilities.map((capability, index) => (
            <details className={styles.service} key={capability.title}>
              <summary>
                <span className={`${styles.label} ${styles.accentLabel}`}>
                  0{index + 1}
                </span>
                <span className={styles.serviceTitle}>{capability.title}</span>
              </summary>
              <div className={styles.serviceBody}>
                <p>{capability.blurb}</p>
                <ul>
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
        <div className={styles.process}>
          <h3>How a project runs</h3>
          <ol>
            {howItWorks.map((phase, index) => (
              <li key={phase.step}>
                <span className={`${styles.label} ${styles.accentLabel}`}>
                  0{index + 1}
                </span>
                <h4>{phase.step}</h4>
                <p>{phase.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* off the clock */}
      <section
        className={styles.serviceSection}
        aria-labelledby="off-the-clock-title"
      >
        <h2 id="off-the-clock-title" className={styles.label}>
          Off the clock
        </h2>
        <p className={styles.statement}>
          You&apos;ll usually find me on hiking trails, behind a camera, in the
          kitchen, or watching soccer, and mentoring junior designers making
          the same jump I did.
        </p>
        <a href={`mailto:${site.email}`} className={styles.textLink}>
          Say hello <span aria-hidden="true">↗</span>
        </a>
      </section>
      <Testimonials />
    </div>
  );
}
