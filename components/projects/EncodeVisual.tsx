import { cn } from "@/lib/utils";

/**
 * SVG-to-base64 / encoding motif for BaseVector:
 * a vector glyph on the left transforming into an encoded data-URI string on
 * the right. Purely decorative; the encoded text is illustrative only.
 */
export function EncodeVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("text-ink-500", className)}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Source SVG glyph — a clean "image" placeholder on a pixel grid */}
      <g transform="translate(32 54)">
        <rect
          width="76"
          height="92"
          rx="12"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeOpacity="0.28"
        />
        {/* Sun */}
        <circle cx="32" cy="28" r="7" fill="var(--color-acid-400)" fillOpacity="0.5" />
        {/* Two hills sharing an even baseline at y = 74 */}
        <path
          d="M14 74 L28 52 L42 74 Z"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M38 74 L50 58 L62 74 Z"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Even ground line */}
        <path d="M14 74 H62" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Arrow */}
      <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M120 100 H148" />
        <path d="M142 94 L152 100 L142 106" />
      </g>

      {/* Encoded string block: x 168–292, y 44–156 (centre = 230,100) */}
      <g>
        <rect
          x="168"
          y="44"
          width="124"
          height="112"
          rx="14"
          fill="currentColor"
          fillOpacity="0.04"
          stroke="currentColor"
          strokeOpacity="0.26"
        />
        <text
          fontFamily="var(--font-mono)"
          fontSize="8"
          fill="currentColor"
          fillOpacity="0.8"
        >
          {/* Left-aligned on x=184, 18px rhythm, vertically centred on y=100 */}
          <tspan x="184" y="73">
            data:image/svg+xml;
          </tspan>
          <tspan x="184" y="91" fill="var(--color-acid-400)" fillOpacity="0.9">
            base64,PHN2ZyB2aWV3
          </tspan>
          <tspan x="184" y="109">
            Qm94PSIwIDAgNjQg
          </tspan>
          <tspan x="184" y="127" fillOpacity="0.45">
            NjQiIHhtbG5zPSJ...
          </tspan>
        </text>
      </g>
    </svg>
  );
}
