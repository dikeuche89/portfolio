"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WorkGallery({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(true);

  useGSAP(
    () => {
      const trackEl = track.current;
      if (!trackEl) return;
      if (prefersReducedMotion()) {
        setAnimated(false);
        return;
      }
      setAnimated(true);

      const amount = () => trackEl.scrollWidth - window.innerWidth;
      const tween = gsap.to(trackEl, { x: () => -amount(), ease: "none" });

      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: () => `+=${amount()}`,
        pin: true,
        scrub: 1,
        animation: tween,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="work"
      className={
        animated
          ? "relative h-svh overflow-hidden"
          : "relative px-5 py-20 md:px-10"
      }
    >
      <div
        ref={track}
        className={
          animated
            ? "flex h-full items-center gap-5 px-5 will-change-transform md:gap-8 md:px-10"
            : "flex flex-col gap-12"
        }
      >
        {/* lead panel */}
        <div
          className={
            animated
              ? "flex h-full w-[80vw] shrink-0 flex-col justify-center md:w-[32rem]"
              : "flex flex-col"
          }
        >
          <p className="kicker mb-5">( 01 — Selected work )</p>
          <h2 className="display text-[clamp(2.5rem,6vw,4.75rem)]">
            Selected
            <br />
            <span className="serif-italic">work</span>
            <span className="accent">.</span>
          </h2>
          <p className="kicker mt-7">
            {animated && (
              <>
                Scroll to explore →
                <br />
              </>
            )}
            2020 — 2026
          </p>
        </div>

        {/* project panels */}
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            data-cursor
            className={
              animated
                ? "group relative flex h-[72vh] w-[82vw] shrink-0 flex-col justify-end overflow-hidden md:h-[70vh] md:w-[34rem]"
                : "group relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden"
            }
          >
            <Image
              src={p.hero.src}
              alt={p.hero.alt}
              fill
              sizes="(min-width: 768px) 34rem, 82vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: `linear-gradient(to top, ${p.accent}40, transparent 60%)` }}
            />
            <div className="relative p-6 md:p-7">
              <span className="kicker accent">0{i + 1}</span>
              <h3 className="display mt-2 text-[clamp(2rem,4.5vw,3.25rem)]">
                {p.title}
              </h3>
              <p className="kicker mt-2 flex items-center justify-between normal-case tracking-[0.08em]">
                <span>
                  {p.type} — {p.year}
                </span>
                <span className="text-lg transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent">
                  ↗
                </span>
              </p>
            </div>
          </Link>
        ))}

        {/* closing panel */}
        <div
          className={
            animated
              ? "flex h-full w-[60vw] shrink-0 flex-col justify-center md:w-[20rem]"
              : "flex flex-col"
          }
        >
          <p className="kicker mb-5">( Next )</p>
          <Link href="/about" className="group block" data-cursor>
            <span className="display text-[clamp(2rem,5vw,3.5rem)] transition-colors duration-500 group-hover:text-accent">
              About me
              <span className="accent inline-block transition-transform duration-500 group-hover:translate-x-2">
                ↗
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
