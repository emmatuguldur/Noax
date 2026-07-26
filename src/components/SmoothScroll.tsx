"use client";

import { useEffect } from "react";

import Lenis from "lenis";

import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Weighted momentum scrolling via Lenis, site-wide. Lenis smooths native
 * scroll, so window.scrollY stays accurate for the scroll-driven shape field.
 * Disabled under reduced-motion, where the default browser scroll is correct.
 */
export default function SmoothScroll() {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    let id = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return null;
}
