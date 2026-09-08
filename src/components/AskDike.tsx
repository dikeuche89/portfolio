"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { cn } from "@/lib/utils";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTIONS = [
  "What does Dike do?",
  "Tell me about the Tipico work",
  "What's his tech stack?",
  "Can he build something for me?",
];

export function AskDikeTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-controls="ask-dike-panel"
      onClick={(event) =>
        window.dispatchEvent(
          new CustomEvent("ask-dike:open", { detail: event.currentTarget }),
        )
      }
    >
      Ask Dike <span aria-hidden="true">↗</span>
    </button>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.25l1.75 6 6 1.75-6 1.75L12 17.75l-1.75-6-6-1.75 6-1.75L12 2.25z" />
      <path d="M19 13.5l.9 2.85 2.85.9-2.85.9L19 21l-.9-2.85L15.25 17.25l2.85-.9L19 13.5z" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function AskDike() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [vv, setVv] = useState<{ h: number; top: number } | null>(null);
  const { messages, sendMessage, status, error } = useChat({ transport });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const busy = status === "submitted" || status === "streaming";

  const closeChat = () => {
    setOpen(false);
    returnFocus.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const onOpen = (event: Event) => {
      const trigger = (event as CustomEvent<HTMLElement>).detail;
      returnFocus.current = trigger instanceof HTMLElement ? trigger : null;
      setOpen(true);
    };
    window.addEventListener("ask-dike:open", onOpen);
    return () => window.removeEventListener("ask-dike:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        returnFocus.current?.focus({ preventScroll: true });
      }
      if (event.key === "Tab" && isMobile) {
        const controls = panelRef.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input:not(:disabled), a[href]",
        );
        const first = controls?.[0];
        const last = controls?.[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, isMobile]);

  // track the breakpoint (mobile = full-screen sheet, desktop = floating panel)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // track the visual viewport so the full-screen sheet sizes to the area above
  // the on-screen keyboard (keeping the input visible)
  useEffect(() => {
    const v = window.visualViewport;
    if (!v) return;
    const update = () => setVv({ h: v.height, top: v.offsetTop });
    update();
    v.addEventListener("resize", update);
    v.addEventListener("scroll", update);
    return () => {
      v.removeEventListener("resize", update);
      v.removeEventListener("scroll", update);
    };
  }, []);

  // desktop: focus the field on open. On mobile we let the visitor read the
  // suggestions first instead of slamming the keyboard up.
  useEffect(() => {
    if (!open) return;
    if (isMobile) closeRef.current?.focus({ preventScroll: true });
    else inputRef.current?.focus({ preventScroll: true });
  }, [open, isMobile]);

  // lock background scroll while the full-screen sheet is open
  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  // keep the latest message in view as it streams in
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  };

  // on mobile, size the sheet to the visible viewport (above the keyboard)
  const panelStyle =
    open && isMobile && vv
      ? { height: `${vv.h}px`, top: `${vv.top}px` }
      : undefined;

  return (
    <>
      {/* panel: full-screen opaque sheet on mobile, floating card on desktop */}
      <div
        id="ask-dike-panel"
        ref={panelRef}
        role="dialog"
        aria-label="Ask about Dike"
        aria-modal={open && isMobile ? true : undefined}
        inert={!open}
        style={panelStyle}
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 top-0 z-[160] flex h-[100svh] flex-col bg-bg transition-[opacity,transform] duration-300",
          "md:inset-auto md:bottom-6 md:right-6 md:h-[min(30rem,70svh)] md:w-[22rem] md:origin-bottom-right md:rounded-2xl md:border md:border-line md:bg-bg/95 md:backdrop-blur-xl",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4 md:px-4 md:py-3">
          <span className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted md:text-[0.625rem]">
            <Sparkle className="size-4 text-accent md:size-3.5" />
            Ask about Dike
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={closeChat}
            aria-label="Close chat"
            className="flex size-11 items-center justify-center rounded-full border border-line text-accent transition-colors hover:border-accent"
          >
            <ChevronDown className="size-5 md:size-4" />
          </button>
        </div>

        {/* messages */}
        <div
          ref={scrollRef}
          // let the mouse wheel scroll this list natively instead of Lenis
          // smooth-scrolling the page behind it (desktop)
          data-lenis-prevent
          className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-5 py-5 md:px-4 md:py-4"
        >
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-muted md:text-sm">
                Hey, I&apos;m Dike&apos;s assistant. Ask me anything about his
                work, background, or how to reach him.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-left font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted transition-colors hover:border-fg hover:text-fg"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "min-w-0 max-w-[85%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2.5 text-base leading-relaxed md:text-sm",
                    isUser
                      ? "bg-fg text-bg"
                      : "border border-line bg-bg text-fg/90",
                  )}
                >
                  {text || (
                    <span className="inline-flex gap-1 align-middle">
                      <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {error && (
            <p className="text-sm text-accent">
              Something went wrong. Mind trying that again?
            </p>
          )}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex items-center gap-2 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-3 md:pb-3"
        >
          <input
            aria-label="Your question about Dike"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1500}
            placeholder="Ask about Dike..."
            /* text-base (16px) is required: iOS Safari auto-zooms into any input
               with a smaller font, which widens the page and causes horizontal scroll */
            className="min-w-0 flex-1 rounded-2xl border border-line bg-bg px-4 py-2.5 text-base text-fg placeholder:text-muted transition-colors focus:border-fg/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            aria-label="Send"
            className="shrink-0 rounded-2xl bg-accent px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-bg transition-opacity disabled:opacity-40"
          >
            {busy ? "..." : "Send"}
          </button>
        </form>
      </div>
    </>
  );
}
