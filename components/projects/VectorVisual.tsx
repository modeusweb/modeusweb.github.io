import { cn } from "@/lib/utils";

/**
 * Vector / SVG-optimisation motif for SVGPress:
 * a dense, node-heavy path being reduced to a single smooth arc, framed by a
 * document outline with an OPTIMISE caption. Purely decorative.
 */
export function VectorVisual({ className }: { className?: string }) {
  // Evenly spaced nodes along a horizontal axis (y = 120); centre x = 160.
  // Zigzag alternates between a low point (120) and a high point (80).
  const nodeX = Array.from({ length: 9 }, (_, i) => 64 + i * 24); // 64 → 256
  const zigzag = nodeX.map((x, i) => `${i === 0 ? "M" : "L"}${x} ${i % 2 === 0 ? 120 : 80}`).join(" ");

  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("text-ink-500", className)}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Document outline */}
      <rect
        x="36"
        y="30"
        width="248"
        height="140"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeDasharray="5 7"
      />

      {/* Dense "before" zigzag with even nodes */}
      <path
        d={zigzag}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="currentColor" fillOpacity="0.5">
        {nodeX.map((x, i) => (
          <rect
            key={x}
            x={x - 3}
            y={(i % 2 === 0 ? 120 : 80) - 3}
            width="6"
            height="6"
            rx="1.5"
          />
        ))}
      </g>

      {/* Simplified "after" arc, symmetric around centre x = 160 */}
      <path
        d="M64 120 Q160 56 256 120"
        fill="none"
        stroke="var(--color-acid-400)"
        strokeOpacity="0.9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g fill="var(--color-acid-400)">
        <circle cx="64" cy="120" r="3.5" fillOpacity="0.9" />
        <circle cx="256" cy="120" r="3.5" fillOpacity="0.9" />
      </g>

      <text
        x="160"
        y="152"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="3"
        fontFamily="var(--font-mono)"
        fill="currentColor"
        fillOpacity="0.45"
      >
        OPTIMISE
      </text>
    </svg>
  );
}
