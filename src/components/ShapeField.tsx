"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NavShape from "@/components/NavShape";
import { NAV_ITEMS } from "@/data/navItems";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The four shapes as a fixed overlay.
 *
 * On load (progress 0) they sit scattered around the shirt at their loose hero
 * positions. As you scroll past the hero, one scroll-tied progress value drags
 * them — scrub-style, not a hard cut — into a centered, evenly-spaced
 * horizontal row, with their labels fading in as they line up. That row is the
 * destination; there is no docked navbar.
 *
 * ScrollTrigger only reports progress. A single rAF loop interpolates each
 * shape from hero-scatter to row-slot and composes the idle float into the
 * same transform, so the two never fight over one style property.
 */
const DESKTOP = { size: 118, rowScale: 0.86, rowGap: 232, rowY: 0.5 };
const COMPACT = { size: 58, rowScale: 0.9, rowGap: 0.2, rowY: 0.52 };

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

  const target = useRef(0);
  const smooth = useRef(0);

  const compactRef = useRef(compact);
  compactRef.current = compact;
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  // Scroll progress across the first ~viewport of scrolling. Reports only.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight * 0.9,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        target.current = self.progress;
      },
      onRefresh: (self) => {
        target.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  // One loop writes every transform.
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
      const m = compactRef.current ? COMPACT : DESKTOP;
      const still = reduceRef.current;

      if (still) {
        smooth.current = target.current;
      } else {
        smooth.current += (target.current - smooth.current) * 0.12;
        if (Math.abs(target.current - smooth.current) < 0.0004) {
          smooth.current = target.current;
        }
      }

      const p = smooth.current;
      const damp = still ? 0 : 1 - p;
      const t = now / 1000;
      const labelOpacity = smoothstep(0.62, 1, p);
      if (fieldRef.current) {
        fieldRef.current.style.setProperty("--assembled", String(labelOpacity));
      }

      // Row geometry: four slots centred on the viewport.
      const gap = compactRef.current ? view.w * (m.rowGap as number) : (m.rowGap as number);
      const rowY = view.h * m.rowY;

      for (let i = 0; i < NAV_ITEMS.length; i += 1) {
        const item = NAV_ITEMS[i];
        const shell = shellRefs.current[i];
        const plate = plateRefs.current[i];
        if (!shell) continue;

        const anchor = compactRef.current ? item.heroMobile : item.hero;
        const heroX = view.w * anchor.x;
        const heroY = view.h * anchor.y;

        const rowX = view.w / 2 + (item.rowOrder - (NAV_ITEMS.length - 1) / 2) * gap;

        // Idle motion lives in the hero and fades out as the shape converges.
        const bob = Math.sin(t * item.speed * 2 + item.phase) * 9 * damp;
        const sway = Math.cos(t * item.speed * 1.4 + item.phase) * 6 * damp;

        const x = lerp(heroX + sway, rowX, p);
        const y = lerp(heroY + bob, rowY, p);
        const scale = lerp(1, m.rowScale, p);

        shell.style.transform = `translate3d(${x - m.size / 2}px, ${
          y - m.size / 2
        }px, 0) scale(${scale})`;
        shell.style.setProperty("--lo", String(labelOpacity));

        if (plate) {
          if (still) {
            plate.style.transform = "";
          } else {
            const rx = Math.sin(t * item.speed * 1.7 + item.phase) * 9 * damp;
            const ry = Math.cos(t * item.speed * 1.3 + item.phase * 0.7) * 14 * damp;
            const rz = Math.sin(t * item.speed * 0.9 + item.phase * 1.4) * 4 * damp;
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
      {/* Scroll distance that drives the convergence; the shapes are fixed. */}
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
