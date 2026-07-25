"use client";

import type { CSSProperties } from "react";

import ParticleCanvas from "@/components/ParticleCanvas";
import { useIsCompact } from "@/lib/hooks";

/**
 * Purely decorative, non-interactive stipple shapes drifting gently in the
 * background. They reuse the existing pointillism system (ParticleCanvas), just
 * small and faint, so they're visually consistent with the brand mark's dot
 * language. No links, no labels. Positional drift is a cheap CSS animation;
 * ParticleCanvas adds its own noise shimmer to the dots on top.
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

const DRIFTERS: Drifter[] = [
  { art: "/shapes/star.png", x: "11%", y: "24%", size: 62, dur: "19s", delay: "0s" },
  { art: "/shapes/sphere.png", x: "85%", y: "31%", size: 50, dur: "23s", delay: "-4s" },
  { art: "/shapes/triangle.png", x: "20%", y: "73%", size: 42, dur: "27s", delay: "-9s" },
  { art: "/shapes/diamond.png", x: "80%", y: "69%", size: 56, dur: "21s", delay: "-13s" },
  { art: "/shapes/star.png", x: "52%", y: "13%", size: 34, dur: "25s", delay: "-6s" },
];

export default function AmbientField({ max = 5 }: { max?: number }) {
  const compact = useIsCompact();
  // Fewer instances on phones — each is a live canvas.
  const count = compact ? Math.min(max, 2) : max;
  const shapes = DRIFTERS.slice(0, count);

  return (
    <div className="ambient" aria-hidden="true">
      {shapes.map((s, i) => (
        <span
          key={`${s.art}-${i}`}
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
            options={{
              count: Math.round(s.size * 2.2),
              ink: PAPER,
              sampleWidth: 120,
              minRadius: 0.4,
              maxRadius: 1.4,
            }}
          />
        </span>
      ))}
    </div>
  );
}
