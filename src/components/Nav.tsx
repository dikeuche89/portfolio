"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/projects";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[150] border-b transition-colors duration-500",
        scrolled
          ? "border-line bg-bg/70 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <nav
        className={cn(
          "flex items-center justify-between px-5 text-fg transition-all duration-500 md:px-10",
          scrolled ? "py-3.5 md:py-4" : "py-5 md:py-6"
        )}
      >
        <Link
          href="/"
          className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em]"
        >
          Dike Uche<span className="align-super text-[0.55rem]">©</span>
        </Link>
        <div className="flex items-center gap-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] md:gap-8">
          <Link href="/#work" className="link-underline">
            Work
          </Link>
          <Link href="/about" className="link-underline">
            About
          </Link>
          <a href={`mailto:${site.email}`} className="link-underline">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
