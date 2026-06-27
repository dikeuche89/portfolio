"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export default function WorkList({ projects }: { projects: Project[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const moveX = useRef<((v: number) => void) | null>(null);
  const moveY = useRef<((v: number) => void) | null>(null);
  const lastX = useRef<number | null>(null);
  const tiltProxy = useRef({ rot: 0 });
  const [active, setActive] = useState(-1);
  const fine = useRef(false);

  useGSAP(
    () => {
      fine.current =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !prefersReducedMotion();
      if (!fine.current || !preview.current) return;
      gsap.set(preview.current, { xPercent: 8, yPercent: -50, scale: 0, opacity: 0 });
      moveX.current = gsap.quickTo(preview.current, "x", { duration: 0.55, ease: "power3" });
      moveY.current = gsap.quickTo(preview.current, "y", { duration: 0.55, ease: "power3" });
    },
    { scope }
  );

  // preview tilts with cursor velocity, then settles upright
  const tilt = (clientX: number) => {
    if (!fine.current || !preview.current) return;
    const dx = lastX.current === null ? 0 : clientX - lastX.current;
    lastX.current = clientX;
    const rot = gsap.utils.clamp(-9, 9, dx * 0.45);
    if (Math.abs(rot) > Math.abs(tiltProxy.current.rot)) {
      tiltProxy.current.rot = rot;
      gsap.to(tiltProxy.current, {
        rot: 0,
        duration: 0.75,
        ease: "power3",
        overwrite: true,
        onUpdate: () =>
          gsap.set(preview.current, { rotation: tiltProxy.current.rot }),
      });
    }
  };

  useGSAP(
    () => {
      if (!fine.current || !preview.current) return;
      gsap.to(preview.current, {
        scale: active >= 0 ? 1 : 0,
        opacity: active >= 0 ? 1 : 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    { dependencies: [active], scope }
  );

  return (
    <div
      ref={scope}
      onMouseMove={(e) => {
        moveX.current?.(e.clientX);
        moveY.current?.(e.clientY);
        tilt(e.clientX);
      }}
      onMouseLeave={() => {
        setActive(-1);
        lastX.current = null;
      }}
    >
      <div className="work-list border-b border-line">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="work-row group block border-t border-line py-7 md:py-8"
            onMouseEnter={(e) => {
              // first entry: appear at the cursor instead of flying in from 0,0
              if (active === -1 && fine.current && preview.current) {
                gsap.set(preview.current, { x: e.clientX, y: e.clientY });
                lastX.current = e.clientX;
              }
              setActive(i);
            }}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(-1)}
          >
            <div className="relative mb-5 aspect-[3/2] w-full overflow-hidden md:hidden">
              <Image
                src={p.hero.src}
                alt={p.hero.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 md:grid-cols-[4rem_1fr_auto_3rem] md:items-center px-0">
              <span className="kicker accent">0{i + 1}</span>
              <h3 className="display text-[clamp(1.85rem,5vw,4.25rem)] font-bold transition-transform duration-500 ease-out group-hover:translate-x-3">
                {p.title}
              </h3>
              <span className="kicker text-right leading-relaxed">
                {p.type}
                <br className="hidden md:block" />
                <span className="hidden md:inline">{p.year}</span>
              </span>
              <span
                className="hidden text-right text-xl text-muted transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent md:block"
                aria-hidden
              >
                ↗
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* cursor-following preview, desktop only */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden w-[26rem] overflow-hidden md:block"
      >
        {projects.map((p, i) => (
          <Image
            key={p.slug}
            src={p.hero.src}
            alt=""
            width={p.hero.width}
            height={p.hero.height}
            sizes="416px"
            className={`h-auto w-full transition-opacity duration-300 ${
              i === active ? "opacity-100" : "opacity-0"
            } ${i > 0 ? "absolute inset-0" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
