"use client";

import { useEffect, useRef } from "react";

/**
 * A premium pointer-following spotlight glow.
 *
 * Purely decorative and progressively enhanced:
 * - It installs listeners only on fine pointers (mouse) and never on touch or
 *   coarse pointers, so it cannot hurt usability or mobile performance.
 * - Under `prefers-reduced-motion` it is hidden entirely (also via CSS).
 * - It is driven by a single `requestAnimationFrame` loop with lerp easing and
 *   updates only `transform`/`opacity` (GPU-friendly) — no per-move React state.
 * - It relies on JavaScript; with JS disabled the page simply has no effect.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supportsMatch =
      typeof window !== "undefined" && typeof window.matchMedia === "function";
    const fine =
      supportsMatch &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce =
      supportsMatch &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Touch / coarse pointers and reduced-motion users get no effect.
    if (!fine || reduce) return;

    const el = glowRef.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let visible = false;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        // Snap to the pointer on first move, then fade in.
        visible = true;
        currentX = targetX;
        currentY = targetY;
        el.dataset.active = "true";
      }
    };

    const onLeave = () => {
      visible = false;
      el.dataset.active = "false";
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.("a[href], button, [role='button']")) {
        el.dataset.hot = "true";
      }
    };

    const onOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.("a[href], button, [role='button']")) {
        el.dataset.hot = "false";
      }
    };

    const tick = () => {
      // Weighted lerp for a smooth, slightly lagging follow.
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      data-active="false"
      data-hot="false"
      className="cursor-glow"
    />
  );
}
