"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (prefersReducedMotion()) return;

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.25 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as Element | null)?.closest?.(
        "a, button, [data-cursor]"
      );
      gsap.to(ring.current, {
        scale: interactive ? 2.4 : 1,
        opacity: interactive ? 0.55 : 1,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden [@media(pointer:fine)]:block" aria-hidden>
      <div
        ref={dot}
        className="invisible absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-accent"
      />
      <div
        ref={ring}
        className="invisible absolute left-0 top-0 -ml-4 -mt-4 size-8 rounded-full border border-fg/60 mix-blend-difference"
      />
    </div>
  );
}
