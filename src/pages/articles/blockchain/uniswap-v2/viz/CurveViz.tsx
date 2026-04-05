export default function CurveViz() {
  // x·y = k 쌍곡선 그리기 (k=100 가정)
  const k = 100;
  const points: [number, number][] = [];
  for (let x = 1; x <= 20; x += 0.3) {
    const y = k / x;
    if (y <= 20) {
      points.push([x, y]);
    }
  }

  const scale = 20;
  const originX = 60;
  const originY = 260;

  const pathData = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${originX + x * scale} ${originY - y * scale}`)
    .join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">x · y = k — Constant Product 곡선</text>

        {/* 그리드 */}
        {[0, 5, 10, 15, 20].map(v => (
          <g key={`gx-${v}`}>
            <line x1={originX + v * scale} y1={originY} x2={originX + v * scale} y2={originY - 20 * scale}
              stroke="var(--border)" strokeWidth={0.3} opacity={0.3} />
            <text x={originX + v * scale} y={originY + 16} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}
        {[0, 5, 10, 15, 20].map(v => (
          <g key={`gy-${v}`}>
            <line x1={originX} y1={originY - v * scale} x2={originX + 20 * scale} y2={originY - v * scale}
              stroke="var(--border)" strokeWidth={0.3} opacity={0.3} />
            <text x={originX - 10} y={originY - v * scale + 4} textAnchor="end"
              fontSize={9} fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}

        {/* 축 */}
        <line x1={originX} y1={originY} x2={originX + 20 * scale} y2={originY}
          stroke="var(--foreground)" strokeWidth={1} />
        <line x1={originX} y1={originY} x2={originX} y2={originY - 20 * scale}
          stroke="var(--foreground)" strokeWidth={1} />
        <text x={originX + 20 * scale + 10} y={originY + 4} fontSize={10}
          fill="var(--muted-foreground)">x (token0)</text>
        <text x={originX - 8} y={originY - 20 * scale - 8} textAnchor="end" fontSize={10}
          fill="var(--muted-foreground)">y (token1)</text>

        {/* 곡선 */}
        <path d={pathData} stroke="#3b82f6" strokeWidth={2.5} fill="none" />

        {/* Point A (10, 10) */}
        <circle cx={originX + 10 * scale} cy={originY - 10 * scale} r={5} fill="#10b981" stroke="var(--card)" strokeWidth={1.5} />
        <text x={originX + 10 * scale + 10} y={originY - 10 * scale - 10} fontSize={10}
          fontWeight={700} fill="#10b981">A (10, 10)</text>
        <text x={originX + 10 * scale + 10} y={originY - 10 * scale + 4} fontSize={9}
          fill="var(--muted-foreground)">초기 reserve</text>

        {/* Point B (5, 20) — 스왑 후 */}
        <circle cx={originX + 5 * scale} cy={originY - 20 * scale} r={5} fill="#f59e0b" stroke="var(--card)" strokeWidth={1.5} />
        <text x={originX + 5 * scale + 10} y={originY - 20 * scale - 8} fontSize={10}
          fontWeight={700} fill="#f59e0b">B (5, 20)</text>
        <text x={originX + 5 * scale + 10} y={originY - 20 * scale + 6} fontSize={9}
          fill="var(--muted-foreground)">x↓ y↑</text>

        {/* Point C (20, 5) — 반대 방향 */}
        <circle cx={originX + 20 * scale} cy={originY - 5 * scale} r={5} fill="#8b5cf6" stroke="var(--card)" strokeWidth={1.5} />
        <text x={originX + 20 * scale - 10} y={originY - 5 * scale - 10} textAnchor="end" fontSize={10}
          fontWeight={700} fill="#8b5cf6">C (20, 5)</text>
        <text x={originX + 20 * scale - 10} y={originY - 5 * scale + 4} textAnchor="end" fontSize={9}
          fill="var(--muted-foreground)">x↑ y↓</text>

        {/* 설명 */}
        <text x={260} y={306} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">
          모든 점이 x·y=100 만족 · 스왑 시 곡선 위 이동 · 슬리피지는 곡률에서 발생
        </text>
      </svg>
    </div>
  );
}
