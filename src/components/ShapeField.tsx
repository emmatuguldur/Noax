"use client";

import { useEffect, useRef } from "react";

import NavShape from "@/components/NavShape";
import { NAV_ITEMS } from "@/data/navItems";
import { CuttingAnimator } from "@/lib/cutting";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The four shapes, as an ordinary section of the page.
 *
 * A centred, evenly-spaced row under "Four ways in". It is always there — you
 * reach it by scrolling to it, the same as any other section. Flexbox lays the
 * row out (see `.shape-row`); the only thing this component does is add the
 * small motion on top.
 *
 * Three rounds of subtraction got it here, and the order is worth knowing:
 * v24 took the shapes off the hero, which removed the journey they used to
 * make; v25 removed the scroll-triggered entrance, which removed the arrival.
 * With neither a journey nor an arrival there was nothing left to pin, so the
 * sticky overlay and its scaffolding (`.shape-track`, `.shape-under`'s
 * `-100svh`, `.shape-rail`) went too — along with scroll position, convergence,
 * `--reveal`, `--assembled` and `--lo`. The row can no longer appear over the
 * hero by construction rather than by a gate someone has to maintain.
 *
 * What is left is what was asked to stay: a slow idle drift and an independent
 * per-shape lean toward the cursor. One rAF loop writes both, as an offset from
 * wherever layout has already put each shape — so a dropped frame costs a nudge
 * rather than a position.
 */
const DESKTOP = { size: 106 };
const COMPACT = { size: 53 };

/**
 * Idle and cursor motion, v18: roughly a third of what it was.
 *
 * The shapes used to be lively — they were competing with an ASCII dissolve
 * for attention. Against a still photograph they only needed to not be dead,
 * and anything more read as fidgeting. Every amplitude below is tuned to be
 * noticed only if you look for it: the drift should register as the page
 * breathing, never as something moving.
 *
 * `FOLLOW` is the cursor easing. Lowering it does double duty — the shapes
 * both travel less far (PARALLAX) and take longer to get there, so a flick of
 * the mouse produces a slow lean rather than a snap.
 */
const PARALLAX = 9; // px peak cursor-driven drift (was 26)
const FOLLOW = 0.035; // cursor easing per frame (was 0.06)
const BOB = 3; // px vertical idle travel (was 9)
const SWAY = 2; // px horizontal idle travel (was 6)
const TILT = { x: 3, y: 4.5, z: 1.5 }; // deg idle rotation (was 9 / 14 / 4)
const DEPTHS = [1.15, 0.7, 1.35, 0.85]; // per-shape depth, aligned to NAV_ITEMS

export default function ShapeField() {
  const compact = useIsCompact();
  const reduceMotion = usePrefersReducedMotion();

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
      const t = now / 1000;

      // Cursor parallax (desktop only), eased toward the pointer.
      const parallaxOn = !isCompact && !still;
      const cs = cursorSmooth.current;
      if (parallaxOn) {
        cs.x += (cursor.current.x - cs.x) * FOLLOW;
        cs.y += (cursor.current.y - cs.y) * FOLLOW;
      } else {
        cs.x = 0.5;
        cs.y = 0.5;
      }
      const px = (cs.x - 0.5) * 2;
      const py = (cs.y - 0.5) * 2;

      // The backdrop is simply on whenever the section is. It used to be ramped
      // by scroll to keep it off the hero; the section being its own box in
      // normal flow does that job now, and does it exactly.
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, view.w, view.h);
        cuttingRef.current?.draw(ctx, view.w, view.h, now, null, 1, still);
      }

      for (let i = 0; i < NAV_ITEMS.length; i += 1) {
        const item = NAV_ITEMS[i];
        const shell = shellRefs.current[i];
        const plate = plateRefs.current[i];
        if (!shell) continue;

        // v18 amplitudes, unchanged — tuned to be noticed only if you look for
        // them. These are offsets from the position flexbox has already given
        // the shape, not the position itself.
        const floatAmt = still ? 0 : 1;
        const bob = Math.sin(t * item.speed * 2 + item.phase) * BOB * floatAmt;
        const sway = Math.cos(t * item.speed * 1.4 + item.phase) * SWAY * floatAmt;

        const depth = DEPTHS[i % DEPTHS.length];
        const parX = px * PARALLAX * depth;
        const parY = py * PARALLAX * depth;

        shell.style.transform = `translate3d(${sway + parX}px, ${bob + parY}px, 0)`;

        if (plate) {
          if (still) {
            plate.style.transform = "";
          } else {
            const rx = Math.sin(t * item.speed * 1.7 + item.phase) * TILT.x * floatAmt;
            const ry = Math.cos(t * item.speed * 1.3 + item.phase * 0.7) * TILT.y * floatAmt;
            const rz = Math.sin(t * item.speed * 0.9 + item.phase * 1.4) * TILT.z * floatAmt;
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
    <nav className="shape-field" aria-label="Explore">
      <canvas ref={canvasRef} className="shape-field-cutting" aria-hidden="true" />
      <p className="shape-field-eyebrow">Four ways in</p>

      {/* A detail beside the row, hanging from the top of the section. Its two
          idle loops live on the artwork inside, so this element's own transform
          stays free. */}
      <span className="shape-spider" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decor/spider-hanging.png" alt="" className="shape-spider-art" />
      </span>

      <div className="shape-row">
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
      </div>
    </nav>
  );
}
