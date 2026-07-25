"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  buildAsciiGrid,
  composeAscii,
  measureAdvanceRatio,
  type AsciiGrid,
} from "@/lib/ascii";

interface AsciiRendererProps {
  src: string;
  /** When false the layer is transparent but the grid stays warm in cache. */
  active: boolean;
  cols?: number;
  className?: string;
}

/** Grids are expensive to build and never change, so keep them for the session. */
const gridCache = new Map<string, AsciiGrid>();

const REVEAL_MS = 420;

export default function AsciiRenderer({
  src,
  active,
  cols = 104,
  className,
}: AsciiRendererProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);
  const [grid, setGrid] = useState<AsciiGrid | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Build the character grid once per source image.
  useEffect(() => {
    const key = `${src}|${cols}`;
    const cached = gridCache.get(key);
    if (cached) {
      setGrid(cached);
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (cancelled) return;
      // The grid's shape depends on the real advance width, so wait until the
      // display font is actually resolved before measuring it.
      const ready: Promise<unknown> = document.fonts
        ? document.fonts.ready
        : Promise.resolve();
      ready.then(() => {
        if (cancelled) return;
        const family =
          getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() ||
          "monospace";
        const built = buildAsciiGrid(image, image.naturalWidth, image.naturalHeight, {
          cols,
          advance: measureAdvanceRatio(`${family}, monospace`),
        });
        if (!built) return;
        gridCache.set(key, built);
        setGrid(built);
      });
    };
    image.src = src;

    return () => {
      cancelled = true;
      image.onload = null;
    };
  }, [src, cols]);

  // Size the type so the grid fills the stage exactly.
  useEffect(() => {
    const box = boxRef.current;
    const pre = preRef.current;
    if (!box || !pre || !grid) return;

    const resize = () => {
      const width = box.clientWidth;
      const height = box.clientHeight;
      if (!width) return;
      // Fit to whichever axis binds, so a photo whose aspect differs from the
      // stage is letterboxed rather than overflowing it.
      const byWidth = width / (grid.cols * grid.advance);
      const byHeight = height > 0 ? height / grid.rows : byWidth;
      const size = Math.min(byWidth, byHeight);
      pre.style.fontSize = `${size}px`;
      pre.style.lineHeight = `${size}px`;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(box);
    return () => observer.disconnect();
  }, [grid]);

  // Type-on when the layer becomes active; plain fade on the way out.
  useEffect(() => {
    const pre = preRef.current;
    if (!pre || !grid) return;

    if (!active) {
      pre.textContent = composeAscii(grid, 1);
      return;
    }

    if (reduceMotion) {
      pre.textContent = composeAscii(grid, 1);
      return;
    }

    let frame = 0;
    const started = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - started) / REVEAL_MS);
      pre.textContent = composeAscii(grid, t);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    pre.textContent = composeAscii(grid, 0);
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, grid, reduceMotion]);

  return (
    <div
      ref={boxRef}
      className={className}
      aria-hidden="true"
      style={{ opacity: active && grid ? 1 : 0 }}
    >
      <pre ref={preRef} className="ascii-plate" />
    </div>
  );
}
