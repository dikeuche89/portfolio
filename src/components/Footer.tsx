"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/data/projects";
import { Reveal } from "@/components/reveal";
import Magnetic from "@/components/Magnetic";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // the giant name rises out of the floor as the footer arrives
      gsap.fromTo(
        "[data-footer-name]",
        { yPercent: 55 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-footer-name]",
            start: "top bottom",
            end: "bottom 98%",
            scrub: true,
          },
        }
      );
    },
    { scope }
  );

  return (
    <footer ref={scope} id="contact" className="relative mt-28 md:mt-40">
      <div className="border-t border-line px-[max(1.25rem,env(safe-area-inset-left))] pb-[env(safe-area-inset-bottom)] pt-16 md:px-10 md:pt-24">
        <Reveal>
          <p className="kicker">( Got an idea? )</p>
        </Reveal>
        <Reveal delay={0.08}>
          <a
            href={`mailto:${site.email}`}
            className="group mt-6 block"
            data-cursor
          >
            <span className="display block text-[clamp(2.75rem,9vw,9rem)] transition-colors duration-500 group-hover:text-accent">
              Let&apos;s <span className="serif-italic">build</span> it
              <span className="accent inline-block transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2">
                ↗
              </span>
            </span>
          </a>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted md:mt-20">
          <a href={`mailto:${site.email}`} className="link-underline tap-target hover:text-accent">
            {site.email}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline tap-target hover:text-accent"
          >
            LinkedIn ↗
          </a>
        </div>

        <div className="overflow-hidden">
          <div
            aria-hidden
            data-footer-name
            className="outline-text display mt-16 select-none whitespace-nowrap text-center text-[12.5vw] leading-none will-change-transform md:mt-24"
          >
            Dike Uche®
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted">
          <span>© 2026 Dike Uche · designed & built by me</span>
          <Magnetic strength={0.45}>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="link-underline tap-target px-2 py-1 uppercase tracking-[0.18em]"
            >
              Back to top ↑
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
