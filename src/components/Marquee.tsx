"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Infinite marquee that speeds up and skews with scroll velocity. */
export default function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !track.current) return;

      const tween = gsap.to(track.current, {
        xPercent: -50,
        duration: 36,
        ease: "none",
        repeat: -1,
      });

      const proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(track.current, "skewX", "deg");
      const clampSkew = gsap.utils.clamp(-5, 5);
      const clampBoost = gsap.utils.clamp(1, 5);

      const st = ScrollTrigger.create({
        onUpdate(self) {
          const v = self.getVelocity();
          // skew kicks in on fast scroll, then relaxes back to 0
          const skew = clampSkew(v / -300);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.7,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
          // marquee surges with scroll speed, settles back to cruise
          gsap.to(tween, {
            timeScale: clampBoost(Math.abs(v) / 250),
            duration: 0.4,
            overwrite: "auto",
          });
        },
      });

      return () => {
        st.kill();
        tween.kill();
      };
    },
    { scope: wrap }
  );

  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="display px-6 text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-muted/80 md:px-10">
            {item}
          </span>
          <span className="text-accent/70">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={wrap}
      className={cn(
        "flex w-full overflow-hidden border-y border-line py-5 md:py-6",
        className
      )}
    >
      <div ref={track} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
