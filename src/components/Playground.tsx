"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
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
const PREFERENCES_EVENT = "playground:preferences";

function subscribePreferences(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(PREFERENCES_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(PREFERENCES_EVENT, notify);
  };
}

function readAccent() {
  const saved = localStorage.getItem("pg-accent");
  return ACCENTS.find((accent) => accent.hex === saved)?.hex ?? DEFAULT;
}

function readBlueprint() {
  return localStorage.getItem("pg-blueprint") === "1";
}

export default function Playground() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const accent = useSyncExternalStore(
    subscribePreferences,
    readAccent,
    () => DEFAULT,
  );
  const blueprint = useSyncExternalStore(
    subscribePreferences,
    readBlueprint,
    () => false,
  );
  const [heroInspect, setHeroInspect] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      wrapRef.current
        ?.querySelector<HTMLButtonElement>("#playground-controls button")
        ?.focus({ preventScroll: true });
    }
  }, [open]);

  // Synchronize the document with saved preferences after hydration.
  useEffect(() => {
    document.documentElement.style.setProperty("--color-accent", accent);
    window.dispatchEvent(
      new CustomEvent("playground:accent", { detail: { hex: accent } }),
    );
  }, [accent]);

  useEffect(() => {
    document.documentElement.classList.toggle("blueprint", blueprint);
  }, [blueprint]);

  const pickAccent = (hex: string) => {
    localStorage.setItem("pg-accent", hex);
    window.dispatchEvent(new Event(PREFERENCES_EVENT));
  };

  const toggleBlueprint = () => {
    const next = !blueprint;
    localStorage.setItem("pg-blueprint", next ? "1" : "0");
    window.dispatchEvent(new Event(PREFERENCES_EVENT));
  };

  // close the panel when tapping/clicking away, or on Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep the control in sync with the homepage's layer inspector.
  useEffect(() => {
    const onHero = (e: Event) =>
      setHeroInspect(!!(e as CustomEvent<{ active: boolean }>).detail?.active);
    window.addEventListener("playground:hero", onHero);
    return () => window.removeEventListener("playground:hero", onHero);
  }, []);

  const inspectHero = () => {
    window.dispatchEvent(new CustomEvent("playground:inspect"));
    setOpen(false);
    document.getElementById("hero")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <>
      {/* blueprint overlay: a design grid + build notes, shown only in blueprint mode */}
      <div
        className="bp-overlay pointer-events-none fixed inset-0 z-[80]"
        aria-hidden
      >
        <div className="bp-grid absolute inset-0" />
        {/* mobile: stacked down the left edge so they never collide. md+: corners. */}
        <span className="bp-note left-5 top-20 md:left-10">
          Next.js 16 · App Router · static
        </span>
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
      <div ref={wrapRef} className="relative z-[140]">
        <div
          id="playground-controls"
          inert={!open}
          aria-hidden={!open}
          className={cn(
            "absolute bottom-full left-0 mb-2 origin-bottom-left overflow-hidden rounded-xl border border-line bg-bg shadow-2xl transition-all duration-300 md:left-auto md:right-0",
            open
              ? "max-h-96 opacity-100"
              : "pointer-events-none max-h-0 opacity-0",
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
                  aria-pressed={accent === a.hex}
                  onClick={() => pickAccent(a.hex)}
                  className="flex size-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                >
                  <span
                    className={cn(
                      "size-6 rounded-full",
                      accent === a.hex &&
                        "ring-2 ring-fg ring-offset-2 ring-offset-bg",
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
                aria-pressed={!blueprint}
                onClick={() => blueprint && toggleBlueprint()}
                className={cn(
                  "rounded-md py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                  !blueprint ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                Live
              </button>
              <button
                type="button"
                aria-pressed={blueprint}
                onClick={() => !blueprint && toggleBlueprint()}
                className={cn(
                  "rounded-md py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                  blueprint ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                Blueprint
              </button>
            </div>

            {pathname === "/" && (
              <button
                type="button"
                onClick={inspectHero}
                className="mt-3 w-full rounded-lg border border-line py-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-fg hover:text-fg"
              >
                {heroInspect ? "Close hero inspection" : "Inspect hero layers"}
              </button>
            )}
          </div>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close playground" : "Open playground"}
          aria-expanded={open}
          aria-controls="playground-controls"
          className="flex min-h-11 items-center gap-2 text-xs text-muted transition-colors hover:text-fg"
        >
          <span
            className="size-2.5 rounded-full transition-transform"
            style={{
              background: accent,
              transform: open ? "scale(1.3)" : "scale(1)",
            }}
          />
          Playground
        </button>
      </div>
    </>
  );
}
