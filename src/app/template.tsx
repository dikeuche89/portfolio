"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

// module-scoped: true after the very first mount, so the first page load keeps
// its pristine hero intro and only client-side navigations get the full wipe.
let visited = false;

function labelFor(path: string) {
  if (path === "/") return "Dike Uche";
  const seg = path.split("/").filter(Boolean).pop() || "";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Template({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const firstLoad = !visited;
    visited = true;

    if (prefersReducedMotion()) {
      gsap.set(overlay.current, { display: "none" });
      return;
    }

    if (firstLoad) {
      // gentle reveal — don't cover the hero's own entrance
      gsap.set(overlay.current, { display: "none" });
      gsap.fromTo(
        content.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );
      return;
    }

    // navigation: cinematic wipe with the route label
    gsap
      .timeline()
      .set(content.current, { autoAlpha: 0 })
      .fromTo(
        label.current,
        { yPercent: 60, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }
      )
      .to(
        label.current,
        { yPercent: -60, autoAlpha: 0, duration: 0.45, ease: "power3.in" },
        "+=0.12"
      )
      .to(
        overlay.current,
        { yPercent: -100, duration: 0.75, ease: "power4.inOut" },
        "-=0.12"
      )
      .set(content.current, { autoAlpha: 1 }, "-=0.55")
      .fromTo(
        content.current,
        { y: 18 },
        { y: 0, duration: 0.6, ease: "power2.out", clearProps: "all" },
        "<"
      )
      .set(overlay.current, { display: "none" });
  });

  return (
    <>
      <div
        ref={overlay}
        aria-hidden
        className="fixed inset-0 z-[300] flex items-center justify-center bg-accent"
      >
        <div
          ref={label}
          className="display text-[clamp(2.5rem,8vw,6rem)] text-bg"
        >
          {labelFor(pathname)}
          <span>.</span>
        </div>
      </div>
      <div ref={content}>{children}</div>
    </>
  );
}
