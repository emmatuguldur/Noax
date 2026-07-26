"use client";

import type { CSSProperties } from "react";

import ParticleCanvas from "@/components/ParticleCanvas";
import { useIsCompact } from "@/lib/hooks";

/**
 * Thin vertical strings hanging from the top edge, each ending in a small
 * stipple charm, swaying gently. Ambient decoration for the hero's wide side
 * margins — reduced opacity, no interaction. The sway is a cheap CSS rotation
 * about the top anchor; the charm is a static stipple.
 */
const PAPER: [number, number, number] = [237, 233, 226];
const EMBER: [number, number, number] = [201, 96, 26];

interface Strand {
  x: string;
  height: string;
  charm: string;
  charmSize: number;
  dur: string;
  delay: string;
  ember?: boolean;
}

const STRANDS: Strand[] = [
  { x: "5%", height: "42vh", charm: "/decor/bead.png", charmSize: 22, dur: "7s", delay: "0s" },
  { x: "9.5%", height: "29vh", charm: "/shapes/star.png", charmSize: 26, dur: "9s", delay: "-2s" },
  { x: "90.5%", height: "52vh", charm: "/decor/sparkle.png", charmSize: 24, dur: "8s", delay: "-4s", ember: true },
  { x: "95.5%", height: "35vh", charm: "/decor/ring.png", charmSize: 20, dur: "6.5s", delay: "-1s" },
];

export default function OrnamentStrings({ max = 4 }: { max?: number }) {
  const compact = useIsCompact();
  const count = compact ? Math.min(max, 2) : max;
  const strands = STRANDS.slice(0, count);

  return (
    <div className="ornaments" aria-hidden="true">
      {strands.map((s, i) => (
        <span
          key={i}
          className="ornament-string"
          style={
            {
              left: s.x,
              height: s.height,
              "--sway-dur": s.dur,
              "--sway-delay": s.delay,
            } as CSSProperties
          }
        >
          <span className="string-line" />
          <span className="string-charm" style={{ width: s.charmSize, height: s.charmSize }}>
            <ParticleCanvas
              src={s.charm}
              width={s.charmSize}
              height={s.charmSize}
              glow={false}
              still
              options={{
                count: Math.round(s.charmSize * 2.6),
                ink: s.ember ? EMBER : PAPER,
                sampleWidth: 90,
                minRadius: 0.4,
                maxRadius: 1.3,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
