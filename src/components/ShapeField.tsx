"use client";

import { useEffect, useRef } from "react";

import NavShape from "@/components/NavShape";
import { NAV_ITEMS } from "@/data/navItems";
import { CuttingAnimator } from "@/lib/cutting";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The four shapes as a fixed overlay, driven directly by scroll position.
 *
 * On load they sit scattered around the shirt at their loose hero anchors. As
 * you scroll they converge — smoothly, tied to scroll — into a centered,
 * evenly-spaced row ("Four ways in"), labels fading in as they line up, and
 * rest there as the destination.
 *
 * On desktop the shapes also drift on independent depths in response to the
 * cursor (a small parallax), layered on top of the idle rotation — strongest
 * while they're scattered, calmer once they've lined up.
 *
 * Progress is read straight from window.scrollY / viewport height (Lenis keeps
 * that accurate), so it's deterministic. One rAF loop writes every transform.
 */
const DESKTOP = { size: 118, rowScale: 0.9, rowGap: 224, rowY: 0.5 };
const COMPACT = { size: 58, rowScale: 0.92, rowGapFrac: 0.2, rowY: 0.5 };
const PARALLAX = 26; // px peak cursor-driven drift
const DEPTHS = [1.15, 0.7, 1.35, 0.85]; // per-shape depth, aligned to NAV_ITEMS

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const SHOP_INDEX = NAV_ITEMS.findIndex((item) => item.id === "shop");

export default function ShapeField() {
  const compact = useIsCompact();
  const reduceMotion = usePrefersReducedMotion();

  const fieldRef = useRef<HTMLElement | null>(null);
  const shellRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const plateRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cuttingRef = useRef<CuttingAnimator | null>(null);

  const compactRef = useRef(compact);
  compactRef.current = compact;
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  const cursor = useRef({ x: 0.5, y: 0.5 });
  const cursorSmooth = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursor.current = {
        x: e.clientX / (window.innerWidth || 1),
        y: e.clientY / (window.innerHeight || 1),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    let frame = 0;
    const view = { w: window.innerWidth, h: window.innerHeight };
    if (!cuttingRef.current) cuttingRef.current = new CuttingAnimator();

    const ctx = canvasRef.current?.getContext("2d") ?? null;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const measure = () => {
      view.w = window.innerWidth;
      view.h = window.innerHeight;
      const canvas = canvasRef.current;
      if (canvas && ctx) {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.ceil(view.w * dpr);
        canvas.height = Math.ceil(view.h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure);

    const draw = (now: number) => {
      const still = reduceRef.current;
      const isCompact = compactRef.current;
      const m = isCompact ? COMPACT : DESKTOP;
      const vh = view.h || 1;

      const P = window.scrollY / vh;
      const converge = still ? 1 : smoothstep(0, 0.7, P);
      const t = now / 1000;
      const gap = isCompact ? view.w * COMPACT.rowGapFrac : DESKTOP.rowGap;
      const rowY = vh * m.rowY;

      // Cursor parallax (desktop only), eased toward the pointer.
      const parallaxOn = !isCompact && !still;
      const cs = cursorSmooth.current;
      if (parallaxOn) {
        cs.x += (cursor.current.x - cs.x) * 0.06;
        cs.y += (cursor.current.y - cs.y) * 0.06;
      } else {
        cs.x = 0.5;
        cs.y = 0.5;
      }
      const px = (cs.x - 0.5) * 2;
      const py = (cs.y - 0.5) * 2;
      const parallaxScale = 1 - converge * 0.65; // strongest while scattered

      if (fieldRef.current) {
        fieldRef.current.style.setProperty("--assembled", String(converge));
      }

      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, view.w, view.h);
        const shopShell = SHOP_INDEX >= 0 ? shellRefs.current[SHOP_INDEX] : null;
        const excludeRect = shopShell ? shopShell.getBoundingClientRect() : null;
        cuttingRef.current?.draw(ctx, view.w, view.h, now, excludeRect, converge, still);
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

        const floatAmt = still ? 0 : 1 - converge;
        const bob = Math.sin(t * item.speed * 2 + item.phase) * 9 * floatAmt;
        const sway = Math.cos(t * item.speed * 1.4 + item.phase) * 6 * floatAmt;

        const depth = DEPTHS[i % DEPTHS.length];
        const parX = px * PARALLAX * depth * parallaxScale;
        const parY = py * PARALLAX * depth * parallaxScale;

        const x = lerp(heroX + sway, rowX, converge) + parX;
        const y = lerp(heroY + bob, rowY, converge) + parY;
        const scale = lerp(1, m.rowScale, converge);

        shell.style.transform = `translate3d(${x - m.size / 2}px, ${y - m.size / 2}px, 0) scale(${scale})`;
        shell.style.setProperty("--lo", String(converge));

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
      {/* Scroll distance to reach and hold the assembled row. */}
      <div className="shape-spacer" aria-hidden="true" />

      <nav ref={fieldRef} className="shape-field" aria-label="Explore">
        <canvas ref={canvasRef} className="shape-field-cutting" aria-hidden="true" />
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
