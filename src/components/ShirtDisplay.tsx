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

export default function ShirtDisplay() {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("ascii");
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduceMotion = usePrefersReducedMotion();
  const compact = useIsCompact();

  // A phone stage is a few hundred px wide; 108 columns there renders sub-4px
  // type, so drop the resolution on small screens.
  const cols = compact ? 72 : 108;

  const design = DESIGNS[index];
  const next = DESIGNS[(index + 1) % DESIGNS.length];
  const asciiActive = mode === "ascii";

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
      <div className="shirt-stage">
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
          <AsciiRenderer
            src={design.photo}
            active={asciiActive}
            cols={cols}
            className="ascii-layer"
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
