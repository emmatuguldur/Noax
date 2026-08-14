"use client";

import { useEffect, useRef } from "react";

import { HERO_POLAROIDS } from "@/data/heroPolaroids";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The record and its prints, clustered against the hero's left edge.
 *
 * The wheel turns the ring — but only while the cursor is on or near the
 * cluster, and while it is, the page is held still so the prints can be looked
 * at rather than scrolled past. Outside that zone nothing is intercepted and
 * the page scrolls normally. Everything else here is a function of
 * `HERO_POLAROIDS.length`; see `heroPolaroids.ts` for why that matters and how
 * the set grows to five.
 *
 * The lock is wheel-only by design. Keyboard scrolling (space, PgDn, arrows)
 * is deliberately left alone, so there is always a way past the cluster that
 * does not involve moving the mouse.
 *
 * ---------------------------------------------------------------------------
 * Why the record does not turn
 *
 * `public/hero/vinyl.png` is the right *half* of a record — measured, its disc
 * centre is (349, 320) with a radius of 230, and the artwork is cut flat at
 * x=346, three pixels shy of that centre. The cluster hangs off the left edge
 * again in v30, so that cut sits at x=-23 where `.poster-hero`'s `overflow:
 * hidden` swallows it. v29's mirrored second half — added only because the
 * cluster was briefly inboard, and the reason the label read backwards — is
 * gone with it.
 *
 * Turning it is still off the table: a half disc would swing its straight edge
 * into frame. So the record is a still image behind an invisible pivot, and
 * only the cards orbit.
 *
 * It carries its own alpha (85.6% of the file is transparent), so there is no
 * background to knock out and no mask here doing it — the round edge is the
 * file's own.
 *
 * ---------------------------------------------------------------------------
 * Why a rAF loop and not GSAP ScrollTrigger
 *
 * ScrollTrigger is not used anywhere in this repo — `gsap` is here for
 * `ShopChaos`'s pointer tilt and nothing else. The house pattern for continuous
 * motion is a rAF loop writing `style.transform` directly (`ShapeField`), and
 * this interaction is a pointer gate over a scroll delta, which ScrollTrigger
 * has no notion of anyway.
 *
 * ---------------------------------------------------------------------------
 * The conveyor
 *
 * The cards are not glued to a disc. They sit at a fixed angular PITCH from
 * each other and the ring wraps at `n * PITCH`, so a card leaving the top
 * re-enters at the bottom. That is what keeps the *spacing* constant as the set
 * grows: `360 / n` would have re-spaced the whole cluster the day CAT. 04 was
 * photographed, silently. Because the wrap point is `n * PITCH / 2`, the
 * fade-out at one seam is the fade-in at the other by construction.
 */

/**
 * Degrees between neighbouring prints.
 *
 * Solved from the reference rather than chosen. Calibrating against the top
 * bar (100 of 920 design px, ~52px in the reference) gives 1.923 design px per
 * reference px, which puts the three card centres at (170, 292), (284, 486) and
 * (186, 692). Fitting a ring to those:
 *
 *     cx + R           = 284        (the front card)
 *     cx + R * cos t   = 178        (the mean of the outer two)
 *     R * sin t        = 200        (half their vertical separation)
 *
 * gives t ~ 45deg and R ~ 285 about a pivot near (-20, 492) — which is the
 * geometry in `globals.css`. At that radius the cards sit ~200px apart against
 * a 181px card, so they very nearly do not overlap. That is what the reference
 * shows, and it supersedes v30's "thin sliver" reading.
 */
const PITCH = 45;
/**
 * Degrees of ring rotation per pixel of wheel delta, while the cursor is near.
 * A typical notch is ~100px, so about 16deg — a little under three notches to
 * bring the next print to the front at the 45deg PITCH below.
 */
const SENS = 0.16;
/** Lerp per 60fps frame. Low enough to overshoot the eye and settle. */
const DAMP = 0.09;
/**
 * How much of the ring angle each card keeps: 0 stays level, 1 is welded on.
 * Low, because PITCH is now 45deg — at v30's 0.3 the outer cards would lean
 * 13.5deg apart from the middle one before their own tilt was even added, and
 * the reference has all three leaning the same way within a few degrees.
 */
const MOUNT = 0.12;
/**
 * Static per-card lean, in degrees, indexed modulo so it survives the set
 * growing to five. The cards are square-cut rectangles — measured, not
 * assumed — so every degree of tilt in the composition comes from here and
 * from MOUNT above.
 *
 * Chosen against the ring's own contribution so that at rest the three land at
 * about +5.6, +7 and +9.4 degrees, top to bottom: all leaning right, as the
 * reference has them, but no two alike.
 */
const TILT = [7, 4, 11, 6, -5];
/**
 * How far past the rig box still counts as "near", as a fraction of its width.
 * A fraction rather than a pixel count because the whole composition scales
 * with the canvas.
 *
 * Cut from 0.55 to 0.18 in v28, and the reason is the scroll lock rather than
 * taste. While being near only turned a record, a generous zone cost nothing;
 * now it decides where on the page the wheel stops working. At 0.55 that region
 * was the left third of the hero at full height, which is a lot of page to
 * freeze. 0.18 is ~103px of slack around a cluster that runs x 0..360 — enough
 * to still catch a cursor heading for it, and it puts the captured region at
 * x 0..368, the left 19%.
 */
const NEAR_PAD = 0.18;
/** Degrees of turn that count as "they scrolled", retiring the hint. */
const USED_AT = 8;

const DEG = Math.PI / 180;

/** Fold an angle into [-half, half), which is the visible arc. */
function wrap(deg: number, period: number): number {
  const half = period / 2;
  const m = ((deg % period) + period) % period;
  return m > half ? m - period : m;
}

/**
 * Where a card sits, given its wrapped angle. Pure, and called from two places
 * — the server render seeds the rest state with it, then the loop re-runs it
 * every frame — so the first paint is already correct and there is no hydration
 * jump to hide.
 *
 * Stacking runs off distance from the front of the arc, so the two cards
 * nearest the seam sit *behind* the rest — which is what hides the wrap, since
 * a card is at zero opacity exactly when it jumps from one end to the other.
 * The `+ t` is a tie-break: without it the pair at equal distance either side
 * of centre would collide on the same z and be ordered by DOM position, which
 * is what made the third card look absent. The 20:1 weighting keeps the
 * tie-break from ever reordering cards that are genuinely at different depths.
 */
function poseAt(t: number, half: number, fade: number, tilt: number) {
  const near = 1 - Math.abs(t) / half; // 1 at the front of the arc, 0 at the seam
  return {
    x: Math.cos(t * DEG),
    y: Math.sin(t * DEG),
    rot: t * MOUNT + tilt,
    scale: 0.86 + 0.14 * near,
    opacity: Math.min(1, Math.max(0, (half - Math.abs(t)) / fade)),
    z: Math.round((half - Math.abs(t)) * 20 + t) + 100,
  };
}

export default function HeroVinyl() {
  const reduceMotion = usePrefersReducedMotion();
  /* Below 768px the whole cluster is `display: none` — the portrait crop has no
     left margin to hang it in, and a cursor-gated interaction has no meaning on
     a touch screen anyway. Same 767px both sides; change one, change both. */
  const compact = useIsCompact();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const n = HERO_POLAROIDS.length;
  const period = n * PITCH;
  const half = period / 2;
  /* Half a pitch of fade. At n=3 that puts the two flanking cards at exactly
     full opacity when the ring is at rest, which is how the artwork is drawn. */
  const fade = Math.min(PITCH * 0.5, half);

  useEffect(() => {
    const root = rootRef.current;
    const rig = rigRef.current;
    if (!root || !rig || n === 0 || reduceMotion || compact) return;

    const poster = rig.closest(".poster-hero");
    if (!(poster instanceof HTMLElement)) return;

    /* Radius is half the rig box by definition — the box is sized to the orbit
       in `globals.css`, so the two can never drift apart. */
    let radius = rig.clientWidth * 0.5;
    const measure = () => {
      radius = rig.clientWidth * 0.5;
    };
    const sized = new ResizeObserver(measure);
    sized.observe(rig);

    /* The cards' rest positions live in `left`/`top` (see the JSX below), so the
       loop writes only the *delta* from rest. Keeps every frame on the
       compositor and keeps the server render meaningful on its own. */
    const rest = HERO_POLAROIDS.map((_, i) => {
      const p = poseAt(wrap(i * PITCH, period), half, fade, 0);
      return { x: p.x, y: p.y };
    });

    const paint = (angle: number) => {
      for (let i = 0; i < n; i += 1) {
        const card = cardRefs.current[i];
        if (!card) continue;

        const t = wrap(i * PITCH + angle, period);
        const pose = poseAt(t, half, fade, TILT[i % TILT.length]);
        const dx = (pose.x - rest[i].x) * radius;
        const dy = (pose.y - rest[i].y) * radius;
        /* Percentages inside `translate` resolve against the element's own box,
           which is exactly what `nudgeX` is a fraction of. */
        const nudge = HERO_POLAROIDS[i].nudgeX;

        card.style.transform =
          `translate3d(calc(-50% + ${nudge}% + ${dx.toFixed(2)}px), calc(-50% + ${dy.toFixed(2)}px), 0)` +
          ` rotate(${pose.rot.toFixed(2)}deg) scale(${pose.scale.toFixed(3)})`;
        card.style.opacity = pose.opacity.toFixed(3);
        card.style.zIndex = String(pose.z);
      }
    };

    let pointerX = -1e6;
    let pointerY = -1e6;
    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    };
    /* A cursor that leaves the window should stop counting as near, or the ring
       keeps turning on a scroll the user is making somewhere else entirely. A
       null `relatedTarget` is the reliable "left the window" signal — the
       `pointerleave` equivalent does not bubble, so it never arrives here. */
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) {
        pointerX = -1e6;
        pointerY = -1e6;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });

    let target = 0;
    let angle = 0;
    let near = false;
    let wasNear = false;
    let used = false;
    let last = 0;
    let frame = 0;
    let live = true;

    /**
     * v28 drives the ring from the wheel itself rather than from scroll
     * position. It has to: the page is held still inside the zone now, so
     * `window.scrollY` never changes there and reading its delta would give a
     * ring that cannot turn at all.
     *
     * `deltaMode` is the catch — Firefox commonly reports lines, not pixels, and
     * a raw `deltaY` of 3 against Chrome's 100 would make the record crawl on
     * one browser and spin on the other.
     */
    const wheelPixels = (e: WheelEvent) => {
      if (e.deltaMode === 1) return e.deltaY * 16; // lines
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // pages
      return e.deltaY;
    };

    /**
     * The trap. Capture phase on `window`, which is what makes this work at all:
     * Lenis listens for `wheel` on `window` in the *bubble* phase, so it reads
     * `deltaY` and scrolls the page itself no matter how many times we call
     * `preventDefault`. A capture listener on the same node runs before the
     * event has travelled anywhere, and `stopPropagation` there ends the path
     * before Lenis's listener is ever reached. `preventDefault` then handles the
     * browser's own scrolling, which is also what does the work under
     * reduced-motion, where Lenis is not running.
     *
     * Lenis's documented opt-out (`data-lenis-prevent`) is no use here: it scans
     * the event's `composedPath`, and this cluster is `pointer-events: none`, so
     * it is never in it. `lenis.stop()` is no use either — it sets
     * `overflow: hidden` on the document, and with no `scrollbar-gutter` on this
     * site that removes the scrollbar and jumps the whole page sideways every
     * time the cursor crosses into the zone.
     */
    const onWheel = (e: WheelEvent) => {
      if (!near) return; // outside the zone, scrolling is none of our business
      /* Ctrl/Cmd + wheel is the browser's zoom, which is an accessibility
         control and not ours to swallow. */
      if (e.ctrlKey || e.metaKey) return;

      e.preventDefault();
      e.stopPropagation();
      target += wheelPixels(e) * SENS;
    };
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 1000 / 60;
      last = now;

      /* Reads first, writes after — one forced layout per frame, no thrash.
         The wheel handler reads this rather than measuring for itself, so the
         gate that decides whether scrolling is captured is the same one that
         lights the hint, one frame old at worst. */
      const box = rig.getBoundingClientRect();
      const pad = box.width * NEAR_PAD;
      near =
        pointerX >= box.left - pad &&
        pointerX <= box.right + pad &&
        pointerY >= box.top - pad &&
        pointerY <= box.bottom + pad;

      if (near !== wasNear) {
        wasNear = near;
        root.classList.toggle("is-near", near);
      }

      /* The word says "scroll", so it goes once you have. Keyed off the ring
         having actually turned rather than off the page moving: this is a local
         interaction, and a page scroll somewhere else is not the thing it asked
         for. Half a notch is the bar — one wheel notch is ~16deg — and it is a
         latch, because an instruction that comes back is nagging. */
      if (!used && Math.abs(target) > USED_AT) {
        used = true;
        root.classList.add("is-used");
      }

      angle += (target - angle) * (1 - Math.pow(1 - DAMP, dt / (1000 / 60)));
      if (Math.abs(target - angle) > 0.004) paint(angle);

      frame = live ? requestAnimationFrame(tick) : 0;
    };

    /* Nothing to compute while the hero is off-screen. Clearing `near` on the
       way out is not tidying: the loop is what maintains it, so without this a
       cursor parked in the zone when the hero scrolled away would leave the
       trap armed over a page that no longer has a record on it. */
    const seen = new IntersectionObserver(
      ([entry]) => {
        live = entry.isIntersecting;
        if (live && !frame) {
          last = 0;
          frame = requestAnimationFrame(tick);
        }
        if (!live) {
          near = false;
          wasNear = false;
          root.classList.remove("is-near");
        }
      },
      { rootMargin: "20% 0px" },
    );
    seen.observe(poster);

    frame = requestAnimationFrame(tick);

    return () => {
      live = false;
      near = false;
      if (frame) cancelAnimationFrame(frame);
      seen.disconnect();
      sized.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("wheel", onWheel, { capture: true });
      root.classList.remove("is-near", "is-used");
      /* Put the ring back where the markup says it is. React will not undo an
         inline style it did not write, so switching reduced-motion on (or
         crossing the compact breakpoint) would otherwise leave the last frame
         of the turn frozen on the page. */
      paint(0);
    };
  }, [n, period, half, fade, reduceMotion, compact]);

  if (n === 0) return null;

  return (
    <div className="hero-vinyl" ref={rootRef}>
      {/* The record, running off the left edge of the frame. Decorative — the
          cards carry the meaning, and this is what they are pinned to. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/vinyl.png"
        alt=""
        className="vinyl-disc"
        width={960}
        height={619}
        aria-hidden="true"
        draggable={false}
      />

      {/* The cards are the artwork, whole — no wrapper, because a wrapper is
          what a frame would be drawn on and these arrive already framed. */}
      <div className="vinyl-rig" ref={rigRef}>
        {HERO_POLAROIDS.map((print, i) => {
          const t = wrap(i * PITCH, period);
          const pose = poseAt(t, half, fade, TILT[i % TILT.length]);

          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={print.id}
              src={print.src}
              alt={print.alt}
              className="vinyl-polaroid"
              draggable={false}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                /* Rest position, in percent of the rig — the loop offsets from
                   here in px. Server-rendered, so the stack is right before
                   hydration and *is* the whole render under reduced motion. */
                left: `${50 + pose.x * 50}%`,
                top: `${50 + pose.y * 50}%`,
                transform:
                  `translate3d(calc(-50% + ${print.nudgeX}%), -50%, 0)` +
                  ` rotate(${pose.rot}deg) scale(${pose.scale})`,
                opacity: pose.opacity,
                zIndex: pose.z,
              }}
            />
          );
        })}
      </div>

      {/* The affordance. A cursor-gated interaction is invisible until you
          happen to put the pointer in the right place, so the mark says where.
          It brightens on `.is-near`, which is the loop confirming the gate is
          open — the hint and the state it advertises cannot drift apart. */}
      {/* Written on the record, so it reads as part of the label rather than as
          type set over it — which is why it is the one place on the site with a
          handwritten face. Decorative: "merch" is already the whole meaning of
          this section, and the cards beneath it carry their own alt text. */}
      <span className="vinyl-word" aria-hidden="true">
        merch
      </span>

      <div className="vinyl-hint">
        {/* The instruction. It goes once it has been followed — see `is-used`
            in `globals.css`. Hidden from assistive tech because the gesture it
            describes is a mouse wheel over a specific patch of the page, which
            is not an instruction a screen reader can act on. */}
        <span className="vinyl-hint-label" aria-hidden="true">
          scroll
        </span>

        {/* 48:57 — taller than wide, which is how the reference draws it: an arc
            falling from the upper left round to the right and down, with the
            head under it pointing back at the stack. */}
        <svg
          className="vinyl-hint-arrow"
          viewBox="0 0 48 57"
          aria-hidden="true"
          fill="none"
        >
          <path
            d="M4 4C31 8 45 24 37 46"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M28 37 37.5 48 46 35"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
