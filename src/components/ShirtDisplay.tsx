"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import AsciiRenderer from "@/components/AsciiRenderer";
import { DESIGNS } from "@/data/designs";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * v2 state machine.
 *
 * ASCII is the default first-paint state, with no hover gating at all. The
 * "View" button is always visible and is the only control: it flips between
 * the ASCII rendering and the real photograph (a transparent cutout). The
 * button label always names the state you are about to move to.
 *
 * The old hover-triggered override machine is gone.
 */
type Mode = "ascii" | "photo";

const SLIDE_MS = 620;
/** Peak offset (px) the ASCII drifts toward the cursor. Small and subtle. */
const FOLLOW_MAX = 16;

export default function ShirtDisplay() {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("ascii");
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduceMotion = usePrefersReducedMotion();
  const compact = useIsCompact();

  // Mouse-follow (ASCII only): eased/lagged, not 1:1, active only while the
  // ASCII state is showing and the stage is hovered.
  const stageRef = useRef<HTMLDivElement | null>(null);
  const followRef = useRef<HTMLDivElement | null>(null);
  const followTarget = useRef({ x: 0, y: 0 });
  const followCur = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);

  // A phone stage is a few hundred px wide; 108 columns there renders sub-4px
  // type, so drop the resolution on small screens.
  const cols = compact ? 72 : 108;

  const design = DESIGNS[index];
  const next = DESIGNS[(index + 1) % DESIGNS.length];
  const asciiActive = mode === "ascii";

  // Latest values for the follow loop, without re-subscribing it each render.
  const asciiActiveRef = useRef(asciiActive);
  asciiActiveRef.current = asciiActive;
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  const onStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    followTarget.current = { x: nx * FOLLOW_MAX, y: ny * FOLLOW_MAX };
  };
  const onStageEnter = () => {
    hovering.current = true;
  };
  const onStageLeave = () => {
    hovering.current = false;
    followTarget.current = { x: 0, y: 0 };
  };

  // Eases the ASCII wrapper toward the target every frame. The lag is what
  // makes it feel smooth rather than snapping to the cursor.
  useEffect(() => {
    let frame = 0;
    const step = () => {
      const on = asciiActiveRef.current && hovering.current && !reduceRef.current;
      const tx = on ? followTarget.current.x : 0;
      const ty = on ? followTarget.current.y : 0;
      const cur = followCur.current;
      cur.x += (tx - cur.x) * 0.09;
      cur.y += (ty - cur.y) * 0.09;
      const el = followRef.current;
      if (el) {
        el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

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

  const toggle = () => setMode((m) => (m === "ascii" ? "photo" : "ascii"));

  return (
    <div className="shirt-block">
      <div
        className="shirt-stage"
        ref={stageRef}
        onMouseMove={onStageMove}
        onMouseEnter={onStageEnter}
        onMouseLeave={onStageLeave}
      >
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
            style={{ opacity: asciiActive ? 0 : 1 }}
            draggable={false}
          />
          <div ref={followRef} className="ascii-follow">
            <AsciiRenderer
              src={design.photo}
              active={asciiActive}
              cols={cols}
              className="ascii-layer"
            />
          </div>
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
          <span className="text-paper">
            CAT. {design.cat} — {design.study}
          </span>
          <span className="shirt-meta-sep">/</span>
          {design.edition}
          <span className="shirt-meta-sep">/</span>
          {design.spec}
        </p>

        <div className="pip-row" aria-hidden="true">
          {DESIGNS.map((item, i) => (
            <span key={item.id} className={i === index ? "pip pip-on" : "pip"} />
          ))}
        </div>
      </div>
    </div>
  );
}
