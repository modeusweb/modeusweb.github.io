"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
  /** Render as a different element when needed (default: div). */
  as?: "div" | "li" | "section" | "article" | "span" | "ol";
}

/**
 * Scroll-triggered reveal built on CSS transitions + IntersectionObserver.
 *
 * The element is fully visible in the static HTML. A tiny client gate
 * (`MotionGate`) adds `motion-on` to <html> only when JavaScript is active and
 * the user has not requested reduced motion; that enables the hidden initial
 * state via CSS. This component then toggles `is-visible` when the element
 * scrolls into view. If JS is delayed, fails, or reduced motion is set, the
 * content simply stays visible — it is never trapped at opacity 0.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Component = as as ElementType;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the motion gate is not active (no JS enhancement or reduced motion),
    // ensure the element is visible and skip observing.
    if (!document.documentElement.classList.contains("motion-on")) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : undefined;

  return (
    <Component ref={ref} data-reveal="" style={style} className={cn(className)}>
      {children}
    </Component>
  );
}
