"use client";

import { useEffect, useRef } from "react";
import { isTouchDevice, prefersReducedMotion } from "@/lib/utils";
import { initGyro, getTilt } from "@/lib/gyro";

const SPACING = 26;
const RADIUS = 200; // pointer influence radius
const PUSH = 28; // max pointer displacement
const AMBIENT = 2.4; // self-animating wave amplitude
const GYRO = 22; // grid shift at full device tilt
const RIPPLE_MS = 900; // touch ripple lifetime
const RIPPLE_MAX = 260; // touch ripple max radius

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

type Ripple = { x: number; y: number; t0: number };

/**
 * Living dot-grid behind the hero. Always gently flows on its own; repels and
 * tints toward the cursor (desktop) or touch (mobile, with tap ripples); and
 * parallax-shifts with device tilt via the gyroscope. Static on reduced-motion.
 */
export default function HeroCanvas({ accent = "#ff4d24" }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // phones: sparser grid + lower DPR so the per-frame canvas work stays light
    const touch = isTouchDevice();
    const spacing = touch ? 36 : SPACING;
    const maxDpr = touch ? 1.5 : 2;
    if (prefersReducedMotion()) {
      // single static paint
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(234,232,228,0.085)";
      for (let y = spacing / 2; y < rect.height; y += spacing)
        for (let x = spacing / 2; x < rect.width; x += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      return;
    }

    initGyro();
    // dot tint follows the live accent: seed from the CSS token (the playground
    // may have restored a saved colour) and update on the playground's events
    let rgb = hexToRgb(accent);
    const css = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim();
    if (/^#[0-9a-f]{6}$/i.test(css)) rgb = hexToRgb(css);
    const onAccent = (e: Event) => {
      const hex = (e as CustomEvent<{ hex: string }>).detail?.hex;
      if (hex && /^#[0-9a-f]{6}$/i.test(hex)) rgb = hexToRgb(hex);
    };
    window.addEventListener("playground:accent", onAccent);

    let dots: { x: number; y: number }[] = [];
    let W = 0;
    let H = 0;
    let raf = 0;
    let inView = true;
    const t0 = performance.now();
    const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let ripples: Ripple[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = spacing / 2; y < H; y += spacing)
        for (let x = spacing / 2; x < W; x += spacing) dots.push({ x, y });
    };

    const draw = () => {
      const now = performance.now();
      const t = (now - t0) / 1000;
      const [ar, ag, ab] = rgb;
      const tilt = getTilt();
      const gx = tilt.x * GYRO;
      const gy = tilt.y * GYRO;

      ptr.x += (ptr.tx - ptr.x) * 0.14;
      ptr.y += (ptr.ty - ptr.y) * 0.14;
      ripples = ripples.filter((r) => now - r.t0 < RIPPLE_MS);

      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        // ambient flow + gyro parallax
        const ax = Math.sin(t * 0.8 + d.y * 0.013) * AMBIENT;
        const ay = Math.cos(t * 0.66 + d.x * 0.013) * AMBIENT;
        const bx = d.x + gx + ax;
        const by = d.y + gy + ay;

        let glow = 0;
        let ox = 0;
        let oy = 0;

        // pointer repel + tint
        const dx = bx - ptr.x;
        const dy = by - ptr.y;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS && dist > 0.01) {
          const s = 1 - dist / RADIUS;
          const f = s * s * PUSH;
          ox += (dx / dist) * f;
          oy += (dy / dist) * f;
          glow = Math.max(glow, s);
        }

        // touch ripples: a push outward as the ring passes
        for (const r of ripples) {
          const age = (now - r.t0) / RIPPLE_MS;
          const ring = age * RIPPLE_MAX;
          const rdx = bx - r.x;
          const rdy = by - r.y;
          const rd = Math.hypot(rdx, rdy);
          const band = 60;
          if (Math.abs(rd - ring) < band && rd > 0.01) {
            const s = (1 - Math.abs(rd - ring) / band) * (1 - age);
            ox += (rdx / rd) * s * 26;
            oy += (rdy / rd) * s * 26;
            glow = Math.max(glow, s);
          }
        }

        ctx.fillStyle =
          glow > 0
            ? `rgba(${ar},${ag},${ab},${(0.12 + glow * 0.6).toFixed(3)})`
            : "rgba(234,232,228,0.085)";
        ctx.beginPath();
        ctx.arc(bx + ox, by + oy, 1 + glow * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && inView) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const rel = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      ptr.tx = clientX - rect.left;
      ptr.ty = clientY - rect.top;
    };
    const onMove = (e: MouseEvent) => rel(e.clientX, e.clientY);
    const onLeave = () => {
      ptr.tx = -9999;
      ptr.ty = -9999;
    };
    const onTouch = (e: TouchEvent) => {
      const tch = e.touches[0];
      if (!tch) return;
      rel(tch.clientX, tch.clientY);
      const rect = canvas.getBoundingClientRect();
      ripples.push({ x: tch.clientX - rect.left, y: tch.clientY - rect.top, t0: performance.now() });
      if (ripples.length > 8) ripples.shift();
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    canvas.parentElement?.addEventListener("touchstart", onTouch, { passive: true });
    canvas.parentElement?.addEventListener("touchmove", onTouch, { passive: true });

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("playground:accent", onAccent);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      canvas.parentElement?.removeEventListener("touchstart", onTouch);
      canvas.parentElement?.removeEventListener("touchmove", onTouch);
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
