"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeroAssembly from "@/components/HeroAssembly";
import styles from "./Hero.module.css";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-reveal]", {
          y: 24,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all",
        });
      });
      return () => media.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className={styles.hero}
      aria-labelledby="hero-title"
      id="hero"
    >
      <div className={styles.viewport}>
        <div className={styles.light} aria-hidden="true" />
        <div className={styles.horizon} aria-hidden="true" />
        <div className={styles.body}>
          <div className={styles.copy}>
            <p className={styles.eyebrow} data-hero-reveal>
              <span className={styles.identityMark} aria-hidden="true" />
              Dike Uche / Designer &amp; builder
            </p>
            <h1 id="hero-title" className={styles.headline} data-hero-reveal>
              <span className={styles.design}>
                Design<span className={styles.punctuation}>,</span>
              </span>
              <span className={styles.engineered}>
                engineered<span className={styles.punctuation}>.</span>
              </span>
            </h1>
            <p className={styles.description} data-hero-reveal>
              From the first what-if to the final it-works.
              <span>
                I design digital products, then build them into the real thing.
              </span>
            </p>
            <div className={styles.actions} data-hero-reveal>
              <Link href="#work" className={styles.workLink}>
                Explore the work <span aria-hidden="true">↗</span>
              </Link>
              <span className={styles.endToEnd}>
                Thought through. Built through.
              </span>
            </div>
          </div>
          <HeroAssembly />
        </div>
        <div className={styles.footer}>
          <p>
            <span className={styles.footerIndex}>01 — 03</span> Idea. System.
            Product.
          </p>
          <span className={styles.footerNote}>Every layer, considered.</span>
          <a href="#work" className={styles.scrollCue}>
            Scroll to assemble <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
