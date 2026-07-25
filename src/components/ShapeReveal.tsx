"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NavShape from "@/components/NavShape";
import { NAV_ITEMS } from "@/data/navItems";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The four shapes, revealed together and centered on the page as the hero
 * scrolls away — modelled on the emergenceprojects.com reveal. This replaces
 * the old scroll-to-navbar docking entirely: there is no corner, no docked end
 * state, and no persistent top navbar. The shapes are simply the way you get
 * to the four pages.
 *
 * CSS grid handles the resting centred layout. This component only writes, per
 * frame, the reveal transform (a staggered rise + fade tied to scroll) and the
 * idle 3D float — composed into one transform string per element so the two
 * never fight over the same style property.
 */
export default function ShapeReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shellRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const plateRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const progress = useRef(0);
  const reduceMotion = usePrefersReducedMotion();
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  // Scroll progress across the section entrance. Reports only; no writes here.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      end: "top 35%",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
      onRefresh: (self) => {
        progress.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  // One loop writes reveal + idle for every shape.
  useEffect(() => {
    let frame = 0;

    const draw = (now: number) => {
      const still = reduceRef.current;
      const p = still ? 1 : progress.current;
      const t = now / 1000;
      const span = 0.55;

      for (let i = 0; i < NAV_ITEMS.length; i += 1) {
        const item = NAV_ITEMS[i];
        const shell = shellRefs.current[i];
        const plate = plateRefs.current[i];
        if (!shell) continue;

        // Staggered entrance: each shape starts a little after the previous.
        const start = i * 0.12;
        const local = Math.min(1, Math.max(0, (p - start) / span));
        const ease = 1 - Math.pow(1 - local, 3);

        // Idle motion scales in with the reveal, so nothing twitches before it
        // has arrived.
        const bob = still ? 0 : Math.sin(t * item.speed * 2 + item.phase) * 8 * ease;
        const sway = still ? 0 : Math.cos(t * item.speed * 1.5 + item.phase) * 5 * ease;

        const riseY = (1 - ease) * 46;
        const scale = 0.72 + 0.28 * ease;

        shell.style.opacity = String(ease);
        shell.style.transform = `translate3d(${sway}px, ${riseY + bob}px, 0) scale(${scale})`;

        if (plate) {
          if (still) {
            plate.style.transform = "";
          } else {
            const rx = Math.sin(t * item.speed * 1.7 + item.phase) * 10 * ease;
            const ry = Math.cos(t * item.speed * 1.3 + item.phase * 0.7) * 16 * ease;
            const rz = Math.sin(t * item.speed * 0.9 + item.phase * 1.4) * 4 * ease;
            plate.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={sectionRef} className="shape-reveal" aria-label="Explore">
      <p className="shape-reveal-eyebrow">Four ways in</p>
      <nav className="shape-grid" aria-label="Primary">
        {NAV_ITEMS.map((item, i) => (
          <NavShape
            key={item.id}
            item={item}
            shellRef={(el) => {
              shellRefs.current[i] = el;
            }}
            plateRef={(el) => {
              plateRefs.current[i] = el;
            }}
          />
        ))}
      </nav>
    </section>
  );
}
