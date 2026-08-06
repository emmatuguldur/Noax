"use client";

import { useEffect, useRef } from "react";

import { CuttingAnimator } from "@/lib/cutting";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Full-page version of the shape row's cutting animation, used on the
 * About / Story / Contact routes (not Shop). Sits fixed behind the page
 * content — `.page` carries the z-index that keeps it on top.
 */
export default function CuttingBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    if (!canvas || !ctx) return;

    const animator = new CuttingAnimator();
    const view = { w: window.innerWidth, h: window.innerHeight };
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const measure = () => {
      view.w = window.innerWidth;
      view.h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(view.w * dpr);
      canvas.height = Math.ceil(view.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure);

    let frame = 0;
    const draw = (now: number) => {
      ctx.clearRect(0, 0, view.w, view.h);
      animator.draw(ctx, view.w, view.h, now, null, 1, reduceMotion);
      frame = requestAnimationFrame(draw);
    };

    if (reduceMotion) {
      draw(0);
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="page-cutting-bg" aria-hidden="true" />;
}
