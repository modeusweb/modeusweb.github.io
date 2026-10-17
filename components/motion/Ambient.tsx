import { Parallax } from "@/components/motion/Parallax";
import { cn } from "@/lib/utils";

interface AmbientProps {
  className?: string;
  /**
   * Which corner the glow anchors to. Each variant drifts at a different speed
   * so overlapping layers separate as the page scrolls.
   */
  variant?: "top-right" | "bottom-left" | "center-left";
  /** Drift in pixels at full travel. */
  speed?: number;
}

/**
 * Decorative ambient lighting: a single large, heavily blurred accent wash that
 * parallaxes behind a section.
 *
 * Purely atmospheric — `aria-hidden`, non-interactive, and excluded from
 * stacking so it can never sit above text. Opacity stays low enough that
 * contrast against body copy is unaffected.
 */
export function Ambient({ className, variant = "top-right", speed = 40 }: AmbientProps) {
  const position = {
    "top-right": "-right-32 -top-32",
    "bottom-left": "-left-40 -bottom-40",
    "center-left": "-left-48 top-1/3",
  }[variant];

  return (
    <Parallax
      aria-hidden="true"
      speed={speed}
      className={cn(
        "pointer-events-none absolute h-[30rem] w-[30rem] rounded-full",
        "bg-acid-500/8 blur-[110px]",
        position,
        className,
      )}
    />
  );
}