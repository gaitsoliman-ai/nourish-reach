// Deterministic mock QR — visual placeholder built from a hashed grid.
export function QrMock({ value, size = 200 }: { value: string; size?: number }) {
  const grid = 21;
  const cell = size / grid;
  // simple deterministic hash → pattern
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < grid * grid; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push((h & 1) === 1);
  }
  const isCorner = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= grid - 7) || (r >= grid - 7 && c < 7);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-soft inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="white" />
        {cells.map((on, i) => {
          const r = Math.floor(i / grid);
          const c = i % grid;
          if (isCorner(r, c)) return null;
          if (!on) return null;
          return (
            <rect
              key={i}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="hsl(222 47% 11%)"
            />
          );
        })}
        {/* corner finders */}
        {[
          [0, 0],
          [0, grid - 7],
          [grid - 7, 0],
        ].map(([r, c], i) => (
          <g key={i}>
            <rect x={c * cell} y={r * cell} width={cell * 7} height={cell * 7} fill="hsl(222 47% 11%)" />
            <rect x={(c + 1) * cell} y={(r + 1) * cell} width={cell * 5} height={cell * 5} fill="white" />
            <rect x={(c + 2) * cell} y={(r + 2) * cell} width={cell * 3} height={cell * 3} fill="hsl(22 95% 53%)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
