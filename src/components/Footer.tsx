"use client";

import { usePathname } from "next/navigation";
import { site } from "@/data/projects";
import { AskDikeTrigger } from "@/components/AskDike";
import Playground from "@/components/Playground";
import styles from "./Gallery.module.css";

export default function Footer() {
  const homepage = usePathname() === "/";
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.closing}>
          <p className={`${styles.label} ${styles.accentLabel}`}>
            {homepage ? "03 / Your next project" : "Your next project"}
          </p>
          <h2 className={styles.closingTitle}>
            <a href={`mailto:${site.email}`}>
              Let’s <span className={styles.serif}>build</span> it
              <span className={styles.closingArrow} aria-hidden="true">
                ↗
              </span>
            </a>
          </h2>
          <div className={styles.contactLinks}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
        <div className={styles.signoff}>
          <span>© 2026 Dike Uche · Thought through. Built through.</span>
          <div className={styles.footerTools}>
            {!homepage && <AskDikeTrigger />}
            <Playground />
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
