"use client";

import { useEffect } from "react";

/**
 * A tiny client-side gate that enables the CSS reveal system.
 *
 * On mount — only when JavaScript is running and the user has NOT requested
 * reduced motion — it adds `motion-on` to <html>. Until then, all `[data-reveal]`
 * content is fully visible in the static HTML, so nothing is ever hidden if JS
 * is delayed, fails, or is disabled, and reduced-motion users see no animation.
 */
export function MotionGate() {
  useEffect(() => {
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
