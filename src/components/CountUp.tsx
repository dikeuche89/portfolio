"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NUM = /(\d+\.?\d*)/;

/**
 * Animates every numeric run inside `children` from 0 to its value when the
 * element scrolls into view, preserving all surrounding text. Handles ranges
 * ("21→46%"), currency ("$170.50"), ordinals ("12th→4th"), units ("2.1m→38s").
 * SSR / reduced-motion render the final value statically.
 */
export default function CountUp({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const tokens = children.split(NUM);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const spans = gsap.utils.toArray<HTMLElement>("[data-num]", el);
      if (!spans.length) return;

      // start at zero, then count up once in view
      spans.forEach((s) => {
        const dec = (s.dataset.num!.split(".")[1] || "").length;
        s.textContent = (0).toFixed(dec);
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          spans.forEach((s) => {
            const target = parseFloat(s.dataset.num!);
            const dec = (s.dataset.num!.split(".")[1] || "").length;
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                s.textContent = obj.v.toFixed(dec);
              },
            });
          }),
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref}>
      {tokens.map((tok, i) =>
        NUM.test(tok) && tok !== "" ? (
          <span key={i} data-num={tok}>
            {tok}
          </span>
        ) : (
          <span key={i}>{tok}</span>
        )
      )}
    </span>
  );
}
