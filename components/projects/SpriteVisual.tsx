import { cn } from "@/lib/utils";

/**
 * Sprite / pixel-grid motif for Sprit-Z:
 * four individual icon tiles (2×2, left) merging through an arrow into a single
 * sprite frame (2×2, right). Both groups are vertically centred on y = 100 and
 * the icons inside the frame are centred within it. Purely decorative.
 */
export function SpriteVisual({ className }: { className?: string }) {
  // Glyph paths drawn inside a 20×20 cell.
  const icons = [
    "M4 10h12M10 4v12",
    "M5 10l4 4 8-8",
    "M5 5h10v10H5z",
    "M10 4l6 12H4z",
  ];
  // Left tiles: 28×28 cell, gap 8 → 64×64 block centred at (84, 100).
  const source = icons.map((_, i) => ({
    x: 52 + (i % 2) * 36,
    y: 68 + Math.floor(i / 2) * 36,
  }));
  // Right sprite frame: 110×104 at x 170–280, centred at (225, 100).
  // Icons inside: 26×26 cell, gap 12 → 64×64 grid centred at (225, 100).
  const merged = icons.map((_, i) => ({
    x: 193 + (i % 2) * 38,
    y: 68 + Math.floor(i / 2) * 38,
  }));

  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("text-ink-500", className)}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="sprite-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M16 0H0V16"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect x="24" y="26" width="272" height="148" rx="14" fill="url(#sprite-grid)" />

      {/* Source icon tiles (2×2) */}
      {icons.map((d, i) => (
        <g key={`src-${i}`} transform={`translate(${source[i].x} ${source[i].y})`}>
          <rect
            width="28"
            height="28"
            rx="8"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeOpacity="0.28"
          />
          <path
            d={d}
            transform="translate(4 4)"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Merge arrow (centred at y = 100) */}
      <g
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M124 100 H154" />
        <path d="M148 94 L158 100 L148 106" />
      </g>

      {/* Combined sprite frame */}
      <rect
        x="170"
        y="48"
        width="110"
        height="104"
        rx="12"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="var(--color-acid-400)"
        strokeOpacity="0.55"
      />
      {icons.map((d, i) => (
        <g key={`out-${i}`} transform={`translate(${merged[i].x} ${merged[i].y})`}>
          <path
            d={d}
            transform="translate(3 3)"
            fill="none"
            stroke="var(--color-acid-400)"
            strokeOpacity="0.9"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      <text
        x="225"
        y="168"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="3"
        fontFamily="var(--font-mono)"
        fill="currentColor"
        fillOpacity="0.45"
      >
        SPRITE
      </text>
    </svg>
  );
}
