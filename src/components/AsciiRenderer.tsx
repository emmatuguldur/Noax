"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  ASCII_RAMP,
  buildAsciiGrid,
  measureAdvanceRatio,
  type AsciiGrid,
} from "@/lib/ascii";

interface AsciiRendererProps {
  src: string;
  /** When false the layer is transparent but the grid stays warm in cache. */
  active: boolean;
  cols?: number;
  className?: string;
  /** Duration of the type-on stagger. The intro slows this down for the reveal. */
  revealMs?: number;
  /**
   * Flip to true to melt the grid away and hand the stage to the photograph
   * beneath. Flipping back to false restores it instantly.
   */
  dissolving?: boolean;
  /**
   * Called every frame of the dissolve with 0..1. Write to the DOM here — this
   * fires ~60×/s, so anything that triggers a React render will melt down.
   */
  onDissolveProgress?: (progress: number) => void;
  /** Fired once, when the last character has gone. */
  onDissolveEnd?: () => void;
}

/** Grids are expensive to build and never change, so keep them for the session. */
const gridCache = new Map<string, AsciiGrid>();

const REVEAL_MS = 420;

/* ---- Dissolve --------------------------------------------------------------
   The brand thesis as one gesture: the machine reading of the garment lets go
   and the real cloth is underneath it the whole time.

   Cells don't vanish on a wipe — each one has its own threshold, ordered by
   how dense its character is. The dim, sparse cells (empty ground, soft
   shadow) release first; the heavy strokes that actually draw the print hold
   on longest, so the image "erodes" down to its artwork before that too goes.
   A little upward lift on the way out keeps it from reading as a crossfade. */
const DISSOLVE_FADE = 0.22; // width of a single cell's fade, in progress units
const DISSOLVE_LIFT = 14; // px a character drifts up as it leaves
const DISSOLVE_MS = 1300;

/* ---- Spring-damper + cursor repulsion, tuned by feel -----------------------
   Each cell is a tiny 2D spring: a restoring force pulls its character back to
   its grid slot, velocity carries momentum, damping settles it. The damping is
   deliberately under critical (ζ ≈ 0.52) so a displaced character overshoots
   slightly and wobbles before resting rather than snapping or easing flatly.
   The cursor adds a radial repulsion that competes with the spring, so nearby
   characters bow away from the pointer and spring back once it passes. */
const STIFFNESS = 210; // k — restoring force toward rest
const DAMPING = 15; // c — under critical for a little overshoot
const PUSH = 4200; // repulsion strength; peak displacement ≈ PUSH / k px
const RADIUS = 84; // cursor falloff radius, CSS px
const REST_EPS = 0.05; // offset+velocity below this ⇒ cell has settled

