"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { name: "Ember", hex: "#ff4d24" },
  { name: "Lime", hex: "#bff23a" },
  { name: "Cyan", hex: "#3ce0d6" },
  { name: "Iris", hex: "#9b7bff" },
  { name: "Gold", hex: "#ffb13d" },
  { name: "Rose", hex: "#ff5c8a" },
];
const DEFAULT = ACCENTS[0].hex;
const PREFERENCES_EVENT = "playground:preferences";
let currentAccent: string | undefined;

function subscribePreferences(notify: () => void) {
  const onStorage = () => {
    currentAccent = undefined;
    notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(PREFERENCES_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PREFERENCES_EVENT, notify);
  };
}

function readAccent() {
  try {
    if (currentAccent) return currentAccent;
    const saved = localStorage.getItem("pg-accent");
    return (
      ACCENTS.find((accent) => accent.hex === saved)?.hex ??
      currentAccent ??
      DEFAULT
    );
  } catch {
    return currentAccent ?? DEFAULT;
  }
}

export default function Appearance() {
  const [open, setOpen] = useState(false);
  const accent = useSyncExternalStore(
    subscribePreferences,
    readAccent,
    () => DEFAULT,
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--color-accent", accent);
    window.dispatchEvent(
      new CustomEvent("playground:accent", { detail: { hex: accent } }),
    );
  }, [accent]);

  // Retire the old overlay for visitors with a saved Blueprint preference.
  useEffect(() => {
    document.documentElement.classList.remove("blueprint");
    try {
      localStorage.removeItem("pg-blueprint");
    } catch {
      /* Appearance still works without storage. */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    wrapRef.current
      ?.querySelector<HTMLButtonElement>("#appearance-controls button")
      ?.focus({ preventScroll: true });
    const onDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node))
        setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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

  return (
    <div ref={wrapRef} className="relative z-[140]">
      <div
        id="appearance-controls"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "absolute bottom-full left-0 mb-2 origin-bottom-left overflow-hidden rounded-xl border border-line bg-bg shadow-2xl transition-all duration-200 md:left-auto md:right-0",
          open
            ? "max-h-60 opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <div className="w-60 p-4">
          <p className="kicker mb-2">Site accent</p>
          <div className="flex flex-wrap gap-1">
            {ACCENTS.map((choice) => (
              <button
                key={choice.hex}
                type="button"
                aria-label={choice.name}
                aria-pressed={accent === choice.hex}
                onClick={() => {
                  currentAccent = choice.hex;
                  try {
                    localStorage.setItem("pg-accent", choice.hex);
                  } catch {
                    /* Keep the selection for this visit. */
                  }
                  window.dispatchEvent(new Event(PREFERENCES_EVENT));
                }}
                className="flex size-11 items-center justify-center rounded-full"
              >
                <span
                  className={cn(
                    "size-6 rounded-full",
                    accent === choice.hex &&
                      "ring-2 ring-fg ring-offset-2 ring-offset-bg",
                  )}
                  style={{ background: choice.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close appearance" : "Open appearance"}
        aria-expanded={open}
        aria-controls="appearance-controls"
        className="flex min-h-11 items-center gap-2 text-xs text-muted transition-colors hover:text-fg"
      >
        <span
          className="size-2 rounded-full"
          style={{ background: accent }}
          aria-hidden="true"
        />
        Appearance
      </button>
    </div>
  );
}
