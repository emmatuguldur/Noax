"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A single continuous stroke that draws itself in under the hero — the brand's
 * signature, not a section rule. `pathLength` is normalised to 1 so the dash
 * animation is resolution-independent.
 */
export default function SignatureLine() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    if (reduceMotion) {
      path.style.strokeDashoffset = "0";
      return;
    }

    let frame = 0;
    const duration = 2400;
    const started = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      path.style.strokeDashoffset = String(1 - eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return (
    <svg
      className="signature-line"
      viewBox="0 0 1200 96"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        pathLength={1}
        d="M4 62 C 96 62, 140 18, 236 20 C 332 22, 356 74, 452 76 C 548 78, 604 26, 706 24 C 808 22, 842 70, 934 72 C 1026 74, 1096 46, 1196 34"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
    </svg>
  );
}
