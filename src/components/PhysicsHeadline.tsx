"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import Matter from "matter-js";
import { cn, isTouchDevice, prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;
type MBody = ReturnType<typeof Bodies.rectangle>;
type Setter = ReturnType<typeof gsap.quickTo>;

// Each letter's box is pinned to the width it settles on, so a glyph much wider
// than its slot would spill over its neighbours mid-scramble. These pools drop
// the width outliers (I/J/M/W and their lowercase twins) to keep the overlap
// small, and each line cycles in its own case rather than shouting in caps.
const LINES = [
  { text: "DESIGN,", className: "block", chars: "ABCDEFGHKLNOPQRSTUVXYZ" },
  { text: "engineered.", className: "serif-italic block", chars: "abcdefghknopqrstuvxyz" },
];

// punctuation slots are far too narrow to host a letter, so they sit the
// scramble out and are simply there when the line appears
const isPunctuation = (c: string) => c === "," || c === ".";

// how close the cursor gets before a letter leans away, and how far it leans
const PUSH_RADIUS = 260;
const PUSH_STRENGTH = 0.32;

export default function PhysicsHeadline() {
  const root = useRef<HTMLHeadingElement>(null);
  const active = useRef(false);
  const resetting = useRef(false);
  const alive = useRef(true);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const teardown = useRef<() => void>(() => {}); // fluid reset (animates letters home)
  const hard = useRef<() => void>(() => {}); // instant teardown (unmount / final step)
  // idle wave + cursor push, paused whenever the physics toy owns the letters
  const ambient = useRef({ start: () => {}, stop: () => {} });

  const emitState = (on: boolean) =>
    window.dispatchEvent(new CustomEvent("playground:hero", { detail: { active: on } }));

  // intro: every letter cycles random glyphs, then locks into the real word
  useGSAP(
    (_ctx, contextSafe) => {
      const rootEl = root.current;
      if (!rootEl) return;

      if (prefersReducedMotion()) {
        gsap.set(rootEl, { autoAlpha: 1 });
        return;
      }

      const floats = gsap.utils.toArray<HTMLElement>("[data-pf]", rootEl);
      const scrambling = floats.filter((el) => !isPunctuation(el.textContent ?? ""));

      const run = contextSafe!(() => {
        // the toy can be opened before the webfont resolves; if it already owns
        // the letters, revealing the h1 here would sit it on top of the overlay
        if (!alive.current || active.current) return;

        // Random glyphs are all different widths, so an unpinned line would
        // shudder for the whole intro. Pin each box to the letter it settles
        // on — measured after the webfont lands, not on fallback metrics.
        for (const el of scrambling) {
          el.style.width = `${el.getBoundingClientRect().width}px`;
          el.style.textAlign = "center";
        }

        gsap.set(rootEl, { autoAlpha: 1 });

        const tl = gsap.timeline({
          onComplete: () => {
            for (const el of scrambling) {
              el.style.width = "";
              el.style.textAlign = "";
            }
            ambient.current.start();
          },
        });

        scrambling.forEach((el, i) => {
          const settled = el.textContent ?? "";
          const chars = el.closest<HTMLElement>("[data-chars]")?.dataset.chars ?? "";
          tl.to(
            el,
            {
              duration: 0.5,
              ease: "none",
              scrambleText: { text: settled, chars, speed: 0.7 },
            },
            i * 0.045
          );
        });

        intro.current = tl;
      });

      // fonts.ready always settles; the status check just skips a microtask on
      // repeat visits where the font is already cached
      if (!document.fonts || document.fonts.status === "loaded") run();
      else document.fonts.ready.then(run);
    },
    { scope: root }
  );

  // ambient motion: a slow wave on the inner span, the cursor push on the outer
  // one, so the two effects never contend for the same transform
  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl || prefersReducedMotion()) return;

    const chars = gsap.utils.toArray<HTMLElement>("[data-pc]", rootEl);
    const floats = gsap.utils.toArray<HTMLElement>("[data-pf]", rootEl);
    const hover = !isTouchDevice();

    let homes: { cx: number; cy: number }[] = [];
    let push: { x: Setter; y: Setter; r: Setter }[] = [];
    let wave: gsap.core.Tween | null = null;
    let running = false;

    // Centres are cached against the h1's own box, so a pointermove costs one
    // rect read instead of one per letter — and a letter that has already been
    // pushed can't feed its own offset back into the next frame's distance.
    const measure = () => {
      gsap.set(chars, { x: 0, y: 0, rotation: 0 });
      const box = rootEl.getBoundingClientRect();
      homes = chars.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          cx: r.left - box.left + r.width / 2,
          cy: r.top - box.top + r.height / 2,
        };
      });
    };

    const onMove = (e: PointerEvent) => {
      if (!running || !push.length) return;
      const box = rootEl.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;

      const px = e.clientX - box.left;
      const py = e.clientY - box.top;

      homes.forEach((h, i) => {
        const dx = h.cx - px;
        const dy = h.cy - py;
        const falloff = 1 - Math.min(Math.hypot(dx, dy), PUSH_RADIUS) / PUSH_RADIUS;
        push[i].x(dx * falloff * PUSH_STRENGTH);
        push[i].y(dy * falloff * PUSH_STRENGTH);
        push[i].r(dx * falloff * 0.035);
      });
    };

    const start = () => {
      if (!alive.current || running) return;
      running = true;
      measure();
      push = chars.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" }),
        r: gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3" }),
      }));
      wave = gsap.to(floats, {
        y: -10,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.09, from: "start" },
      });
    };

    const stop = () => {
      running = false;
      wave?.kill();
      wave = null;
      // drop the quickTo tweens outright — a half-finished push would otherwise
      // keep writing transforms over the reset below
      gsap.killTweensOf(chars);
      push = [];
      gsap.set(chars, { x: 0, y: 0, rotation: 0 });
      gsap.set(floats, { y: 0 });
    };

    ambient.current = { start, stop };

    // the cached centres only feed the cursor push, so on touch there is
    // nothing to re-measure and the idle wave runs on its own
    if (hover) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", measure);
    }

    return () => {
      if (hover) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", measure);
      }
      stop();
      ambient.current = { start: () => {}, stop: () => {} };
    };
  }, []);

  function toggle() {
    if (prefersReducedMotion() || resetting.current) return;
    if (active.current) teardown.current();
    else activate();
  }

  function activate() {
    const rootEl = root.current;
    const section = rootEl?.closest("section");
    if (!rootEl || !section) return;

    // A click mid-intro would otherwise clone letters frozen on random glyphs.
    // Snapping the timeline to the end settles the text and releases the
    // pinned widths before anything gets measured.
    if (intro.current?.isActive()) intro.current.progress(1);
    ambient.current.stop();

    const chars = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-pc]"));
    const sRect = section.getBoundingClientRect();
    const W = section.clientWidth;
    const H = section.clientHeight;

    const overlay = document.createElement("div");
    // pan-y (not none) so a vertical swipe still scrolls the page away from the
    // knocked-over hero instead of trapping the visitor on it
    overlay.style.cssText =
      "position:absolute;inset:0;z-index:70;overflow:hidden;touch-action:pan-y;";
    section.appendChild(overlay);

    const engine = Engine.create();
    engine.gravity.y = 1.1;

    const items: {
      body: MBody;
      el: HTMLElement;
      w: number;
      h: number;
      homeX: number;
      homeY: number;
    }[] = [];
    for (const ch of chars) {
      const r = ch.getBoundingClientRect();
      const x = r.left - sRect.left;
      const y = r.top - sRect.top;
      // copy the computed type so each letter keeps its font, size, weight & italic
      const cs = getComputedStyle(ch);
      const el = ch.cloneNode(true) as HTMLElement;
      el.style.cssText =
        "position:absolute;left:0;top:0;margin:0;white-space:nowrap;will-change:transform;transform-origin:center;" +
        `font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};` +
        `font-style:${cs.fontStyle};font-stretch:${cs.fontStretch};line-height:${cs.lineHeight};` +
        `letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform};color:${cs.color};` +
        `transform:translate(${x}px,${y}px);`;
      overlay.appendChild(el);
      const body = Bodies.rectangle(x + r.width / 2, y + r.height / 2, r.width, r.height, {
        restitution: 0.5,
        friction: 0.35,
        frictionAir: 0.012,
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: -Math.random() * 7 });
      items.push({ body, el, w: r.width, h: r.height, homeX: x, homeY: y });
    }

    const wall = { isStatic: true };
    const walls = [
      Bodies.rectangle(W / 2, H + 40, W * 2, 80, wall), // floor
      Bodies.rectangle(-40, H / 2, 80, H * 4, wall), // left
      Bodies.rectangle(W + 40, H / 2, 80, H * 4, wall), // right
      Bodies.rectangle(W / 2, -H - 40, W * 2, 80, wall), // high ceiling
    ];

    const mouse = Mouse.create(overlay);
    // don't hijack page scroll while the toy is open
    const mw = (mouse as unknown as { mousewheel: EventListener }).mousewheel;
    overlay.removeEventListener("wheel", mw);
    overlay.removeEventListener("DOMMouseScroll", mw);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    Composite.add(engine.world, [...items.map((i) => i.body), ...walls, mc]);

    const sync = () => {
      for (const it of items) {
        it.el.style.transform = `translate(${it.body.position.x - it.w / 2}px, ${
          it.body.position.y - it.h / 2
        }px) rotate(${it.body.angle}rad)`;
      }
    };
    Events.on(engine, "afterUpdate", sync);

    const runner = Runner.create();
    Runner.run(runner, engine);
    gsap.set(rootEl, { autoAlpha: 0 });
    active.current = true;
    emitState(true); // tell the playground panel to show "Reset"

    // instant teardown: reveal the real headline, then drop the toy
    hard.current = () => {
      Events.off(engine, "afterUpdate", sync);
      Runner.stop(runner);
      Engine.clear(engine);
      gsap.set(rootEl, { autoAlpha: 1 });
      overlay.remove();
      active.current = false;
      resetting.current = false;
      emitState(false); // back to "Knock the hero over"
      hard.current = () => {};
      teardown.current = () => {};
      ambient.current.start(); // no-ops if we got here via unmount
    };

    // fluid reset: each letter flies back to its spot and rotates upright,
    // then we hand off to the real <h1> underneath (they line up exactly)
    teardown.current = () => {
      resetting.current = true;
      Events.off(engine, "afterUpdate", sync); // stop physics driving transforms
      Runner.stop(runner);
      const tl = gsap.timeline({ onComplete: () => hard.current() });
      items.forEach((it, i) => {
        gsap.set(it.el, {
          x: it.body.position.x - it.w / 2,
          y: it.body.position.y - it.h / 2,
          rotation: (it.body.angle * 180) / Math.PI,
        });
        tl.to(
          it.el,
          { x: it.homeX, y: it.homeY, rotation: 0, duration: 0.8, ease: "power3.inOut" },
          i * 0.03
        );
      });
    };
  }

  // Declared after toggle/activate so the listener closes over them already
  // defined; still the third hook on every render, so hook order is unchanged.
  useEffect(() => {
    const onShake = () => toggle();
    window.addEventListener("playground:shake", onShake);
    return () => {
      window.removeEventListener("playground:shake", onShake);
      alive.current = false;
      hard.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On touch the headline fills the first screen, so a tap-to-knock-over would
  // fire while scrolling. There, the toy is reached only via the Playground button.
  const onHeadlineClick = () => {
    if (!isTouchDevice()) toggle();
  };

  return (
    <h1
      ref={root}
      onClick={onHeadlineClick}
      title="knock it over"
      aria-label="Design, engineered."
      className="display invisible select-none text-[clamp(3.25rem,12.5vw,12.5rem)] [@media(hover:hover)]:cursor-pointer"
    >
      {LINES.map((line) => (
        <span
          key={line.text}
          aria-hidden
          data-chars={line.chars}
          className={line.className}
        >
          {[...line.text].map((c, i) => (
            <span
              key={i}
              data-pc
              className={cn("inline-block", isPunctuation(c) && "accent")}
            >
              <span data-pf className="inline-block">
                {c}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
