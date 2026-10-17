"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { subscribe } from "@/lib/scroll-ticker";
import { cn } from "@/lib/utils";

interface ParallaxProps extends HTMLAttributes<HTMLElement> {
  /** Optional — the wrapper is also useful as an empty positioned element. */
  children?: ReactNode;
  /**
   * Maximum vertical drift in pixels, reached when the element's centre passes
   * the middle of the viewport. Sign controls direction. Keep this small: the
   * effect should read as depth, not as movement.
   */
  speed?: number;
  className?: string;
  /** Render as a different element when needed (default: div). */
  as?: ElementType;
  style?: CSSProperties;
}

/**
 * Scroll-linked vertical drift for decorative layers.
 *
 * Intended for `aria-hidden`, non-interactive decoration only — wrapping real
 * content in it would make that content shift under the reader and break the
 * "content is present without JavaScript" guarantee the reveal system relies on.
 *
 * Geometry is measured once per mount and resize rather than per frame, so the
 * steady state costs a subtraction and a string write — no layout reads while
 * scrolling. Only `transform` is written, keeping the work on the compositor.
 *
 * Without JavaScript, and under `prefers-reduced-motion`, no subscription is
 * made and the element simply sits at its untransformed position.
 */
export function Parallax({
  children,
  speed = 32,
  className,
  as = "div",
  style,
  ...rest
}: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const Component = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Scroll offset at which this element sits centred in the viewport, plus the
    // distance over which it eases from fully-high to fully-low.
    let anchor = 0;
    let range = 1;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      anchor = top + rect.height / 2 - window.innerHeight / 2;
      range = Math.max(1, (rect.height + window.innerHeight) / 2);
    };

    const update = (_progress: number, scrollY: number) => {
      const t = Math.min(1, Math.max(-1, (scrollY - anchor) / range));
      // Smoothstep keeps the drift gentle at the extremes, where a linear ramp
      // reads as a hard stop.
      const eased = t * t * (3 - 2 * t);
      el.style.transform = `translate3d(0, ${(-eased * speed).toFixed(2)}px, 0)`;
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });

    const unsubscribe = subscribe(update);

    return () => {
      window.removeEventListener("resize", measure);
      unsubscribe();
    };
  }, [speed]);

  return (
    <Component ref={ref} {...rest} className={cn(className)} style={style}>
      {children}
    </Component>
  );
}