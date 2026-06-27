"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

const SPACING = 26;
const RADIUS = 230; // cursor influence radius
const PUSH = 30; // max displacement in px

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Dot-grid texture behind the hero. Dots repel from the cursor and tint
 * toward the accent color near it. Static on touch / reduced motion.
 */
export default function HeroCanvas({ accent = "#ff4d24" }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interactive =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !prefersReducedMotion();

    const [ar, ag, ab] = hexToRgb(accent);
    let dots: { x: number; y: number }[] = [];
    let W = 0;
    let H = 0;
    let raf = 0;
    let inView = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = SPACING / 2; y < H; y += SPACING) {
        for (let x = SPACING / 2; x < W; x += SPACING) {
          dots.push({ x, y });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * 0.14;
      mouse.y += (mouse.ty - mouse.y) * 0.14;

      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        let t = 0;
        let ox = 0;
        let oy = 0;
        if (dist < RADIUS && dist > 0.01) {
          t = 1 - dist / RADIUS;
          const f = t * t * PUSH;
          ox = (dx / dist) * f;
          oy = (dy / dist) * f;
        }
        if (t > 0) {
          ctx.fillStyle = `rgba(${ar},${ag},${ab},${(0.14 + t * 0.6).toFixed(3)})`;
        } else {
          ctx.fillStyle = "rgba(234,232,228,0.085)";
        }
        ctx.beginPath();
        ctx.arc(d.x + ox, d.y + oy, 1 + t * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf && interactive && inView) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };

    resize();
    draw(); // static first paint (also the final state for non-interactive)

    window.addEventListener("resize", resize);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    if (interactive) {
      window.addEventListener("mousemove", onMove);
      document.documentElement.addEventListener("mouseleave", onLeave);
      start();
    }

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
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
