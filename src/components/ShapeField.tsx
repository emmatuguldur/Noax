"use client";

import { useEffect, useRef } from "react";

import NavShape from "@/components/NavShape";
import { NAV_ITEMS } from "@/data/navItems";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The four shapes as a fixed overlay, driven directly by scroll position.
 *
 * On load they sit scattered around the shirt at their loose hero anchors. As
 * you scroll they converge — smoothly, tied to scroll, not a hard cut — into a
 * centered, evenly-spaced row ("Four ways in"), labels fading in as they line
 * up. That row is the destination. Then, as you keep scrolling toward the quote
 * section, the whole assembled row lifts and fades away so it doesn't sit on top
 * of the content below (emergence-style: assemble, then move past).
 *
 * Progress is read straight from window.scrollY / viewport height, so the whole
 * thing is deterministic — no ScrollTrigger. One rAF loop writes every
 * transform and composes the idle float into it.
 */
const DESKTOP = { size: 118, rowScale: 0.9, rowGap: 224, rowY: 0.5 };
const COMPACT = { size: 58, rowScale: 0.92, rowGapFrac: 0.2, rowY: 0.5 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function ShapeField() {
  const compact = useIsCompact();
  const reduceMotion = usePrefersReducedMotion();

  const fieldRef = useRef<HTMLElement | null>(null);
  const shellRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const plateRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const compactRef = useRef(compact);
  compactRef.current = compact;
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  useEffect(() => {
    let frame = 0;
    const view = { w: window.innerWidth, h: window.innerHeight };
    const measure = () => {
      view.w = window.innerWidth;
      view.h = window.innerHeight;
    };
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure);

    const draw = (now: number) => {
      const still = reduceRef.current;
      const isCompact = compactRef.current;
      const m = isCompact ? COMPACT : DESKTOP;
      const vh = view.h || 1;

      // Scroll progress in viewport units. Reduced motion parks on the row.
      const P = window.scrollY / vh;
      const converge = still ? 1 : smoothstep(0, 0.7, P);
      const depart = still ? 0 : smoothstep(1.02, 1.6, P);

      const t = now / 1000;
      const gap = isCompact ? view.w * COMPACT.rowGapFrac : DESKTOP.rowGap;
      const rowY = vh * m.rowY;
      const departRise = depart * vh * 0.5;

      if (fieldRef.current) {
        fieldRef.current.style.opacity = String(1 - depart);
        fieldRef.current.style.transform = `translateY(${-departRise}px)`;
        fieldRef.current.style.setProperty("--assembled", String(converge * (1 - depart)));
      }

      for (let i = 0; i < NAV_ITEMS.length; i += 1) {
        const item = NAV_ITEMS[i];
        const shell = shellRefs.current[i];
        const plate = plateRefs.current[i];
        if (!shell) continue;

        const anchor = isCompact ? item.heroMobile : item.hero;
        const heroX = view.w * anchor.x;
        const heroY = vh * anchor.y;
        const rowX = view.w / 2 + (item.rowOrder - (NAV_ITEMS.length - 1) / 2) * gap;

        // Idle motion lives in the scattered state and settles out on the row.
        const floatAmt = still ? 0 : 1 - converge;
        const bob = Math.sin(t * item.speed * 2 + item.phase) * 9 * floatAmt;
        const sway = Math.cos(t * item.speed * 1.4 + item.phase) * 6 * floatAmt;

        const x = lerp(heroX + sway, rowX, converge);
        const y = lerp(heroY + bob, rowY, converge);
        const scale = lerp(1, m.rowScale, converge);

        shell.style.transform = `translate3d(${x - m.size / 2}px, ${y - m.size / 2}px, 0) scale(${scale})`;
        shell.style.setProperty("--lo", String(converge * (1 - depart)));

        if (plate) {
          if (still) {
            plate.style.transform = "";
          } else {
            const rx = Math.sin(t * item.speed * 1.7 + item.phase) * 9 * floatAmt;
            const ry = Math.cos(t * item.speed * 1.3 + item.phase * 0.7) * 14 * floatAmt;
            const rz = Math.sin(t * item.speed * 0.9 + item.phase * 1.4) * 4 * floatAmt;
            plate.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  return (
    <>
      {/* Scroll distance for the hold + depart, before the quote section. */}
      <div className="shape-spacer" aria-hidden="true" />

      <nav ref={fieldRef} className="shape-field" aria-label="Explore">
        <p className="shape-field-eyebrow">Four ways in</p>
        {NAV_ITEMS.map((item, i) => (
          <NavShape
            key={item.id}
            item={item}
            size={compact ? COMPACT.size : DESKTOP.size}
            shellRef={(el) => {
              shellRefs.current[i] = el;
            }}
            plateRef={(el) => {
              plateRefs.current[i] = el;
            }}
          />
        ))}
      </nav>
    </>
  );
}
