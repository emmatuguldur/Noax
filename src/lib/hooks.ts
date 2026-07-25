"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on touch-first devices, where `:hover` is not a real interaction. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

/** True below the `md` breakpoint. */
export function useIsCompact(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
