"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OPEN_EVENT = "ask-dike:open";

// The panel pulls in the AI SDK, by far the largest script on the site, so it
// is only downloaded once someone actually asks for the chat.
const AskDikePanel = dynamic(() => import("@/components/AskDikePanel"), {
  ssr: false,
  loading: () => (
    <p
      role="status"
      className="fixed bottom-6 right-6 z-[160] rounded-full border border-line bg-bg px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted"
    >
      Opening chat…
    </p>
  ),
});

export function AskDikeTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={(event) =>
        window.dispatchEvent(
          new CustomEvent(OPEN_EVENT, { detail: event.currentTarget }),
        )
      }
    >
      Ask Dike <span aria-hidden="true">↗</span>
    </button>
  );
}

/** Mounted once in the root layout; renders nothing until the chat is asked for. */
export default function AskDike() {
  // undefined: never requested. Otherwise the control that asked first, so the
  // panel can hand focus back to it on close.
  const [openedBy, setOpenedBy] = useState<HTMLElement | null>();
  const requested = openedBy !== undefined;

  useEffect(() => {
    // once the panel is mounted it listens for later requests itself
    if (requested) return;
    const onOpen = (event: Event) => {
      const trigger = (event as CustomEvent<unknown>).detail;
      setOpenedBy(trigger instanceof HTMLElement ? trigger : null);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [requested]);

  return requested ? <AskDikePanel openedBy={openedBy} /> : null;
}
