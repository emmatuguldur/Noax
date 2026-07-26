"use client";

import type { CSSProperties } from "react";

import ParticleCanvas from "@/components/ParticleCanvas";
import { useIsCompact } from "@/lib/hooks";

/**
 * Purely decorative, non-interactive stipple shapes drifting gently in the
 * negative space. They reuse the pointillism system (ParticleCanvas) in its
 * static mode — rendered once, positional drift handled in CSS — so a screen
 * full of them doesn't hold a live loop each. Deliberately a wider set of
 * silhouettes than the four functional nav shapes.
 */
const PAPER: [number, number, number] = [237, 233, 226];

interface Drifter {
  art: string;
  x: string;
  y: string;
  size: number;
  dur: string;
  delay: string;
}

const POOL: Drifter[] = [
  { art: "/decor/ring.png", x: "8%", y: "26%", size: 46, dur: "24s", delay: "0s" },
  { art: "/decor/sparkle.png", x: "89%", y: "19%", size: 34, dur: "19s", delay: "-5s" },
  { art: "/decor/cross.png", x: "15%", y: "71%", size: 28, dur: "27s", delay: "-11s" },
  { art: "/decor/hex.png", x: "83%", y: "67%", size: 44, dur: "22s", delay: "-7s" },
  { art: "/shapes/sphere.png", x: "50%", y: "11%", size: 30, dur: "25s", delay: "-14s" },
  { art: "/decor/sparkle.png", x: "5%", y: "52%", size: 24, dur: "21s", delay: "-3s" },
  { art: "/decor/ring.png", x: "94%", y: "45%", size: 28, dur: "26s", delay: "-9s" },
  { art: "/decor/hex.png", x: "43%", y: "85%", size: 26, dur: "23s", delay: "-16s" },
];

export default function AmbientField({
  max = 6,
  offset = 0,
}: {
  max?: number;
  offset?: number;
}) {
  const compact = useIsCompact();
  const count = compact ? Math.min(max, 3) : max;
  const shapes = Array.from({ length: count }, (_, i) => POOL[(i + offset) % POOL.length]);

  return (
    <div className="ambient" aria-hidden="true">
      {shapes.map((s, i) => (
        <span
          key={i}
          className="ambient-node"
          style={
            {
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              "--dur": s.dur,
              "--delay": s.delay,
            } as CSSProperties
          }
        >
          <ParticleCanvas
            src={s.art}
            width={s.size}
            height={s.size}
            glow={false}
            still
            options={{
              count: Math.round(s.size * 2.4),
              ink: PAPER,
              sampleWidth: 110,
              minRadius: 0.4,
              maxRadius: 1.3,
            }}
          />
        </span>
      ))}
    </div>
  );
}
