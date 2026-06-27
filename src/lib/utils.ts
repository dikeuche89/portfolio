export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * True on touch-first devices (phones/tablets) that have no real hover/pointer.
 * Used to skip desktop-only motion (smooth scroll, pinned gallery, headline toy)
 * so phones get native, predictable scrolling.
 */
export function isTouchDevice() {
  return (
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
}
