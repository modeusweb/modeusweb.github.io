"use client";

import { useLayoutEffect } from "react";

/**
 * Development-safety net for the pre-paint motion gate.
 *
 * The authoritative gate is an inline script in `app/layout.tsx` that adds
 * `motion-on` to <html> while the browser parses the HTML — before the first
 * paint, so reveal blocks never flash visible first. Doing it in a
 * `useEffect` would be too late and visibly jump the layout.
 *
 * This component only re-applies that same class in `useLayoutEffect`. In
 * production it is a no-op (the class is already there). In development,
 * React's Strict Mode remount resets <html> to the attributes it manages from
 * JSX, which drops `motion-on`; re-adding it before paint keeps dev identical
 * to production. See `next/dist/docs/01-app/02-guides/
 * preventing-flash-before-hydration.md`.
 */
export function MotionGate() {
  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduce) {
      document.documentElement.classList.add("motion-on");
    }
  }, []);

  return null;
}
