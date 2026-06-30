"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroCanvas from "@/components/HeroCanvas";
import PhysicsHeadline from "@/components/PhysicsHeadline";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      if (prefersReducedMotion()) {
        gsap.set(fades, { autoAlpha: 1 });
        return;
      }

      // headline intro is owned by PhysicsHeadline; fade in the rest
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
          ( Dike Uche · <span className="whitespace-nowrap">UX designer</span> ×{" "}
          <span className="whitespace-nowrap">full stack builder</span> )
        </p>

        <PhysicsHeadline />

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-fade
            className="invisible max-w-md text-base leading-relaxed text-muted md:text-lg"
          >
            I&apos;ve spent eight years designing digital products, and now I
            write the code that ships them too, handling the strategy, the
            design systems, and the frontend, all the way through.
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
          className="invisible mt-10 border-t border-line pt-5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted"
        >
          Focus · Design × Code
        </div>
      </div>
    </section>
  );
}
