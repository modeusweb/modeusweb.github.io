/**
 * An original, lightweight decorative composition for the hero.
 *
 * It layers the four motifs that define the portfolio — a raster grid, a vector
 * path, a sprite tile cluster, and an encoded string — inside a framed panel.
 * Motion is CSS-driven (a slow line-draw and a gentle pulse) and is disabled
 * under `prefers-reduced-motion` via the global rule in globals.css. Purely
 * decorative.
 */
export function HeroGlyph() {
  return (
    <svg
      viewBox="0 0 420 420"
      className="h-auto w-full max-w-md text-ink-400"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10141b" />
          <stop offset="100%" stopColor="#0b0e13" />
        </linearGradient>
        <pattern id="hero-dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="currentColor" fillOpacity="0.18" />
        </pattern>
      </defs>

      {/* Frame */}
      <rect
        x="20"
        y="20"
        width="380"
        height="380"
        rx="20"
        fill="url(#hero-panel)"
        stroke="#2b333f"
      />
      <rect x="20" y="20" width="380" height="380" rx="20" fill="url(#hero-dots)" />

      {/* Corner ticks */}
      <g stroke="var(--color-acid-400)" strokeWidth="2" fill="none" strokeOpacity="0.8">
        <path d="M20 52 V20 H52" />
        <path d="M368 20 H400 V52" />
        <path d="M400 368 V400 H368" />
        <path d="M52 400 H20 V368" />
      </g>

      {/* Raster block cluster (top-left) */}
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          return (
            <rect
              key={i}
              x={64 + col * 22}
              y={72 + row * 22}
              width={18}
              height={18}
              rx={3}
              fill="currentColor"
              fillOpacity={0.05 + ((i * 5) % 9) / 45}
              stroke="currentColor"
              strokeOpacity="0.15"
            />
          );
        })}
      </g>

      {/* Vector path (animated draw) */}
      <path
        className="hero-draw"
        d="M64 300 C 130 180, 190 360, 256 240 S 340 200, 356 236"
        fill="none"
        stroke="var(--color-acid-400)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g fill="var(--color-acid-400)">
        <circle cx="64" cy="300" r="3.5" />
        <circle cx="356" cy="236" r="3.5" />
      </g>

      {/* Sprite tiles (right) */}
      <g transform="translate(300 300)">
        {["M2 12h20M12 2v20", "M4 12l5 5L20 6", "M5 5h14v14H5z"].map((d, i) => (
          <g key={i} transform={`translate(${(i % 2) * 40} ${Math.floor(i / 2) * 40})`}>
            <rect
              width="32"
              height="32"
              rx="7"
              fill="currentColor"
              fillOpacity="0.05"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <path
              d={d}
              transform="translate(6 6) scale(0.85)"
              fill="none"
              stroke="var(--color-acid-400)"
              strokeOpacity="0.85"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </g>

      {/* Encoded string motif (bottom-left) */}
      <g fontFamily="var(--font-mono)" fontSize="10" fill="currentColor" fillOpacity="0.55">
        <text x="64" y="352">data:image/svg+xml;base64,</text>
        <text x="64" y="368" fill="var(--color-acid-400)" fillOpacity="0.8">
          UENZZy4uLt...
        </text>
      </g>

      <style>{`
        .hero-draw {
          stroke-dasharray: 460;
          stroke-dashoffset: 460;
          animation: hero-draw 2.4s var(--ease-out-expo) 0.4s forwards;
        }
        @keyframes hero-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
