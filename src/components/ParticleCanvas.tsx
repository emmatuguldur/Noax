"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { createNoise2D } from "@/lib/noise";
import { buildStipple, type StippleDot, type StippleOptions } from "@/lib/stipple";

interface ParticleCanvasProps {
  src: string;
  /** Logical (CSS) size of the illustration. Scale it down with CSS if needed. */
  width: number;
  height: number;
  className?: string;
  options?: Partial<StippleOptions>;
  /** Seconds a single dot takes to travel from its scattered start. */
  travel?: number;
  /** Soft halo behind the silhouette. */
  glow?: boolean;
  /** Render the settled stipple once and stop — no perpetual rAF. For the many
   *  small decorative instances, positional drift is done in CSS instead, so
   *  they don't each hold a live animation loop. */
  still?: boolean;
}

const noise2D = createNoise2D(9161);

/**
 * Renders a source image as a stochastic dot-stipple illustration.
 *
 * Dots start scattered, assemble into the image when the canvas scrolls into
 * view, then drift on simplex noise so the mark is never quite still.
 */
export default function ParticleCanvas({
  src,
  width,
  height,
  className,
  options,
  travel = 1.2,
  glow = true,
  still = false,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: StippleDot[] = [];
    let frame = 0;
    let startedAt = 0;
    let running = false;
    let disposed = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const halo = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.05,
      width / 2,
      height / 2,
      width * 0.55,
    );
    halo.addColorStop(0, "rgba(201, 96, 26, 0.10)");
    halo.addColorStop(0.45, "rgba(140, 146, 168, 0.055)");
    halo.addColorStop(1, "rgba(11, 11, 12, 0)");

    const driftAmp = width / 150;

    const paint = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);

      if (glow) {
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.globalAlpha = Math.min(1, elapsed / 0.5);
      let style = "";

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        const raw = (elapsed - dot.delay) / travel;
        const t = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
        const ease = 1 - (1 - t) * (1 - t) * (1 - t);
        if (ease <= 0.001) continue;

        let x = dot.sx + (dot.tx - dot.sx) * ease;
        let y = dot.sy + (dot.ty - dot.sy) * ease;

        if (!reduceMotion && !still) {
          const flow = elapsed * 0.06;
          x += noise2D(dot.nx + flow, dot.ny) * driftAmp * ease;
          y += noise2D(dot.nx, dot.ny + flow) * driftAmp * ease;
        }

        if (dot.style !== style) {
          style = dot.style;
          ctx.fillStyle = style;
        }

        const r = dot.radius;
        if (r <= 1.1) {
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (disposed) return;
      if (!startedAt) startedAt = now;
      paint((now - startedAt) / 1000);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || disposed || dots.length === 0) return;
      running = true;
      if (reduceMotion || still) {
        // Skip the assemble and the drift entirely: paint the settled mark.
        paint(travel + 1);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const image = new Image();
    image.decoding = "async";
    let observer: IntersectionObserver | null = null;

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (running && !reduceMotion && !still && !frame) frame = requestAnimationFrame(tick);
    };

    image.onload = () => {
      if (disposed) return;
      dots = buildStipple(
        image,
        image.naturalWidth,
        image.naturalHeight,
        width,
        height,
        options,
      );
      if (dots.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              start();
              observer?.disconnect();
              observer = null;
            }
          }
        },
        { threshold: 0.12 },
      );
      observer.observe(canvas);
      document.addEventListener("visibilitychange", onVisibility);
    };

    image.src = src;

    return () => {
      disposed = true;
      stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      image.onload = null;
    };
    // `options` is a literal at every call site; the primitives below are the
    // real inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, width, height, travel, glow, still, reduceMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
