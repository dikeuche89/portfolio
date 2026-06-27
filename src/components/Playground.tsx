"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { name: "Ember", hex: "#ff4d24" }, // default
  { name: "Lime", hex: "#bff23a" },
  { name: "Cyan", hex: "#3ce0d6" },
  { name: "Iris", hex: "#9b7bff" },
  { name: "Gold", hex: "#ffb13d" },
  { name: "Rose", hex: "#ff5c8a" },
];
const DEFAULT = ACCENTS[0].hex;

export default function Playground() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState(DEFAULT);
  const [blueprint, setBlueprint] = useState(false);
  const [heroDown, setHeroDown] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // set the accent token and let canvas-based bits (e.g. the hero dots) follow along
  const applyAccent = (hex: string) => {
    document.documentElement.style.setProperty("--color-accent", hex);
    window.dispatchEvent(new CustomEvent("playground:accent", { detail: { hex } }));
  };

  // restore saved prefs on mount
  useEffect(() => {
    const a = localStorage.getItem("pg-accent");
    const b = localStorage.getItem("pg-blueprint") === "1";
    if (a) {
      applyAccent(a);
      setAccent(a);
    }
    if (b) {
      document.documentElement.classList.add("blueprint");
      setBlueprint(true);
    }
  }, []);

  const pickAccent = (hex: string) => {
    applyAccent(hex);
    localStorage.setItem("pg-accent", hex);
    setAccent(hex);
  };

  const toggleBlueprint = () => {
    const next = !blueprint;
    document.documentElement.classList.toggle("blueprint", next);
    localStorage.setItem("pg-blueprint", next ? "1" : "0");
    setBlueprint(next);
  };

  // close the panel when tapping/clicking away, or on Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // keep the button label in sync with whether the hero is currently knocked over
  useEffect(() => {
    const onHero = (e: Event) =>
      setHeroDown(!!(e as CustomEvent<{ active: boolean }>).detail?.active);
    window.addEventListener("playground:hero", onHero);
    return () => window.removeEventListener("playground:hero", onHero);
  }, []);

  const shake = () => window.dispatchEvent(new CustomEvent("playground:shake"));

  return (
    <>
      {/* blueprint overlay: a design grid + build notes, shown only in blueprint mode */}
      <div className="bp-overlay pointer-events-none fixed inset-0 z-[80]" aria-hidden>
        <div className="bp-grid absolute inset-0" />
        {/* mobile: stacked down the left edge so they never collide. md+: corners. */}
        <span className="bp-note left-5 top-20 md:left-10">Next.js 16 · App Router · static</span>
        <span className="bp-note left-5 top-28 md:left-auto md:right-10 md:top-20">
          GSAP + Lenis · fluid type: clamp()
        </span>
        <span className="bp-note left-5 top-36 md:bottom-6 md:left-1/2 md:top-auto md:-translate-x-1/2">
          next/image · WebP
        </span>
        <span className="bp-note left-5 top-44 md:bottom-6 md:left-auto md:right-10 md:top-auto">
          designed &amp; built by Dike
        </span>
      </div>

      {/* control panel */}
      <div
        ref={wrapRef}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] z-[140] md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:left-[calc(1.5rem+env(safe-area-inset-left))]"
      >
        <div
          className={cn(
            "mb-2 origin-bottom-left overflow-hidden rounded-xl border border-line bg-bg/85 backdrop-blur transition-all duration-300",
            open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          <div className="w-60 p-4">
            <p className="kicker mb-2">Accent</p>
            <div className="flex flex-wrap gap-1">
              {ACCENTS.map((a) => (
                <button
                  key={a.hex}
                  type="button"
                  title={a.name}
                  aria-label={a.name}
                  onClick={() => pickAccent(a.hex)}
                  className="flex size-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                >
                  <span
                    className={cn(
                      "size-6 rounded-full",
                      accent === a.hex && "ring-2 ring-fg ring-offset-2 ring-offset-bg"
                    )}
                    style={{ background: a.hex }}
                  />
                </button>
              ))}
            </div>

            <p className="kicker mb-2 mt-4">Mode</p>
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-line p-1">
              <button
                type="button"
                onClick={() => blueprint && toggleBlueprint()}
                className={cn(
                  "rounded-md py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                  !blueprint ? "bg-fg text-bg" : "text-muted hover:text-fg"
                )}
              >
                Live
              </button>
              <button
                type="button"
                onClick={() => !blueprint && toggleBlueprint()}
                className={cn(
                  "rounded-md py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                  blueprint ? "bg-fg text-bg" : "text-muted hover:text-fg"
                )}
              >
                Blueprint
              </button>
            </div>

            <button
              type="button"
              onClick={shake}
              className="mt-3 w-full rounded-lg border border-line py-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-fg hover:text-fg"
            >
              {heroDown ? "Reset the hero ↑" : "Knock the hero over ↓"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open playground"
          className="flex items-center gap-2 rounded-full border border-line bg-bg/85 px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted backdrop-blur transition-colors hover:text-fg"
        >
          <span
            className="size-2.5 rounded-full transition-transform"
            style={{ background: accent, transform: open ? "scale(1.3)" : "scale(1)" }}
          />
          Playground
        </button>
      </div>
    </>
  );
}
