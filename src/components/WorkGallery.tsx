"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { cn, isTouchDevice, prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WorkGallery({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  // Pointer devices get the index list: every project readable at a glance and
  // the page scrolls the way the gesture says it will. Touch keeps the card
  // stack, where a cursor preview has nothing to hang off.
  const [index, setIndex] = useState(true);
  const [follow, setFollow] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      if (isTouchDevice()) {
        setIndex(false);
        return;
      }
      setIndex(true);

      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      if (prefersReducedMotion()) {
        gsap.set(rows, { visibility: "inherit" });
        return;
      }
      setFollow(true);

      // .work-row carries a CSS opacity transition for the hover dimming, which
      // would smear every frame of the reveal. Suspend it for the entrance.
      gsap.set(rows, { transition: "none" });

      gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: list.current, start: "top 85%", once: true },
          // autoAlpha leaves an inline opacity behind, which would outrank the
          // .work-list:hover dimming rule. Drop it once the rows have landed,
          // along with the transition lock, and keep the inline visibility that
          // overrides the `invisible` class.
          onComplete: () => gsap.set(rows, { clearProps: "opacity,transition" }),
        }
      );
    },
    { scope: section }
  );

  // the preview only mounts once `follow` is on, so wire it up after that lands
  useEffect(() => {
    const el = preview.current;
    if (!follow || !el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    // place it under the cursor before the first fade-in so it doesn't sweep
    // in from the top-left corner
    let placed = false;
    const onMove = (e: PointerEvent) => {
      if (!placed) {
        placed = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        return;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [follow]);

  return (
    <section
      ref={section}
      id="work"
      className="relative scroll-mt-20 px-5 pt-28 md:px-10 md:pt-44"
    >
      <p className="kicker mb-5">( 01 · Selected work )</p>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-[clamp(2.5rem,6vw,4.75rem)]">
          Selected <span className="serif-italic">work</span>
          <span className="accent">.</span>
        </h2>
        <p className="kicker pb-2">2020 to 2026</p>
      </div>

      {index ? (
        <>
          <div
            ref={list}
            className="work-list mt-14 border-t border-line md:mt-20"
            onPointerLeave={() => setActive(null)}
          >
            {projects.map((p, i) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                data-row
                data-cursor
                onPointerEnter={() => follow && setActive(i)}
                onFocus={() => setActive(null)}
                className="work-row group invisible flex items-baseline gap-5 border-b border-line py-7 md:gap-8 md:py-9"
              >
                <span className="kicker accent shrink-0">0{i + 1}</span>
                <h3 className="display flex-1 text-[clamp(1.75rem,5vw,4rem)] transition-transform duration-500 ease-out group-hover:translate-x-2 md:group-hover:translate-x-4">
                  {p.title}
                </h3>
                <span className="kicker hidden shrink-0 normal-case tracking-[0.08em] lg:block">
                  {p.type}
                </span>
                <span className="kicker hidden w-36 shrink-0 text-right md:block">
                  {p.year}
                </span>
                <span className="shrink-0 text-lg transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent">
                  ↗
                </span>
              </Link>
            ))}
          </div>

          {follow && (
            <div
              ref={preview}
              aria-hidden
              className="pointer-events-none fixed left-0 top-0 z-40"
            >
              <div className="relative h-[14rem] w-[19rem] -translate-x-1/2 -translate-y-1/2">
                {projects.map((p, i) => (
                  <div
                    key={p.slug}
                    className={cn(
                      "absolute inset-0 overflow-hidden transition-[opacity,transform] duration-500 ease-out",
                      active === i
                        ? "scale-100 opacity-100"
                        : "scale-90 opacity-0"
                    )}
                  >
                    <Image
                      src={p.hero.src}
                      alt=""
                      fill
                      sizes="19rem"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${p.accent}55, transparent 65%)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-14 flex flex-col gap-12">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor
              className="group relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden"
            >
              <Image
                src={p.hero.src}
                alt={p.hero.alt}
                fill
                preload={i === 0}
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
              <div className="relative p-6 md:p-7">
                <span className="kicker accent">0{i + 1}</span>
                <h3 className="display mt-2 text-[clamp(2rem,4.5vw,3.25rem)]">
                  {p.title}
                </h3>
                <p className="kicker mt-2 flex items-center justify-between normal-case tracking-[0.08em]">
                  <span>
                    {p.type} · {p.year}
                  </span>
                  <span className="text-lg">↗</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link href="/about" className="group mt-14 inline-block md:mt-20" data-cursor>
        <span className="kicker mb-3 block">( Next )</span>
        <span className="display text-[clamp(2rem,5vw,3.5rem)] transition-colors duration-500 group-hover:text-accent">
          About me
          <span className="accent inline-block transition-transform duration-500 group-hover:translate-x-2">
            ↗
          </span>
        </span>
      </Link>
    </section>
  );
}
