"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const LINK_DIST = 132;
const POINTER_RADIUS = 190;
const MAX_DPR = 2;

/**
 * NeuralBackdrop — a living, interactive node-network backdrop on canvas.
 *
 * Slowly drifting nodes are linked by faint lines; a pointer draws nearby
 * nodes in and lights their links with the acid accent. Purely decorative and
 * fully non-intrusive:
 * - fixed, full-viewport, behind all content (z-index 0), `pointer-events:
 *   none`, `aria-hidden` — it never intercepts input or affects usability.
 * - respects `prefers-reduced-motion` (renders nothing at all).
 * - on touch / coarse pointers it draws a single static frame (no rAF loop) to
 *   save battery, since there is no cursor to react to.
 * - otherwise a single `requestAnimationFrame` loop; content is unaffected if
 *   JS is delayed, fails, or is disabled (canvas simply stays blank).
 */
export function NeuralBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const supportsMatch = typeof window.matchMedia === "function";
    const reduce =
      supportsMatch &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const fine =
      supportsMatch &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const readColour = (name: string, fallback: string) => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return value || fallback;
    };

    const lineColor = readColour("--color-line-soft", "#1b212a");
    const nodeColor = readColour("--color-ink-500", "#7c8695");
    const accentColor = readColour("--color-acid-400", "#c2f04a");

    const targetCount = () => {
      const byArea = Math.round((width * height) / 15000);
      return Math.max(26, Math.min(92, byArea));
    };

    const makeParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = targetCount();
      if (particles.length === 0) {
        particles = Array.from({ length: count }, makeParticle);
      } else if (count !== particles.length) {
        if (count > particles.length) {
          while (particles.length < count) particles.push(makeParticle());
        } else {
          particles.length = count;
        }
      }
    };

    const stepParticles = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_RADIUS * POINTER_RADIUS) {
            p.vx += dx * 0.00012;
            p.vy += dy * 0.00012;
            const speed = Math.hypot(p.vx, p.vy);
            if (speed > 0.6) {
              p.vx = (p.vx / speed) * 0.6;
              p.vy = (p.vy / speed) * 0.6;
            }
          }
        }
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      // Links between nearby nodes.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes and their links to the pointer.
      for (const p of particles) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < POINTER_RADIUS) {
            const t = 1 - dist / POINTER_RADIUS;
            ctx.globalAlpha = t * 0.5;
            ctx.strokeStyle = accentColor;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();

            ctx.globalAlpha = t * 0.9;
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8 + t, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    const tick = () => {
      stepParticles();
      drawFrame();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    drawFrame();

    const onResize = () => {
      resize();
      if (!fine) drawFrame();
    };
    window.addEventListener("resize", onResize);

    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="neural-canvas" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

