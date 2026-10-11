import { cn } from "@/lib/utils";

/**
 * Raster / image-processing motif for WebP Neo:
 * a source raster photo on the left converted into a compact WebP chip on the
 * right. Everything sits on one horizontal axis (centre y = 100) with even,
 * symmetric padding. Purely decorative.
 */
export function RasterVisual({ className }: { className?: string }) {
  // Photo: x 36–160, y 42–158 (centre y = 100).
  const gridX = Array.from({ length: 6 }, (_, i) => 60 + i * 20);
  const gridY = Array.from({ length: 5 }, (_, i) => 62 + i * 20);

  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("text-ink-500", className)}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="raster-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.26" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
        <clipPath id="raster-clip">
          <rect x="36" y="42" width="124" height="116" rx="14" />
        </clipPath>
      </defs>

      {/* Source photo */}
      <g clipPath="url(#raster-clip)">
        <rect x="36" y="42" width="124" height="116" fill="url(#raster-sky)" />
        {/* horizon */}
        <rect x="36" y="120" width="124" height="38" fill="currentColor" fillOpacity="0.06" />
        {/* sun */}
        <circle cx="98" cy="78" r="12" fill="var(--color-acid-400)" fillOpacity="0.55" />
        {/* ridge, symmetric around photo centre x = 98 */}
        <path
          d="M36 120 L67 88 L98 120 L129 92 L160 120 Z"
          fill="currentColor"
          fillOpacity="0.2"
        />
        {/* pixel grid */}
        <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="1">
          {gridX.map((x) => (
            <line key={`vx-${x}`} x1={x} y1="42" x2={x} y2="158" />
          ))}
          {gridY.map((y) => (
            <line key={`hy-${y}`} x1="36" y1={y} x2="160" y2={y} />
          ))}
        </g>
      </g>
      <rect
        x="36"
        y="42"
        width="124"
        height="116"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
      />

      {/* Conversion arrow (centred at y = 100) */}
      <g
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M172 100 H196" />
        <path d="M190 94 L200 100 L190 106" />
      </g>

      {/* WebP output chip: x 212–292, y 62–138 (centre y = 100) */}
      <g>
        <rect
          x="212"
          y="62"
          width="80"
          height="76"
          rx="14"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeOpacity="0.32"
        />
        <rect
          x="234"
          y="78"
          width="36"
          height="28"
          rx="5"
          fill="none"
          stroke="var(--color-acid-400)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <circle cx="244" cy="87" r="3.2" fill="var(--color-acid-400)" fillOpacity="0.75" />
        <path
          d="M236 102 L244 94 L250 99 L257 92 L265 102 Z"
          fill="var(--color-acid-400)"
          fillOpacity="0.45"
        />
        <text
          x="252"
          y="126"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="0.5"
          fontFamily="var(--font-mono)"
          fill="currentColor"
          fillOpacity="0.75"
        >
          WebP
        </text>
      </g>
    </svg>
  );
}
