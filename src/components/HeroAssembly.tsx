"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const layers = [
  { name: "Structure", description: "The right help, always one tap away." },
  { name: "Components", description: "A shared language for every screen." },
  { name: "Interface", description: "All the details. One useful product." },
];

export default function HeroAssembly() {
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const control = useRef<(expanded: boolean) => void>(() => {});
  const inspecting = useRef(false);
  const [inspect, setInspect] = useState(false);
  const [selected, setSelected] = useState(2);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          all: "all",
          reduced: "(prefers-reduced-motion: reduce)",
          mobile: "(max-width: 767px)",
          pointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { reduced, mobile, pointer } = context.conditions!;
          const el = root.current!;
          const object = scene.current!;
          const pose = {
            inspection: inspecting.current ? 1 : 0,
            scroll: 0,
            intro: reduced ? 1 : 0,
          };
          const paint = () => {
            const assembly = pose.scroll * (1 - pose.inspection);
            object.style.setProperty(
              "--spread",
              String((0.8 + 0.4 * pose.inspection) * (1 - assembly)),
            );
            object.style.setProperty("--assembly", String(assembly));
            object.style.setProperty("--entrance", String(pose.intro));
          };
          paint();
          control.current = (expanded) => {
            gsap.to(pose, {
              inspection: expanded ? 1 : 0,
              duration: reduced ? 0 : 0.9,
              ease: "power3.inOut",
              overwrite: "auto",
              onUpdate: paint,
            });
          };
          if (!reduced) {
            gsap.to(pose, {
              intro: 1,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: paint,
            });
            // Desktop stays in view during assembly; mobile uses natural scrolling.
            gsap.to(pose, {
              scroll: 1,
              ease: "none",
              onUpdate: paint,
              scrollTrigger: {
                trigger: mobile ? el : el.closest("section"),
                start: mobile ? "top 45%" : "top top",
                end: mobile ? "center 20%" : "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            });
          }
          let clearPointer = () => {};
          if (pointer && !reduced) {
            const xTo = gsap.quickTo(tilt.current, "rotationY", {
              duration: 0.8,
              ease: "power3.out",
            });
            const yTo = gsap.quickTo(tilt.current, "rotationX", {
              duration: 0.8,
              ease: "power3.out",
            });
            const onMove = (event: PointerEvent) => {
              const rect = el.getBoundingClientRect();
              xTo(((event.clientX - rect.left) / rect.width - 0.5) * 12);
              yTo(-((event.clientY - rect.top) / rect.height - 0.5) * 9);
            };
            const onLeave = () => {
              xTo(0);
              yTo(0);
            };
            el.addEventListener("pointermove", onMove, { passive: true });
            el.addEventListener("pointerleave", onLeave);
            clearPointer = () => {
              el.removeEventListener("pointermove", onMove);
              el.removeEventListener("pointerleave", onLeave);
              xTo.tween.kill();
              yTo.tween.kill();
              gsap.set(tilt.current, { clearProps: "transform" });
            };
          }
          return () => {
            clearPointer();
            gsap.killTweensOf(pose);
            control.current = () => {};
          };
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    inspecting.current = inspect;
    control.current(inspect);
    window.dispatchEvent(
      new CustomEvent("playground:hero", { detail: { active: inspect } }),
    );
  }, [inspect]);

  useEffect(() => {
    const toggle = () => setInspect((value) => !value);
    window.addEventListener("playground:inspect", toggle);
    return () => {
      window.removeEventListener("playground:inspect", toggle);
      window.dispatchEvent(
        new CustomEvent("playground:hero", { detail: { active: false } }),
      );
    };
  }, []);

  return (
    <div
      ref={root}
      className={styles.assembly}
      data-inspecting={inspect}
      data-selected={selected}
    >
      <div className={styles.exhibitLabel}>
        <span className={styles.exhibitCross} aria-hidden="true">
          +
        </span>
        <span>A product, beneath the surface</span>
        <span className={styles.exhibitNumber}>Fig. 01</span>
      </div>
      <div ref={scene} id="product-assembly" className={styles.scene}>
        <div className={styles.shadow} aria-hidden="true" />
        <div ref={tilt} className={styles.tilt}>
          <div
            className={styles.product}
            role="img"
            aria-label="An exploded view of Kiphar: structure, reusable components, and the finished emergency screen, arranged in three layers."
          >
            <div
              className={`${styles.plane} ${styles.structure}`}
              aria-hidden="true"
            >
              <div className={styles.planeLabel}>
                <span>01</span> Structure
              </div>
              <div className={styles.structureInner}>
                <span className={styles.wireEyebrow}>Kiphar / Emergency</span>
                <div className={styles.wireHeader} />
                <div className={styles.wireParagraph} />
                <div className={styles.wireGrid}>
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item}>
                      <i />
                      <span />
                      <span />
                    </div>
                  ))}
                </div>
                <div className={styles.wireButton} />
                <div className={styles.wireNav}>
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <span className={styles.dimension}>A clear path to help</span>
            </div>
            <div
              className={`${styles.plane} ${styles.components}`}
              aria-hidden="true"
            >
              <div className={styles.planeLabel}>
                <span>02</span> Components
              </div>
              <div className={styles.componentsInner}>
                <div className={styles.componentType}>
                  <span>Aa</span>
                  <span>
                    Form follows
                    <br />
                    function.
                  </span>
                </div>
                <div className={styles.swatches}>
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className={styles.componentGrid}>
                  <div>
                    <span>+</span>
                    <i />
                    <i />
                  </div>
                  <div>
                    <span>↗</span>
                    <i />
                    <i />
                  </div>
                </div>
                <div className={styles.componentButton}>
                  Raise alarm <span>↗</span>
                </div>
                <div className={styles.componentLines}>
                  <i />
                  <i />
                  <i />
                </div>
                <div className={styles.componentFooter}>
                  Consistent by design <span>↗</span>
                </div>
              </div>
            </div>
            <div
              className={`${styles.plane} ${styles.interface}`}
              aria-hidden="true"
            >
              <div className={styles.planeLabel}>
                <span>03</span> Interface <i />
              </div>
              <div className={styles.screen}>
                {/* CSS frames the original image shared with the case study. */}
                <Image
                  src="/images/kiphar-emergency.webp"
                  alt=""
                  width={400}
                  height={620}
                  sizes="400px"
                  loading="eager"
                  fetchPriority="high"
                  className={styles.screenImage}
                />
              </div>
              <div className={styles.glassEdge} />
            </div>
          </div>
        </div>
        <span className={styles.sceneAnnotation} aria-hidden="true">
          Designed with intent.
          <br />
          Built to work.
        </span>
      </div>
      <div className={styles.exhibitControls}>
        <Link href="/work/kiphar" className={styles.projectLink}>
          <span className={styles.projectMark}>k</span>
          <span>
            <strong>Kiphar</strong>
            <span>Founded. Designed. Built.</span>
          </span>
          <span className={styles.projectArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
        <div
          className={styles.inspector}
          id="layer-inspector"
          hidden={!inspect}
        >
          <div
            className={styles.layerButtons}
            role="group"
            aria-label="Inspect a product layer"
          >
            {layers.map((layer, i) => (
              <button
                key={layer.name}
                type="button"
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                <span>0{i + 1}</span> {layer.name}
              </button>
            ))}
          </div>
          <p aria-live="polite">{layers[selected].description}</p>
        </div>
        <button
          type="button"
          className={styles.inspectButton}
          aria-expanded={inspect}
          aria-controls="layer-inspector"
          onClick={() => setInspect((value) => !value)}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="m2 7 8-4 8 4-8 4-8-4Zm0 4 8 4 8-4M2 15l8 4 8-4" />
          </svg>
          {inspect ? "Close inspection" : "Inspect layers"}
        </button>
      </div>
    </div>
  );
}
