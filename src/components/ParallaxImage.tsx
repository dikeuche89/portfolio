"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ParallaxImage({
  src,
  width,
  height,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  amount = 7,
  clipReveal = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  amount?: number;
  clipReveal?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        inner.current,
        { yPercent: -amount, scale: 1 + amount / 40 },
        {
          yPercent: amount,
          scale: 1 + amount / 40,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      if (clipReveal) {
        gsap.fromTo(
          wrap.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.35,
            ease: "power4.inOut",
            scrollTrigger: { trigger: wrap.current, start: "top 88%", once: true },
          }
        );
      }
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} className={cn("overflow-hidden", className)}>
      <div ref={inner} className="will-change-transform">
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
