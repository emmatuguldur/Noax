"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import AsciiRenderer from "@/components/AsciiRenderer";
import { DESIGNS, frontOf } from "@/data/designs";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The arrival.
 *
 * Every design enters the same way: the grid types itself on, holds a beat,
 * then dissolves — and the photograph it was sampled from is underneath it the
 * whole time. The machine reading of the garment resolves into the garment.
 * That single gesture is the thesis, and nobody has to click to see it.
 *
 * It plays on load and again on every design the arrow brings in, so the
 * catalogue reads as a series of arrivals rather than one and then a stack of
 * stills. It does *not* replay when the visitor works the toggle themselves —
 * see `autoReveal`.
 *
 * The toggle survives as the way back: press it and the grid retypes. Going
 * forward again replays the dissolve; going back is immediate, because a 1.3s
 * ceremony every time you poke a button stops being cinema and starts being a
 * wait.
 */
type Mode = "ascii" | "photo";

const SLIDE_MS = 620;

/**
 * How long a grid sits there before it lets go. The renderer's default type-on
 * is 420ms, so this leaves the finished grid complete and readable for roughly
 * half a second — long enough to be a beat, short enough not to be a wait.
 */
const AUTO_REVEAL_MS = 1000;
/**
 * Ceiling on the whole arrival, and the only reason the photograph ever appears
 * without either a timer or a click behind it. The dissolve can only run once
 * the grid has been sampled, which waits on the image decoding *and*
 * `document.fonts.ready` — so a cold load, a slow network, or a photo that 404s
 * leaves the ceremony with nothing to play, and the stage showing nothing at
 * all: the ASCII layer is transparent until it has a grid, and the photograph
 * beneath is held at zero for as long as ASCII is the active mode. Lands the
 * garment regardless. The rendering is a nicety; the product is not.
 */
const REVEAL_CEILING_MS = 5200;

