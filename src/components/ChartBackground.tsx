// Animated candlestick / chart background for the hero.
export function ChartBackground() {
  // Generate deterministic candlesticks
  const candles = Array.from({ length: 40 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const r2 = ((i + 7) * 9301 + 49297) % 233280 / 233280;
    const top = 30 + r * 80;
    const height = 20 + r2 * 60;
    const isGreen = r > 0.45;
    return { x: i * 28, top, height, isGreen };
  });

  // Smooth path for the trend line
  const points = Array.from({ length: 60 }, (_, i) => {
    const x = i * 20;
    const y = 200 + Math.sin(i / 4) * 50 + Math.sin(i / 9) * 30 - i * 1.2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Glows */}
      <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      {/* Candles + line */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] animate-chart-drift opacity-50">
        <svg viewBox="0 0 1200 300" className="h-full w-full" preserveAspectRatio="none">
          {candles.map((c, i) => (
            <g key={i}>
              <line
                x1={c.x + 4}
                x2={c.x + 4}
                y1={c.top - 8}
                y2={c.top + c.height + 8}
                stroke={c.isGreen ? "#1db954" : "#ef4444"}
                strokeWidth={1}
                opacity={0.5}
              />
              <rect
                x={c.x}
                y={c.top}
                width={8}
                height={c.height}
                fill={c.isGreen ? "#1db954" : "#ef4444"}
                opacity={0.7}
              />
            </g>
          ))}
          <polyline
            points={points}
            fill="none"
            stroke="#f0b429"
            strokeWidth={2}
            opacity={0.6}
            className="animate-pulse-glow"
          />
        </svg>
      </div>
    </div>
  );
}
