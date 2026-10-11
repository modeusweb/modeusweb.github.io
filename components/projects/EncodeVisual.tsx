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
      {/* Source SVG glyph */}
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
        <circle cx="38" cy="36" r="14" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" />
        <path
          d="M18 74 L38 48 L58 74 Z"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* Arrow */}
      <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M118 100 H146" />
        <path d="M140 94 L150 100 L140 106" />
      </g>

      {/* Encoded string block: x 168–292, y 44–156 (centre y = 100) */}
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
          fontSize="9"
          fill="currentColor"
          fillOpacity="0.75"
        >
          {/* Even 22px line rhythm, centred around the block's vertical axis */}
          <tspan x="182" y="70">
            data:image/svg+xml;
          </tspan>
          <tspan x="182" y="92" fill="var(--color-acid-400)" fillOpacity="0.9">
            base64,PHN2ZyB2aWV3
          </tspan>
          <tspan x="182" y="114">
            Qm94PSIwIDAgNjQgNjQi
          </tspan>
          <tspan x="182" y="136" fillOpacity="0.5">
            PGRlZnMvPjxyZWN0
          </tspan>
        </text>
      </g>
    </svg>
  );
}
