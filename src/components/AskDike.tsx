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
  "Is he open to work?",
];

export default function AskDike() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({ transport });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  // focus the field when the panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // keep the latest message in view as it streams in
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[140] flex flex-col items-end md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:right-[calc(1.5rem+env(safe-area-inset-right))]">
      {/* panel */}
      <div
        className={cn(
          "mb-3 flex w-[min(22rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-bg/95 backdrop-blur-xl transition-all duration-300",
          open
            ? "pointer-events-auto h-[min(30rem,70vh)] opacity-100"
            : "pointer-events-none h-0 translate-y-3 opacity-0"
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted">
            <span className="pulse-dot" aria-hidden />
            Ask about Dike
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="font-mono text-[0.7rem] text-muted transition-colors hover:text-fg"
          >
            ✕
          </button>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted">
                Hey, I&apos;m Dike&apos;s assistant. Ask me anything about his work,
                background, or how to reach him.
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
              <div key={m.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    isUser
                      ? "bg-fg text-bg"
                      : "border border-line bg-bg text-fg/90"
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
          className="flex items-center gap-2 border-t border-line p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1500}
            placeholder="Ask about Dike..."
            className="min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            aria-label="Send"
            className="shrink-0 rounded-full bg-accent px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-bg transition-opacity disabled:opacity-40"
          >
            {busy ? "..." : "Send"}
          </button>
        </form>
      </div>

      {/* launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask about Dike"}
        className="flex items-center gap-2 rounded-full border border-line bg-bg/85 px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted backdrop-blur transition-colors hover:text-fg"
      >
        <span className="pulse-dot" aria-hidden />
        {open ? "Close" : "Ask about Dike"}
      </button>
    </div>
  );
}