export default function AsciiRenderer({
  src,
  active,
  cols = 104,
  className,
  revealMs = REVEAL_MS,
  dissolving = false,
  onDissolveProgress,
  onDissolveEnd,
}: AsciiRendererProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [grid, setGrid] = useState<AsciiGrid | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Callbacks live in refs so a new function identity from the parent never
  // tears down the render loop (which would reset every spring mid-flight).
  const progressRef = useRef(onDissolveProgress);
  progressRef.current = onDissolveProgress;
  const endRef = useRef(onDissolveEnd);
  endRef.current = onDissolveEnd;

  /** Handle onto the live loop, so `dissolving` can drive it without a remount. */
  const controlRef = useRef<{ start: () => void; reset: () => void } | null>(null);

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
      const ready: Promise<unknown> = document.fonts
        ? document.fonts.ready
        : Promise.resolve();
      ready.then(() => {
        if (cancelled) return;
        const family =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--font-mono")
            .trim() || "monospace";
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

  // Canvas render + per-cell spring physics. Rebuilds when the grid changes,
  // when the layer toggles active, or when the motion preference changes.
  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas || !grid) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // When inactive, leave the last rendered frame untouched so the layer's
    // opacity crossfade to the photo has something to fade out.
    if (!active) return;

    const { cols: C, rows: R, advance, chars, delays } = grid;
    const n = C * R;

    // Ramp index per cell → which atlas glyph to blit. Index 0 is a space and
    // is skipped at draw time.
    const rampIndex: Record<string, number> = {};
    for (let k = 0; k < ASCII_RAMP.length; k += 1) rampIndex[ASCII_RAMP[k]] = k;
    const glyphOf = new Uint8Array(n);
    for (let i = 0; i < n; i += 1) glyphOf[i] = rampIndex[chars[i]] ?? 0;

    // Per-cell dissolve threshold, weighted by character density so the print
    // outlasts the ground. Seeded, not Math.random — a reload should melt the
    // same way twice.
    const dissolveAt = new Float32Array(n);
    const lastRamp = ASCII_RAMP.length - 1;
    let dSeed = 0x9e3779b9;
    const dRand = () => {
      dSeed = (dSeed * 1664525 + 1013904223) >>> 0;
      return dSeed / 4294967296;
    };
    for (let i = 0; i < n; i += 1) {
      const density = glyphOf[i] / lastRamp; // 0 = faintest, 1 = heaviest
      // Scaled so the very last cell finishes its fade exactly at progress 1.
      dissolveAt[i] = (0.58 * density + 0.42 * dRand()) * (1 - DISSOLVE_FADE);
    }

    // Per-cell physics state (plain number arrays — no engine).
    const offX = new Float32Array(n);
    const offY = new Float32Array(n);
    const velX = new Float32Array(n);
    const velY = new Float32Array(n);
    const activeCells = new Set<number>(); // only these run the spring math

    let cellW = 1;
    let cellH = 1;
    let fontSize = 1;
    let dpr = 1;

    // Glyph atlas: each ramp character pre-rendered once at cell size, then
    // blitted per cell with drawImage — far cheaper than per-cell fillText.
    const atlas = document.createElement("canvas");
    const atlasCtx = atlas.getContext("2d");
    let aCellW = 1;
    let aCellH = 1;

    const paper =
      getComputedStyle(document.documentElement).getPropertyValue("--paper").trim() ||
      "#ede9e2";
    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() ||
      "monospace";

    const buildAtlas = () => {
      if (!atlasCtx) return;
      aCellW = Math.max(1, Math.ceil(cellW * dpr));
      aCellH = Math.max(1, Math.ceil(cellH * dpr));
      atlas.width = aCellW * ASCII_RAMP.length;
      atlas.height = aCellH;
      atlasCtx.clearRect(0, 0, atlas.width, atlas.height);
      atlasCtx.fillStyle = paper;
      atlasCtx.textAlign = "center";
      atlasCtx.textBaseline = "middle";
      atlasCtx.font = `${fontSize * dpr}px ${family}, monospace`;
      for (let k = 0; k < ASCII_RAMP.length; k += 1) {
        if (ASCII_RAMP[k] === " ") continue;
        atlasCtx.fillText(ASCII_RAMP[k], k * aCellW + aCellW / 2, aCellH / 2 + 1);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Tracked so globalAlpha is only assigned for cells actually mid-fade;
      // the overwhelming majority are exactly 1 and cost nothing.
      let alpha = 1;
      ctx.globalAlpha = 1;

      for (let i = 0; i < n; i += 1) {
        const g = glyphOf[i];
        if (g === 0) continue; // space
        if (delays[i] > reveal) continue; // type-on stagger

        let cellAlpha = 1;
        let lift = 0;
        if (dissolve > 0) {
          const t = (dissolve - dissolveAt[i]) / DISSOLVE_FADE;
          if (t >= 1) continue; // gone
          if (t > 0) {
            cellAlpha = 1 - t;
            lift = -t * t * DISSOLVE_LIFT; // eases away rather than sliding
          }
        }
        if (cellAlpha !== alpha) {
          ctx.globalAlpha = cellAlpha;
          alpha = cellAlpha;
        }

        const col = i % C;
        const row = (i - col) / C;
        const x = (col * cellW + offX[i]) * dpr;
        const y = (row * cellH + offY[i] + lift) * dpr;
        ctx.drawImage(atlas, g * aCellW, 0, aCellW, aCellH, x, y, aCellW, aCellH);
      }

      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const width = box.clientWidth;
      const height = box.clientHeight;
      if (!width) return;
      const byWidth = width / (C * advance);
      const byHeight = height > 0 ? height / R : byWidth;
      fontSize = Math.min(byWidth, byHeight);
      cellW = fontSize * advance;
      cellH = fontSize;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const gridW = cellW * C;
      const gridH = cellH * R;
      canvas.width = Math.round(gridW * dpr);
      canvas.height = Math.round(gridH * dpr);
      canvas.style.width = `${gridW}px`;
      canvas.style.height = `${gridH}px`;
      buildAtlas();
      draw();
    };

    // Cursor state, in canvas-local CSS px.
    let curX = -1e5;
    let curY = -1e5;
    let hovering = false;
    const hoverCapable =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let reveal = reduceMotion ? 1 : 0;
    let dissolve = 0;
    let melting = false;
    let running = false;
    let frame = 0;
    let last = 0;

    const step = (now: number) => {
      const dt = last ? Math.min(0.033, (now - last) / 1000) : 0.016;
      last = now;

      if (reveal < 1) reveal = Math.min(1, reveal + (dt * 1000) / revealMs);

      if (melting && dissolve < 1) {
        dissolve = Math.min(1, dissolve + (dt * 1000) / DISSOLVE_MS);
        progressRef.current?.(dissolve);
        if (dissolve >= 1) {
          melting = false;
          endRef.current?.();
        }
      }

      // Springs stand down while the grid is letting go — the cursor fighting
      // the dissolve reads as noise, not interaction.
      const pushing = hovering && hoverCapable && dissolve === 0;

      // Wake cells inside the cursor's falloff so they start simulating.
      if (pushing) {
        const rCols = RADIUS / cellW;
        const rRows = RADIUS / cellH;
        const cCol = curX / cellW;
        const cRow = curY / cellH;
        const x0 = Math.max(0, Math.floor(cCol - rCols));
        const x1 = Math.min(C - 1, Math.ceil(cCol + rCols));
        const y0 = Math.max(0, Math.floor(cRow - rRows));
        const y1 = Math.min(R - 1, Math.ceil(cRow + rRows));
        for (let ry = y0; ry <= y1; ry += 1) {
          for (let rx = x0; rx <= x1; rx += 1) {
            const cx = rx * cellW + cellW / 2 - curX;
            const cy = ry * cellH + cellH / 2 - curY;
            if (cx * cx + cy * cy < RADIUS * RADIUS) activeCells.add(ry * C + rx);
          }
        }
      }

      // Integrate the active cells only.
      for (const i of activeCells) {
        const col = i % C;
        const row = (i - col) / C;

        let ax = -STIFFNESS * offX[i] - DAMPING * velX[i];
        let ay = -STIFFNESS * offY[i] - DAMPING * velY[i];

        if (pushing) {
          const dx = col * cellW + cellW / 2 - curX;
          const dy = row * cellH + cellH / 2 - curY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < RADIUS) {
            const f = (PUSH * (1 - dist / RADIUS)) / (dist || 0.0001);
            ax += dx * f;
            ay += dy * f;
          }
        }

        velX[i] += ax * dt;
        velY[i] += ay * dt;
        offX[i] += velX[i] * dt;
        offY[i] += velY[i] * dt;

        if (
          Math.abs(offX[i]) < REST_EPS &&
          Math.abs(offY[i]) < REST_EPS &&
          Math.abs(velX[i]) < REST_EPS &&
          Math.abs(velY[i]) < REST_EPS
        ) {
          offX[i] = 0;
          offY[i] = 0;
          velX[i] = 0;
          velY[i] = 0;
          activeCells.delete(i);
        }
      }

      draw();

      if (reveal < 1 || activeCells.size > 0 || melting) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(step);
    };

    // Driven by the `dissolving` prop through a ref, so toggling it never
    // remounts this loop.
    controlRef.current = {
      start: () => {
        if (melting || dissolve >= 1) return;
        // Any unfinished type-on is abandoned; the grid is leaving anyway.
        reveal = 1;
        melting = true;
        wake();
      },
      reset: () => {
        if (dissolve === 0 && !melting) return;
        melting = false;
        dissolve = 0;
        progressRef.current?.(0);
        draw();
      },
    };

    // Window-level pointer tracking, resolved against the canvas each move so it
    // stays correct through scroll without listening on the (pointer-events:none)
    // layers.
    const onPointerMove = (e: PointerEvent) => {
      if (!hoverCapable) return;
      const r = canvas.getBoundingClientRect();
      curX = e.clientX - r.left;
      curY = e.clientY - r.top;
      const m = RADIUS;
      hovering =
        curX >= -m && curX <= r.width + m && curY >= -m && curY <= r.height + m;
      if (hovering) wake();
    };
    const onPointerLeaveWindow = () => {
      hovering = false;
      wake(); // let the springs carry everything home
    };

    resize();

    let observer: ResizeObserver | null = null;
    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeaveWindow);
      observer = new ResizeObserver(resize);
      observer.observe(box);
      wake(); // play the type-on reveal
    } else {
      reveal = 1;
      draw();
      observer = new ResizeObserver(resize);
      observer.observe(box);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeaveWindow);
      observer?.disconnect();
      controlRef.current = null;
    };
  }, [grid, active, reduceMotion, revealMs]);

  // `grid`/`active` are in the deps so the command re-applies after the loop
  // above rebuilds and installs a fresh controlRef.
  useEffect(() => {
    if (dissolving) controlRef.current?.start();
    else controlRef.current?.reset();
  }, [dissolving, grid, active]);

  return (
    <div
      ref={boxRef}
      className={className}
      aria-hidden="true"
      style={{ opacity: active && grid ? 1 : 0 }}
    >
      <canvas ref={canvasRef} className="ascii-canvas" aria-hidden="true" />
    </div>
  );
}
