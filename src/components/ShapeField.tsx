"use client";

import { useEffect, useRef } from "react";

import NavShape from "@/components/NavShape";
import { NAV_ITEMS } from "@/data/navItems";
import { CuttingAnimator } from "@/lib/cutting";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The four shapes as a fixed overlay, driven directly by scroll position.
 *
 * On load they stack in a single column down the right-hand side of the hero
 * poster, in the order they will end up in. As you scroll they converge —
 * smoothly, tied to scroll — into a centered, evenly-spaced row ("Four ways
 * in"), labels fading in as they line up, and hold there as the destination.
 * So the gesture is a column tipping over into a row: same four, same order,
 * turned through ninety degrees.
 *
 * v13.2 moved them here from four loose anchors scattered around the old ASCII
 * shirt. Those were placed against a garment that no longer exists, and two of
 * them sat over the poster's left-hand walking figure.
 *
 * The overlay is *pinned*, not permanently fixed: `.shape-field` is
 * `position: sticky` inside `.shape-track` (see `page.tsx`), so it holds at the
 * top of the viewport for the length of the track and then releases and scrolls
 * away with the page, like any other section. Sticky containment guarantees its
 * box can never extend past the track's bottom edge, which is exactly where the
 * material section starts — so it structurally cannot overlap what follows.
 * v12 needed an opacity fade plus `inert` to fake that; both are gone.
 *
 * Everything here writes viewport-space numbers, and that stays correct through
 * the release: while pinned, the field's box *is* the viewport, and once it
 * releases the shapes travel with the box they're positioned inside.
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

/**
 * The hero poster's box, mirrored from `.poster-hero` in `globals.css`.
 *
 * The scattered anchors are fractions of *this*, not of the viewport, because
 * the poster is a fixed-ratio drawing that is capped at 1920 and centred — so
 * on a wide monitor "the right side of the poster" and "the right side of the
 * window" are hundreds of pixels apart, and only the first one is meaningful.
 * The column would drift off the artwork exactly on the screens with the most
 * room to get it right.
 *
 * Top is 0: `.shape-under` pulls the hero to the top of the page and the field
 * is pinned at `top: 0`, so at the scroll position where these anchors are
 * actually on screen, the poster's top edge and the field's are the same line.
 *
 * `ratio` is width/height, matching the CSS `aspect-ratio` shorthand, and the
 * compact pair is the `max-width: 767px` branch — same query as `useIsCompact`.
 */
const POSTER = { maxW: 1920, ratio: 1920 / 900, compactRatio: 4 / 5 };
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

      // Read once — every access can force the browser to flush layout.
      const scrolled = window.scrollY;
      const P = scrolled / vh;
      const converge = still ? 1 : smoothstep(0, 0.7, P);
      const t = now / 1000;
      const gap = isCompact ? view.w * COMPACT.rowGapFrac : DESKTOP.rowGap;
      const rowY = vh * m.rowY;

      // The poster's box, for the scattered anchors to hang off. The row they
      // converge into stays viewport-centred — that one is a navigation bar,
      // not part of the picture.
      // `max-width` is lifted on the compact branch, so only desktop caps.
      const posterW = isCompact ? view.w : Math.min(view.w, POSTER.maxW);
      const posterH = posterW / (isCompact ? POSTER.compactRatio : POSTER.ratio);
      const posterLeft = (view.w - posterW) / 2;

      /**
       * Viewport y of the poster's light ground where it ends — the top of the
       * bottom black bar, not the bottom of the poster, so a shape crossing the
       * bar has already flipped by the time it is over black. Shapes above this
       * line are on a light ground and must stay ink; below it they are over
       * the void and must be paper. See `--ink` in `globals.css`.
       */
      const groundEnd = posterH * (isCompact ? 0.98 : 0.97111) - scrolled;

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
      const parallaxScale = 1 - converge * 0.65; // strongest while scattered

      if (fieldRef.current) {
        fieldRef.current.style.setProperty("--assembled", String(converge));
      }

      /**
       * The cutting backdrop belongs to the shape row, so it is keyed to the
       * poster clearing the viewport — not to `converge`, which starts rising
       * on the very first pixel of scroll and so had the scissors drawing
       * across the photograph while it was still on screen. The row finishes
       * assembling at scrollY = 0.7 * vh, well before this ramp opens, so by
       * the time anything is being cut the four are already in place under
       * "Four ways in".
       */
      const cutting = smoothstep(posterH * 0.9, posterH * 1.3, scrolled);

      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, view.w, view.h);
        cuttingRef.current?.draw(ctx, view.w, view.h, now, null, cutting, still);
      }

      for (let i = 0; i < NAV_ITEMS.length; i += 1) {
        const item = NAV_ITEMS[i];
        const shell = shellRefs.current[i];
        const plate = plateRefs.current[i];
        if (!shell) continue;

        const anchor = isCompact ? item.heroMobile : item.hero;
        const heroX = posterLeft + posterW * anchor.x;
        const heroY = posterH * anchor.y;
        const rowX = view.w / 2 + (item.rowOrder - (NAV_ITEMS.length - 1) / 2) * gap;

        const floatAmt = still ? 0 : 1 - converge;
        const bob = Math.sin(t * item.speed * 2 + item.phase) * BOB * floatAmt;
        const sway = Math.cos(t * item.speed * 1.4 + item.phase) * SWAY * floatAmt;

        const depth = DEPTHS[i % DEPTHS.length];
        const parX = px * PARALLAX * depth * parallaxScale;
        const parY = py * PARALLAX * depth * parallaxScale;

        const x = lerp(heroX + sway, rowX, converge) + parX;
        const y = lerp(heroY + bob, rowY, converge) + parY;
        const scale = lerp(1, m.rowScale, converge);

        shell.style.transform = `translate3d(${x - m.size / 2}px, ${y - m.size / 2}px, 0) scale(${scale})`;
        shell.style.setProperty("--lo", String(converge));
        // 1 on the poster's light ground, 0 over the void. The band is narrow
        // so the flip reads as a flip rather than a fade through flat grey.
        shell.style.setProperty(
          "--ink",
          String(1 - smoothstep(groundEnd - 46, groundEnd + 14, y)),
        );

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
    <nav ref={fieldRef} className="shape-field" aria-label="Explore">
      <canvas ref={canvasRef} className="shape-field-cutting" aria-hidden="true" />
      <p className="shape-field-eyebrow">Four ways in</p>

      {/* Lowers itself into the room as the shapes line up. Opacity and drop
          are both read from `--assembled` in CSS — the same 0..1 the eyebrow
          uses — so it costs nothing per frame and can't drift out of sync
          with the row. The sway is on the artwork inside, because this
          element's transform is already spoken for by the drop. */}
      <span className="shape-spider" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decor/spider-hanging.png" alt="" className="shape-spider-art" />
      </span>

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
  );
}
