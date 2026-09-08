"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import {
  clamp,
  drawPoster,
  INITIAL_POSTER,
  POSTER_HEIGHT,
  POSTER_PALETTES,
  POSTER_WIDTH,
  posterWords,
} from "@/lib/poster";
import type { PosterFonts, PosterState } from "@/lib/poster";
import styles from "./AfterHours.module.css";

export default function AfterHours() {
  const [poster, setPoster] = useState<PosterState>(INITIAL_POSTER);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontsRef = useRef<PosterFonts>({
    sans: "sans-serif",
    mono: "monospace",
  });
  const pointerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const css = getComputedStyle(document.documentElement);
    const fonts = {
      sans: css.getPropertyValue("--font-archivo").trim() || "sans-serif",
      mono: css.getPropertyValue("--font-plex-mono").trim() || "monospace",
    };
    fontsRef.current = fonts;
    Promise.all([
      document.fonts.load(`900 150px ${fonts.sans}`),
      document.fonts.load(`400 22px ${fonts.mono}`),
      document.fonts.load(`500 22px ${fonts.mono}`),
    ])
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const frame = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      try {
        drawPoster(canvasRef.current, poster, fontsRef.current);
      } catch {
        setError(
          "The poster couldn’t load. Try a browser that supports canvas.",
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [poster, ready]);

  const update = (changes: Partial<PosterState>) => {
    setPoster((current) => ({ ...current, ...changes }));
    setMessage("");
  };

  const movePoint = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    update({
      point: {
        x: clamp((event.clientX - bounds.left) / bounds.width),
        y: clamp((event.clientY - bounds.top) / bounds.height),
      },
    });
  };

  const startPull = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    movePoint(event);
  };

  const stopPull = () => {
    pointerRef.current = null;
    setDragging(false);
  };

  const keyPull = (event: KeyboardEvent<HTMLButtonElement>) => {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 0.1 : 0.025;
    setPoster((current) => ({
      ...current,
      point: {
        x: clamp(current.point.x + direction[0] * step),
        y: clamp(current.point.y + direction[1] * step),
      },
    }));
    setMessage("");
  };

  const savePoster = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = POSTER_WIDTH * 2;
      canvas.height = POSTER_HEIGHT * 2;
      drawPoster(canvas, poster, fontsRef.current);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) =>
            result ? resolve(result) : reject(new Error("Export failed")),
          "image/png",
        );
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename =
        posterWords(poster.words)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "your-mark";
      link.href = url;
      link.download = `after-hours-${filename}-${String(poster.variation).padStart(3, "0")}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setMessage(
        "Download started. A little piece of after hours, yours to keep.",
      );
    } catch {
      setError("That export didn’t work. Please try downloading again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="after-hours"
      className={styles.page}
      aria-labelledby="after-hours-title"
    >
      <div className={styles.studio}>
        <div className={styles.controlTop}>
          <div className={styles.intro}>
            <p className={styles.kicker}>
              <span aria-hidden="true" /> After hours / 001
            </p>
            <h1 id="after-hours-title">
              Make your <em>mark.</em>
            </h1>
            <p className={styles.lead}>
              Your words. A little tension.
              <br />
              Something entirely yours.
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="poster-words">Your words</label>
            <input
              id="poster-words"
              value={poster.words}
              maxLength={24}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => update({ words: event.target.value })}
              aria-describedby="words-hint"
            />
            <p id="words-hint" className={styles.hint}>
              A name, a mantra, a passing thought. Up to 24 characters.
            </p>
          </div>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="poster-tension">Tension</label>
              <output htmlFor="poster-tension">
                {poster.tension.toString().padStart(2, "0")}
              </output>
            </div>
            <input
              id="poster-tension"
              type="range"
              min={0}
              max={100}
              value={poster.tension}
              onChange={(event) =>
                update({ tension: Number(event.target.value) })
              }
              aria-valuetext={`${poster.tension} percent, ${poster.tension < 30 ? "precise" : poster.tension > 70 ? "expressive" : "balanced"}`}
            />
            <div className={styles.rangeEnds}>
              <span>Precise</span>
              <span>Expressive</span>
            </div>
          </div>
        </div>
        <div className={styles.artwork}>
          <div className={styles.artworkHeader}>
            <span>Type in motion</span>
            <span aria-live="polite">
              Study {String(poster.variation).padStart(3, "0")}
            </span>
          </div>
          <button
            type="button"
            className={styles.poster}
            data-dragging={dragging}
            aria-label={`Shape your ${posterWords(poster.words)} poster`}
            aria-describedby="poster-instructions"
            disabled={!ready}
            onPointerDown={startPull}
            onPointerMove={(event) => {
              if (pointerRef.current === event.pointerId) movePoint(event);
            }}
            onPointerUp={stopPull}
            onPointerCancel={stopPull}
            onLostPointerCapture={stopPull}
            onKeyDown={keyPull}
            onClick={(event) => {
              if (event.detail === 0) update({ point: { x: 0.5, y: 0.5 } });
            }}
          >
            <canvas
              ref={canvasRef}
              width={POSTER_WIDTH}
              height={POSTER_HEIGHT}
              aria-hidden="true"
              data-ready={ready}
            />
            {!ready ? (
              <span className={styles.loading}>Setting the type…</span>
            ) : null}
          </button>
          <div className={styles.artworkFooter}>
            <p id="poster-instructions">
              {poster.tension === 0
                ? "Add tension to bend the lettering."
                : "Drag the poster to shape it."}
              <br />
              <span>
                Or focus it and use arrow keys. Enter centers the pull.
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setPoster((current) => ({
                  ...current,
                  variation: current.variation + 1,
                  point: { x: 0.5, y: 0.5 },
                }));
                setMessage("");
              }}
            >
              New composition <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
        <div className={styles.controlBottom}>
          <fieldset className={styles.paletteField}>
            <legend>Paper & ink</legend>
            <div className={styles.palettes}>
              {POSTER_PALETTES.map((palette, index) => (
                <button
                  type="button"
                  key={palette.name}
                  aria-pressed={poster.palette === index}
                  onClick={() => update({ palette: index })}
                >
                  <span
                    className={styles.swatch}
                    style={{
                      background: palette.background,
                      color: palette.ink,
                    }}
                    aria-hidden="true"
                  >
                    a
                  </span>
                  {palette.name}
                </button>
              ))}
            </div>
          </fieldset>
          <div className={styles.actions}>
            <button
              className={styles.download}
              type="button"
              disabled={!ready || saving}
              onClick={savePoster}
            >
              {saving ? "Making your poster…" : "Keep this one"}
              <span aria-hidden="true">↓</span>
            </button>
            <div className={styles.exportDetails}>
              <span>PNG · 2400 × 3000</span>
              <span>Yours to keep.</span>
            </div>
            <p className={styles.status} role="status">
              {message}
            </p>
            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className={styles.colophon}>
        <p>A small experiment in type, tension, and letting go.</p>
        <span>Designed & built by Dike</span>
      </div>
    </section>
  );
}
