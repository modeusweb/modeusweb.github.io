"use client";

import { useEffect, useRef } from "react";
import { subscribe } from "@/lib/scroll-ticker";

/**
 * A hairline reading-progress rail pinned to the bottom of the sticky header.
 *
 * It is the one piece of motion on the page that carries information rather
 * than decoration: on a long single-page site it tells you how much is left
 * without a scrollbar hunt. Updates happen on the shared scroll ticker and touch
 * nothing but `transform`, so the bar is composited and never triggers layout.
 *
 * Under reduced motion it is never subscribed and simply stays at zero width.
 */
export function ScrollProgress() {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    return subscribe((progress) => {
      rail.style.transform = `scaleX(${progress})`;
    });
  }, []);

  return (
    <div aria-hidden="true" className="scroll-progress-track">
      <div ref={railRef} className="scroll-progress-rail" />
    </div>
  );
}