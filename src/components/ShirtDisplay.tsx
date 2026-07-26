"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import AsciiRenderer from "@/components/AsciiRenderer";
import { DESIGNS } from "@/data/designs";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The arrival.
 *
 * v8 turns the ASCII from a destination into an entrance. On first paint the
 * grid types itself on, holds a beat, then dissolves — and the photograph it
 * was sampled from is underneath it the whole time. The machine reading of the
 * garment resolves into the garment. That single gesture is the thesis, and it
 * also fixes the thing v2–v7 got backwards: the one real, photographed, tactile
 * asset on the page is now what you're left looking at, instead of something
 * you had to go and click "View" to find.
 *
 * The "View" toggle survives as the way back — press it and the grid retypes.
 * Going forward to the photo replays the dissolve; going back is immediate,
 * because a 1.3s ceremony every time you poke a button stops being cinema and
 * starts being a wait.
 *
 * Timings are mirrored by the hero's CSS choreography (`--t-*` in globals.css).
 * Change them here and change them there.
 */
type Mode = "ascii" | "photo";

const SLIDE_MS = 620;

/** Type-on is slowed for the intro; the toggle uses the renderer's default. */
const INTRO_TYPE_MS = 900;
/** The beat where the finished grid just sits there before it lets go. */
const INTRO_HOLD_MS = 520;
/**
 * Hard ceiling on the intro. The dissolve can only run once the ASCII grid has
 * been sampled, which waits on the image decoding *and* `document.fonts.ready`
 * — so a cold load, a slow network, or an image that 404s can all leave the
 * ceremony with nothing to play. Without this the stage would sit empty
 * forever, since neither layer is showing mid-dissolve. Lands the photograph
 * regardless; the reveal is a nicety, the product is not.
 */
const INTRO_CEILING_MS = 5200;

export default function ShirtDisplay() {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("ascii");
  const [introRunning, setIntroRunning] = useState(true);
  const [dissolving, setDissolving] = useState(false);
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

  /** Lands on the photograph and stops the ceremony, from wherever it was. */
  const settle = useCallback(() => {
    setDissolving(false);
    setMode("photo");
    setIntroRunning(false);
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

  // The intro clock. `usePrefersReducedMotion` resolves false-then-true after
  // mount, so this re-runs on that flip and bails straight to the photograph.
  useEffect(() => {
    if (!introRunning) return;
    if (reduceMotion) {
      settle();
      return;
    }
    const timer = setTimeout(() => setDissolving(true), INTRO_TYPE_MS + INTRO_HOLD_MS);
    const guard = setTimeout(settle, INTRO_CEILING_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(guard);
    };
  }, [introRunning, reduceMotion, settle]);

  // Nobody should be held hostage by an intro. Any intent to interact — click,
  // key, scroll — lands it immediately.
  useEffect(() => {
    if (!introRunning) return;
    const skip = () => settle();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [introRunning, settle]);

  const advance = useCallback(() => {
    setOutgoing(index);
    setIndex((current) => (current + 1) % DESIGNS.length);
    if (slideTimer.current) clearTimeout(slideTimer.current);
    slideTimer.current = setTimeout(() => setOutgoing(null), reduceMotion ? 0 : SLIDE_MS);
  }, [index, reduceMotion]);

  useEffect(() => {
    return () => {
      if (slideTimer.current) clearTimeout(slideTimer.current);
    };
  }, []);

  // The window-level skip listener above fires on `pointerdown`, which lands a
  // whole render before the button's `click`. Reading these refs instead of the
  // render closure means the toggle always sees the state the skip just wrote,
  // rather than acting on what was true when the button was last painted.
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const introRef = useRef(introRunning);
  introRef.current = introRunning;

  const toggle = () => {
    if (introRef.current) {
      settle(); // mid-ceremony, "View" just means "show me it now"
      return;
    }
    if (modeRef.current === "photo") {
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
            <img src={DESIGNS[outgoing].photo} alt="" className="shirt-photo" />
          </div>
        )}

        <div
          key={`in-${index}`}
          className={outgoing !== null ? "shirt-layer slide-in" : "shirt-layer"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.photo}
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
            src={design.photo}
            active={asciiActive}
            cols={cols}
            className="ascii-layer"
            revealMs={introRunning ? INTRO_TYPE_MS : undefined}
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
              <pattern id="noax-frieze" width="10" height="4" patternUnits="userSpaceOnUse">
                <path
                  d="M5 0.4 L9 2 L5 3.6 L1 2 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#noax-frieze)" />
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
