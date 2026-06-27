"use client";

import { useEffect, useState } from "react";
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

  // restore saved prefs on mount
  useEffect(() => {
    const a = localStorage.getItem("pg-accent");
    const b = localStorage.getItem("pg-blueprint") === "1";
    if (a) {
      document.documentElement.style.setProperty("--color-accent", a);
      setAccent(a);
    }
    if (b) {
      document.documentElement.classList.add("blueprint");
      setBlueprint(true);
    }
  }, []);

  const pickAccent = (hex: string) => {
    document.documentElement.style.setProperty("--color-accent", hex);
    localStorage.setItem("pg-accent", hex);
    setAccent(hex);
  };

  const toggleBlueprint = () => {
    const next = !blueprint;
    document.documentElement.classList.toggle("blueprint", next);
    localStorage.setItem("pg-blueprint", next ? "1" : "0");
    setBlueprint(next);
  };

  const shake = () => window.dispatchEvent(new CustomEvent("playground:shake"));

  return (
    <>
      {/* blueprint overlay: a design grid + build notes, shown only in blueprint mode */}
      <div className="bp-overlay pointer-events-none fixed inset-0 z-[80]" aria-hidden>
        <div className="bp-grid absolute inset-0" />
        <span className="bp-note left-5 top-20 md:left-10">Next.js 16 · App Router · static</span>
        <span className="bp-note right-5 top-20 md:right-10">GSAP + Lenis · fluid type: clamp()</span>
        <span className="bp-note bottom-6 left-1/2 -translate-x-1/2">next/image · WebP</span>
        <span className="bp-note bottom-6 right-5 md:right-10">designed & built by Dike</span>
      </div>

      {/* control panel */}
      <div className="fixed bottom-4 left-4 z-[140] md:bottom-6 md:left-6">
        <div
          className={cn(
            "mb-2 origin-bottom-left overflow-hidden rounded-xl border border-line bg-bg/85 backdrop-blur transition-all duration-300",
            open ? "max-h-72 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          <div className="w-56 p-4">
            <p className="kicker mb-3">Accent</p>
            <div className="flex flex-wrap gap-2.5">
              {ACCENTS.map((a) => (
                <button
                  key={a.hex}
                  type="button"
                  title={a.name}
                  onClick={() => pickAccent(a.hex)}
                  className={cn(
                    "size-6 rounded-full transition-transform hover:scale-110",
                    accent === a.hex && "ring-2 ring-fg ring-offset-2 ring-offset-bg"
                  )}
                  style={{ background: a.hex }}
                />
              ))}
            </div>

            <p className="kicker mb-3 mt-5">Mode</p>
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-line p-1">
              <button
                type="button"
                onClick={() => blueprint && toggleBlueprint()}
                className={cn(
                  "rounded-md py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                  !blueprint ? "bg-fg text-bg" : "text-muted hover:text-fg"
                )}
              >
                Live
              </button>
              <button
                type="button"
                onClick={() => !blueprint && toggleBlueprint()}
                className={cn(
                  "rounded-md py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                  blueprint ? "bg-fg text-bg" : "text-muted hover:text-fg"
                )}
              >
                Blueprint
              </button>
            </div>

            <button
              type="button"
              onClick={shake}
              className="mt-4 w-full rounded-lg border border-line py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-fg hover:text-fg"
            >
              Knock the hero over ↓
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open playground"
          className="flex items-center gap-2 rounded-full border border-line bg-bg/85 px-3.5 py-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted backdrop-blur transition-colors hover:text-fg"
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
