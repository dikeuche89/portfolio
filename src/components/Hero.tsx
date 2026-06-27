"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import HeroCanvas from "@/components/HeroCanvas";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      if (prefersReducedMotion()) {
        gsap.set(["[data-hero-line]", fades], { autoAlpha: 1 });
        return;
      }

      // character-level masked intro
      gsap.set("[data-hero-line]", { autoAlpha: 1 });
      SplitText.create("[data-hero-line]", {
        type: "lines,chars",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 130,
            rotation: 4,
            duration: 1.2,
            stagger: { each: 0.025, from: "start" },
            delay: 0.2,
            ease: "power4.out",
          }),
      });

      gsap.fromTo(
        fades,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          delay: 0.9,
          ease: "power3.out",
        }
      );

      // hero recedes as you scroll past it
      gsap.to(inner.current, {
        yPercent: -12,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "85% top",
          scrub: true,
        },
      });

      // scroll cue idles
      gsap.to("[data-hero-arrow]", {
        y: 7,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut",
        delay: 2,
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-svh flex-col justify-center px-5 py-28 md:px-10"
    >
      <HeroCanvas />
      <div
        ref={inner}
        className="relative flex flex-col justify-center will-change-transform"
      >
        <p data-hero-fade className="kicker invisible mb-7">
          ( Dike Uche · UX designer × full stack builder )
        </p>

        <h1
          className="display invisible text-[clamp(3.25rem,12.5vw,12.5rem)]"
          data-hero-line
        >
          Design<span className="accent">,</span>
          <br />
          <span className="serif-italic">
            engineered<span className="accent">.</span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-fade
            className="invisible max-w-md text-base leading-relaxed text-muted md:text-lg"
          >
            Eight years of designing digital products. Now I write the code that
            ships them too. The strategy, the design systems, the frontend, all
            the way through.
          </p>
          <p data-hero-fade className="kicker invisible md:text-right">
            Scroll
            <br />
            <span data-hero-arrow className="inline-block">
              ↓
            </span>
          </p>
        </div>

        <div
          data-hero-fade
          className="invisible mt-10 grid grid-cols-2 gap-4 border-t border-line pt-5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted md:grid-cols-4"
        >
          <span>Based · Remote</span>
          <span>Currently · Cofounder @ Kiphar</span>
          <span className="hidden md:block">Focus · Design × Code</span>
          <span className="flex items-center justify-end gap-2 text-right">
            <span className="pulse-dot" aria-hidden />
            Open to work
          </span>
        </div>
      </div>
    </section>
  );
}
