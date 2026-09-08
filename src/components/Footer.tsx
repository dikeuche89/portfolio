"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/projects";
import { AskDikeTrigger } from "@/components/AskDike";
import Appearance from "@/components/Appearance";
import styles from "./Gallery.module.css";

export default function Footer() {
  const pathname = usePathname();
  const homepage = pathname === "/";
  const afterHours = pathname === "/after-hours";
  return (
    <footer
      id="contact"
      className={styles.footer}
      style={afterHours ? { marginTop: 24 } : undefined}
    >
      <div className={styles.shell}>
        {!afterHours ? (
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
        ) : null}
        <div className={styles.signoff}>
          <span>© 2026 Dike Uche · Thought through. Built through.</span>
          <div className={styles.footerTools}>
            {!homepage && !afterHours && <AskDikeTrigger />}
            {!afterHours ? (
              <Link href="/after-hours">After hours ↗</Link>
            ) : (
              <Link href="/">Back to portfolio ↗</Link>
            )}
            <Appearance />
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
