"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { testimonials } from "@/data/testimonials";
import { cn, prefersReducedMotion } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count]
  );

  // autoplay, restarted whenever the slide or pause state changes. Skipped
  // entirely for visitors who prefer reduced motion.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, active, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  // touch swipe (ignore the mouse so desktop drags don't jump slides)
  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      className="px-5 pt-28 md:px-10 md:pt-44"
      aria-roledescription="carousel"
      aria-label="Testimonials"
    >
      {/* header: kicker + pill indicators */}
      <div className="flex items-center justify-between gap-6">
        <Reveal>
          <p className="kicker">( 05 · Word on the street )</p>
        </Reveal>
        <div
          role="tablist"
          aria-label="Select testimonial"
          className="flex items-center gap-1.5"
        >
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show testimonial from ${t.name}`}
              onClick={() => setActive(i)}
              className="group flex h-6 items-center"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-all duration-500",
                  i === active
                    ? "w-8 bg-accent"
                    : "w-4 bg-line group-hover:bg-muted"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* slides: crossfade stack — every slide shares one grid cell, so the
          section is always as tall as the longest quote (no layout jump) */}
      <div
        tabIndex={0}
        role="group"
        aria-live="polite"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="mt-10 grid touch-pan-y rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-line md:mt-14"
      >
        {testimonials.map((t, i) => {
          const isActive = i === active;
          return (
            <figure
              key={t.name}
              aria-hidden={!isActive}
              style={{ gridArea: "1 / 1" }}
              className={cn(
                "transition-[opacity,transform] duration-700 ease-out",
                isActive
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none translate-y-2 opacity-0"
              )}
            >
              <blockquote className="serif-italic max-w-5xl text-[clamp(1.5rem,3.6vw,3rem)] leading-[1.2]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="kicker mt-10">
                {t.name}, {t.title} at {t.company}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* prev / next + position counter */}
      <div className="mt-12 flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Chevron className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Chevron className="size-4 rotate-180" />
        </button>
        <span className="kicker ml-1 tabular-nums">
          {String(active + 1).padStart(2, "0")}{" "}
          <span className="text-line">/</span>{" "}
          {String(count).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
