"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SRC = "/images/me-portrait.webp";
const TEX_W = 584;
const TEX_H = 1600;

/**
 * Still cutout with the site's signature reveal: a bottom-up clip-path wipe
 * with a scale settle on enter, a gentle scroll-parallax drift, and a subtle
 * (≤3°) tilt toward the cursor. No WebGL.
 */
export default function Portrait({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null); // parallax drift + tilt
  const clip = useRef<HTMLDivElement>(null); // clip-path wipe
  const img = useRef<HTMLDivElement>(null); // scale settle

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(clip.current, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      // 1) signature bottom-up clip wipe + scale settle on enter
      gsap.set(clip.current, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(img.current, { scale: 1.08 });
      gsap
        .timeline({
          scrollTrigger: { trigger: wrap.current, start: "top 80%", once: true },
          defaults: { ease: "power4.inOut" },
        })
        .to(clip.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 })
        .to(img.current, { scale: 1, duration: 1.6 }, 0);

      // 2) gentle scroll-parallax drift — the figure floats as you scroll
      gsap.fromTo(
        inner.current,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 3) subtle cursor tilt (≤3°), desktop only
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const rotX = gsap.quickTo(inner.current, "rotationX", { duration: 0.6, ease: "power3" });
        const rotY = gsap.quickTo(inner.current, "rotationY", { duration: 0.6, ease: "power3" });
        const clamp = gsap.utils.clamp(-3, 3);
        const onMove = (e: MouseEvent) => {
          const r = wrap.current!.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          rotY(clamp(dx * 3));
          rotX(clamp(-dy * 3));
        };
        const onLeave = () => {
          rotX(0);
          rotY(0);
        };
        window.addEventListener("mousemove", onMove);
        wrap.current?.addEventListener("mouseleave", onLeave);
        return () => {
          window.removeEventListener("mousemove", onMove);
          wrap.current?.removeEventListener("mouseleave", onLeave);
        };
      }
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} className={cn("relative [perspective:1100px]", className)}>
      {/* accent glow behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[90px]"
        style={{ background: "radial-gradient(circle, #ff4d24 0%, transparent 70%)" }}
      />
      {/* soft contact shadow grounding the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[14%] bottom-[3%] h-[8%] rounded-[50%] bg-black/70 blur-2xl"
      />
      <div
        ref={inner}
        className="absolute inset-0 [transform-style:preserve-3d] will-change-transform"
      >
        <div ref={clip} className="absolute inset-0 overflow-hidden">
          <div ref={img} className="absolute inset-0 will-change-transform">
            <Image
              src={SRC}
              alt="Portrait of Dike Uche"
              width={TEX_W}
              height={TEX_H}
              priority
              className="absolute inset-0 m-auto h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
