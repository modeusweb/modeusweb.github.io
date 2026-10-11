import type { VisualVariant } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { RasterVisual } from "./RasterVisual";
import { VectorVisual } from "./VectorVisual";
import { SpriteVisual } from "./SpriteVisual";
import { EncodeVisual } from "./EncodeVisual";

interface ProjectVisualProps {
  variant: VisualVariant;
  className?: string;
}

/**
 * Renders the original, lightweight SVG visual that represents a project.
 * Each variant has its own personality while sharing the same palette.
 * All visuals are decorative (`aria-hidden`) — the card text carries meaning.
 */
export function ProjectVisual({ variant, className }: ProjectVisualProps) {
  const shared = cn(
    "h-full w-full transition-transform duration-500 ease-[var(--ease-out-expo)]",
    className,
  );

  switch (variant) {
    case "raster":
      return <RasterVisual className={shared} />;
    case "vector":
      return <VectorVisual className={shared} />;
    case "sprite":
      return <SpriteVisual className={shared} />;
    case "encode":
      return <EncodeVisual className={shared} />;
    default:
      return null;
  }
}
