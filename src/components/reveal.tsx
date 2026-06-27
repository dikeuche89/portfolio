"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn, prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Fade-up reveal for any block of content. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(ref.current, { autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("invisible", className)}>
      {children}
    </div>
  );
}

/** Masked reveal for headlines — line-by-line, or char-by-char for big titles. */
export function SplitReveal({
  children,
  className,
  as: Tag = "h2",
  immediate = false,
  delay = 0,
  mode = "lines",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  immediate?: boolean;
  delay?: number;
  mode?: "lines" | "chars";
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (prefersReducedMotion()) {
        gsap.set(ref.current, { autoAlpha: 1 });
        return;
      }
      gsap.set(ref.current, { autoAlpha: 1 });
      SplitText.create(ref.current, {
        type: mode === "chars" ? "lines,chars" : "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(mode === "chars" ? self.chars : self.lines, {
            yPercent: mode === "chars" ? 130 : 115,
            rotation: mode === "chars" ? 4 : 0,
            duration: 1.25,
            stagger: mode === "chars" ? { each: 0.02, from: "start" } : 0.09,
            ease: "power4.out",
            delay,
            scrollTrigger: immediate
              ? undefined
              : { trigger: ref.current, start: "top 88%", once: true },
          }),
      });
    },
    { scope: ref }
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn("invisible", className)}>
      {children}
    </Tag>
  );
}

/** Word-by-word opacity scrub tied to scroll — for manifesto paragraphs. */
export function WordScrub({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      SplitText.create(ref.current, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            opacity: 0.12,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 78%",
              end: "top 32%",
              scrub: true,
            },
          }),
      });
    },
    { scope: ref }
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}

/** Bottom-up clip-path wipe with a scale settle — for figures and images. */
export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const img = el.querySelector("img");
      if (prefersReducedMotion()) return;

      gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
      if (img) gsap.set(img, { scale: 1.25, transformOrigin: "center center" });

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          delay,
          defaults: { duration: 1.35, ease: "power4.inOut" },
        })
        .to(el, { clipPath: "inset(0% 0% 0% 0%)" })
        .to(img, { scale: 1 }, 0);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
