"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { DESIGNS } from "@/data/designs";
import { useCoarsePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The shop as a ransacked contact sheet.
 *
 * Two states, one control — the same grammar as the hero's ASCII/View toggle.
 *
 *   RIOT  — the catalogue thrown across the table. Cards sit on a scattered
 *           collage: rotated, offset, overlapping, on five depth layers. Each
 *           card is a real 3D plate (perspective on the slot, preserve-3d on
 *           the plate) that tilts toward the cursor, with an ember echo pushed
 *           back in Z and the accession tags floating in front of it. Tilt the
 *           card and the layers separate — that parallax is the mock-up.
 *   ORDER  — every scatter variable collapses to zero and it settles back into
 *           the archival grid the route shipped with. Nothing is destroyed;
 *           the chaos is a transform you can undo.
 *
 * Scatter is *deterministic*, never Math.random(): a seeded integer hash keyed
 * by index, computed at module scope so server and client render byte-identical
 * markup. Random here would hydrate-mismatch on every load.
 *
 * The transform split matters. `.riot-slot` carries the scatter (CSS custom
 * properties, so toggling a class animates it via transition). `.riot-plate`
 * carries the tilt (GSAP writes to it). Two elements, two owners — they never
 * fight over one transform string.
 */

/** Integer hash → 0..1. Deterministic across engines, unlike Math.sin tricks. */
function hash(n: number): number {
  let h = Math.imul(n + 1, 2654435761);
  h ^= h >>> 15;
  h = Math.imul(h, 2246822519);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

const spread = (seed: number, amount: number) => (hash(seed) * 2 - 1) * amount;

/**
 * Depth as a *rank*, not a raw hash. Hashing depth directly clustered five
 * cards onto three layers and wasted the extremes; ranking the hashes gives a
 * deterministic permutation that always uses the full 0..n-1 spread, however
 * many designs the catalogue grows to.
 */
const DEPTH_RANK = DESIGNS.map((_, i) => i)
  .sort((a, b) => hash(a * 7 + 3) - hash(b * 7 + 3))
  .reduce<number[]>((acc, idx, rank) => {
    acc[idx] = rank;
    return acc;
  }, []);

const LAST = Math.max(1, DESIGNS.length - 1);

/**
 * Per-card scatter. Depth drives z-index and translateZ together so the layers
 * read as distance rather than as arbitrary overlap.
 *
 * Lean alternates by index with a hashed magnitude. A pure hash let three
 * neighbours tip the same way, which reads as a sloppy grid rather than as a
 * thrown stack — the eye needs the cards to disagree with each other.
 */
const SCATTER = DESIGNS.map((design, i) => {
  const depth = DEPTH_RANK[i]; // 0 = furthest, n-1 = nearest
  const lean = i % 2 === 0 ? 1 : -1;
  return {
    id: design.id,
    rot: lean * (4 + hash(i * 3 + 1) * 5), // 4°..9°, alternating
    dx: spread(i * 5 + 2, 14), // %
    dy: -lean * (6 + hash(i * 11 + 4) * 12), // % — counter to the lean
    scale: 0.9 + hash(i * 13 + 6) * 0.24,
    lift: 20 + (depth / LAST) * 104, // px of translateZ
    depth,
    tapeRot: spread(i * 17 + 8, 14),
    tagRot: spread(i * 19 + 9, 6),
  };
});

/** Peak tilt in degrees at the corners of a card. */
const TILT = 15;

export default function ShopChaos() {
  const [riot, setRiot] = useState(true);

  const reduceMotion = usePrefersReducedMotion();
  const coarse = useCoarsePointer();

  const plateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quick = useRef<
    ({ rx: (v: number) => void; ry: (v: number) => void } | null)[]
  >([]);

  // Tilt is a pointer affordance: pointless on touch, unwanted under reduced
  // motion. In both cases we simply never build the tweens.
  const tiltable = !reduceMotion && !coarse && riot;

  useEffect(() => {
    if (!tiltable) {
      quick.current = [];
      return;
    }

    const plates = plateRefs.current;
    quick.current = plates.map((el) =>
      el
        ? {
            rx: gsap.quickTo(el, "rotationX", { duration: 0.55, ease: "power3.out" }),
            ry: gsap.quickTo(el, "rotationY", { duration: 0.55, ease: "power3.out" }),
          }
        : null,
    );

    return () => {
      const live = plates.filter(Boolean) as HTMLDivElement[];
      gsap.killTweensOf(live);
      gsap.set(live, { rotationX: 0, rotationY: 0 });
    };
  }, [tiltable]);

  const onMove = useCallback(
    (i: number) => (e: React.PointerEvent<HTMLElement>) => {
      const q = quick.current[i];
      if (!q) return;
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      q.ry(px * TILT * 2);
      q.rx(-py * TILT * 2);
    },
    [],
  );

  const onLeave = useCallback(
    (i: number) => () => {
      const q = quick.current[i];
      if (!q) return;
      q.rx(0);
      q.ry(0);
    },
    [],
  );

  return (
    <section className={riot ? "riot riot-on" : "riot"} aria-label="Catalogue">
      <div className="riot-bar">
        <button
          type="button"
          onClick={() => setRiot((v) => !v)}
          className="riot-toggle"
          aria-pressed={riot}
        >
          {riot ? "Order" : "Riot"}
        </button>
        <p className="riot-hint">
          {riot
            ? "Five studies, thrown across the table."
            : "Five studies, filed back into the drawer."}
        </p>
      </div>

      <Ticker />

      <div className="riot-field">
        {DESIGNS.map((design, i) => {
          const s = SCATTER[i];
          return (
            <article
              key={design.id}
              className="riot-slot"
              style={
                {
                  "--rot": `${s.rot}deg`,
                  "--dx": `${s.dx}%`,
                  "--dy": `${s.dy}%`,
                  "--scale": s.scale,
                  "--lift": `${s.lift}px`,
                  "--tape-rot": `${s.tapeRot}deg`,
                  "--tag-rot": `${s.tagRot}deg`,
                  zIndex: s.depth + 1,
                } as React.CSSProperties
              }
              onPointerMove={tiltable ? onMove(i) : undefined}
              onPointerLeave={tiltable ? onLeave(i) : undefined}
            >
              <div
                className="riot-plate"
                ref={(el) => {
                  plateRefs.current[i] = el;
                }}
              >
                {/* Pushed back in Z: tilt the plate and this drifts against the
                    shirt, which is what sells the depth. Decorative. */}
                <div className="riot-echo" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={design.photo} alt="" draggable={false} />
                </div>

                <div className="riot-shirt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={design.photo}
                    alt={`${design.name}, catalogue ${design.cat}`}
                    draggable={false}
                  />
                </div>

                {/* Sheen rides the plate surface so the card reads as a
                    physical, lit object rather than a flat sticker. */}
                <div className="riot-sheen" aria-hidden="true" />

                <span className="riot-tape" aria-hidden="true">
                  N.O.A.X
                </span>

                <div className="riot-tag">
                  <span className="riot-cat">CAT. {design.cat}</span>
                  <span className="riot-name">{design.name}</span>
                  <span className="riot-ed">ED. {design.edition}</span>
                </div>
              </div>

              <p className="riot-blurb">{design.blurb}</p>
            </article>
          );
        })}
      </div>

      <Ticker reverse />
    </section>
  );
}

/**
 * Mono ticker strips top and bottom. Pure CSS translation on a duplicated
 * track, so it costs one composited layer and stops dead under
 * prefers-reduced-motion (see `.riot-ticker-track` in globals.css).
 */
function Ticker({ reverse = false }: { reverse?: boolean }) {
  const line = DESIGNS.map((d) => `CAT.${d.cat} ${d.study} / ED.${d.edition}`).join(
    "  —  ",
  );

  return (
    <div className={reverse ? "riot-ticker riot-ticker-rev" : "riot-ticker"} aria-hidden="true">
      <div className="riot-ticker-track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}
