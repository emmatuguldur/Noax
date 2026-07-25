"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Site-wide film grain. A small noise tile is regenerated a few times a second
 * and pattern-filled across a fixed, full-viewport canvas, so the whole page
 * reads as printed/tactile rather than flat digital black. Monochrome only —
 * no colour is introduced. Opacity is kept low in CSS so it's texture, not
 * visible noise.
 */
const TILE = 140;
const REGEN_EVERY = 3; // frames — ~20fps grain flicker

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tile = document.createElement("canvas");
    tile.width = TILE;
    tile.height = TILE;
    const tctx = tile.getContext("2d");
    if (!tctx) return;
    const image = tctx.createImageData(TILE, TILE);

    const fillNoise = () => {
      const d = image.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
      tctx.putImageData(image, 0, 0);
    };

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(window.innerWidth * dpr);
      canvas.height = Math.ceil(window.innerHeight * dpr);
      paint();
    };

    const paint = () => {
      fillNoise();
      const pattern = ctx.createPattern(tile, "repeat");
      if (!pattern) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    let frame = 0;
    let tick = 0;
    const loop = () => {
      if (tick % REGEN_EVERY === 0) paint();
      tick += 1;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize, { passive: true });
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(window.innerWidth * dpr);
    canvas.height = Math.ceil(window.innerHeight * dpr);

    if (reduceMotion) {
      paint(); // one static frame, no flicker
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="grain" aria-hidden="true" />;
}