export default function ShirtDisplay() {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("ascii");
  const [dissolving, setDissolving] = useState(false);
  /**
   * True while an arrival is pending — set on mount and again on every design
   * change, cleared the moment the visitor drives the toggle themselves. Only
   * an arrival reveals itself; once you've taken the control it stays yours.
   */
  const [autoReveal, setAutoReveal] = useState(true);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const reduceMotion = usePrefersReducedMotion();
  const compact = useIsCompact();

  // A phone stage is a few hundred px wide; 108 columns there renders sub-4px
  // type, so drop the resolution on small screens.
  const cols = compact ? 72 : 108;

  const design = DESIGNS[index];
  const next = DESIGNS[(index + 1) % DESIGNS.length];
  const asciiActive = mode === "ascii";

  /** Lands on the photograph, from wherever the stage was. */
  const settle = useCallback(() => {
    setDissolving(false);
    setMode("photo");
    stageRef.current?.style.setProperty("--dissolve", "1");
  }, []);

  /**
   * Per-frame dissolve progress. Written straight to a CSS custom property —
   * this fires ~60×/s and must never touch React state. The photo's opacity
   * and the light bloom both read `--dissolve`, so one number drives the whole
   * arrival without a single re-render.
   */
  const onDissolveProgress = useCallback((progress: number) => {
    stageRef.current?.style.setProperty("--dissolve", String(progress));
  }, []);

  /**
   * The arrival clock. Re-arms on `index` as well as on `autoReveal`, because
   * cycling designs leaves both `mode` and the flag already where this effect
   * wants them — without `index` in the deps the second design would sit on its
   * grid forever.
   *
   * Nothing cancels this but the visitor taking the toggle. Hovering the grid
   * to push the characters around is interaction with the *rendering*, not a
   * request to keep it, so the physics and this clock simply run concurrently.
   */
  useEffect(() => {
    if (!autoReveal || mode !== "ascii") return;
    if (reduceMotion) {
      settle(); // the whole gesture is motion; there's nothing to show instead
      return;
    }
    const timer = setTimeout(() => setDissolving(true), AUTO_REVEAL_MS);
    const guard = setTimeout(settle, REVEAL_CEILING_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(guard);
    };
  }, [autoReveal, mode, index, reduceMotion, settle]);

  /**
   * `settle` parks `--dissolve` at 1, and the property outlives the transition
   * that wrote it. Re-zero it on the way back into ASCII: the next forward
   * dissolve sets `dissolving` a frame before the rAF loop writes its first
   * progress value, and a stale 1 in that gap flashes the whole photograph.
   */
  useEffect(() => {
    if (mode === "ascii") stageRef.current?.style.setProperty("--dissolve", "0");
  }, [mode, index]);

  const advance = useCallback(() => {
    setOutgoing(index);
    setIndex((current) => (current + 1) % DESIGNS.length);
    // A new design arrives the way the first one did — back to the grid, and
    // the clock above re-arms off the index change.
    setMode("ascii");
    setDissolving(false);
    setAutoReveal(true);
    if (slideTimer.current) clearTimeout(slideTimer.current);
    slideTimer.current = setTimeout(() => setOutgoing(null), reduceMotion ? 0 : SLIDE_MS);
  }, [index, reduceMotion]);

  useEffect(() => {
    return () => {
      if (slideTimer.current) clearTimeout(slideTimer.current);
    };
  }, []);

  // Nothing outside this component writes `mode`, so the render closure is a
  // safe read — `toggle` is rebuilt every render and always sees current state.
  const toggle = () => {
    // Taking the control keeps it: from here the stage waits to be told, until
    // the arrow brings in a design that hasn't been seen yet.
    setAutoReveal(false);

    if (mode === "photo") {
      setMode("ascii"); // straight back to the grid, and it retypes
      return;
    }
    if (reduceMotion) {
      setMode("photo");
      return;
    }
    setDissolving(true); // forward replays the dissolve
  };

  // While the grid is letting go, the photo's opacity is the dissolve progress
  // itself; outside of that it's a plain crossfade.
  const photoOpacity = dissolving ? "var(--dissolve, 0)" : asciiActive ? 0 : 1;

  return (
    <div className="shirt-block">
      <div className="shirt-stage" ref={stageRef} data-dissolving={dissolving || undefined}>
        {/* Light the piece arrives into. Dim while the page is still "reading"
            the garment, full once the cloth is actually there. */}
        <div
          className="shirt-bloom"
          aria-hidden="true"
          style={{ opacity: dissolving ? "var(--dissolve, 0)" : asciiActive ? 0.2 : 1 }}
        />

        {outgoing !== null && outgoing !== index && (
          <div key={`out-${outgoing}`} className="shirt-layer slide-out" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frontOf(DESIGNS[outgoing])} alt="" className="shirt-photo" />
          </div>
        )}

        <div
          key={`in-${index}`}
          className={outgoing !== null ? "shirt-layer slide-in" : "shirt-layer"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frontOf(design)}
            alt={`${design.name}, catalogue ${design.cat}`}
            className="shirt-photo"
            style={{
              opacity: photoOpacity,
              // Settles the last fraction into place as it resolves, so the
              // garment arrives rather than simply appearing.
              transform: dissolving
                ? "scale(calc(1.035 - 0.035 * var(--dissolve, 0)))"
                : undefined,
              // The rAF loop owns opacity during the dissolve; a CSS
              // transition on top of it would lag and fight.
              transition: dissolving ? "none" : undefined,
            }}
            draggable={false}
          />
          <AsciiRenderer
            src={frontOf(design)}
            active={asciiActive}
            cols={cols}
            className="ascii-layer"
            dissolving={dissolving}
            onDissolveProgress={onDissolveProgress}
            onDissolveEnd={settle}
          />
        </div>

        <button
          type="button"
          onClick={advance}
          className="arrow-next"
          aria-label={`Next print (${next.name})`}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h13M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="shirt-controls">
        <button type="button" onClick={toggle} className="view-toggle">
          {asciiActive ? "View" : "ASCII"}
        </button>

        <p className="shirt-meta">
          <span className="cat-tag">[ CATALOGUE NO. {design.cat} ]</span>
          <span className="cat-sep" aria-hidden="true">—</span>
          <span className="cat-tag">[ EDITION: {design.edition} ]</span>
          <span className="cat-sep" aria-hidden="true">—</span>
          <span className="cat-tag">[ MEDIUM: {design.medium} ]</span>
        </p>

        <div className="frieze" aria-hidden="true">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <defs>
              <pattern id="noux-frieze" width="10" height="4" patternUnits="userSpaceOnUse">
                <path
                  d="M5 0.4 L9 2 L5 3.6 L1 2 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#noux-frieze)" />
          </svg>
        </div>

        <div className="pip-row" aria-hidden="true">
          {DESIGNS.map((item, i) => (
            <span key={item.id} className={i === index ? "pip pip-on" : "pip"} />
          ))}
        </div>
      </div>
    </div>
  );
}
