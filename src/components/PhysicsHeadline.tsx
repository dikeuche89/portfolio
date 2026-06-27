"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Matter from "matter-js";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;
type MBody = ReturnType<typeof Bodies.rectangle>;

const LINE1 = "DESIGN,";
const LINE2 = "engineered.";

export default function PhysicsHeadline() {
  const root = useRef<HTMLHeadingElement>(null);
  const active = useRef(false);
  const resetting = useRef(false);
  const teardown = useRef<() => void>(() => {}); // fluid reset (animates letters home)
  const hard = useRef<() => void>(() => {}); // instant teardown (unmount / final step)

  const emitState = (on: boolean) =>
    window.dispatchEvent(new CustomEvent("playground:hero", { detail: { active: on } }));

  // masked char-rise intro (matches the rest of the site)
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(root.current, { autoAlpha: 1 });
        return;
      }
      gsap.set(root.current, { autoAlpha: 1 });
      const chars = gsap.utils.toArray<HTMLElement>("[data-pc]", root.current);
      gsap.from(chars, {
        yPercent: 130,
        rotation: 4,
        duration: 1.2,
        stagger: { each: 0.025 },
        delay: 0.2,
        ease: "power4.out",
      });
    },
    { scope: root }
  );

  useEffect(() => {
    const onShake = () => toggle();
    window.addEventListener("playground:shake", onShake);
    return () => {
      window.removeEventListener("playground:shake", onShake);
      hard.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const chars = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-pc]"));
    const sRect = section.getBoundingClientRect();
    const W = section.clientWidth;
    const H = section.clientHeight;

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:absolute;inset:0;z-index:70;overflow:hidden;touch-action:none;";
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

  return (
    <h1
      ref={root}
      onClick={toggle}
      title="knock it over"
      className="display invisible cursor-pointer select-none text-[clamp(3.25rem,12.5vw,12.5rem)]"
    >
      <span className="block overflow-hidden">
        {[...LINE1].map((c, i) => (
          <span key={i} data-pc className={c === "," ? "accent inline-block" : "inline-block"}>
            {c}
          </span>
        ))}
      </span>
      <span className="serif-italic block overflow-hidden">
        {[...LINE2].map((c, i) => (
          <span key={i} data-pc className={c === "." ? "accent inline-block" : "inline-block"}>
            {c}
          </span>
        ))}
      </span>
    </h1>
  );
}
