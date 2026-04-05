export default function StableSwapCurveViz() {
  // 3가지 곡선 생성
  const origin = { x: 50, y: 210 };
  const scale = 20;
  const D = 10; // liquidity depth

  // Constant Product: x·y = (D/2)² = 25
  const cpPoints: [number, number][] = [];
  for (let x = 0.5; x <= 10; x += 0.2) {
    const y = 25 / x;
    if (y <= 10) cpPoints.push([x, y]);
  }

  // Constant Sum: x + y = D = 10
  const csPoints: [number, number][] = [];
  for (let x = 0; x <= 10; x += 0.2) {
    const y = 10 - x;
    if (y >= 0) csPoints.push([x, y]);
  }

  // StableSwap: 혼합 (A=50, D=10)
  // 근사: CP와 CS의 가중 평균 (실제는 복잡한 invariant)
  const ssPoints: [number, number][] = [];
  for (let x = 0.5; x <= 9.5; x += 0.15) {
    // 단순 근사: 균형점 근처는 CS, 극단은 CP 가까이
    const dist = Math.abs(x - 5) / 5;  // 0 (center) to 1 (edge)
    const csY = 10 - x;
    const cpY = 25 / x;
    const weight = Math.pow(dist, 2); // 극단일수록 CP weight ↑
    const y = csY * (1 - weight) + cpY * weight;
    if (y >= 0 && y <= 10) ssPoints.push([x, y]);
  }

  const toPath = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${origin.x + x * scale} ${origin.y - y * scale}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">AMM 곡선 비교 — 같은 유동성 (D=10)</text>

        {/* 축 */}
        <line x1={origin.x} y1={origin.y} x2={origin.x + 11 * scale} y2={origin.y}
          stroke="var(--foreground)" strokeWidth={1} />
        <line x1={origin.x} y1={origin.y} x2={origin.x} y2={origin.y - 11 * scale}
          stroke="var(--foreground)" strokeWidth={1} />

        {/* 그리드 */}
        {[0, 2, 4, 6, 8, 10].map(v => (
          <g key={`g-${v}`}>
            <line x1={origin.x + v * scale} y1={origin.y} x2={origin.x + v * scale} y2={origin.y - 10 * scale}
              stroke="var(--border)" strokeWidth={0.3} opacity={0.3} />
            <line x1={origin.x} y1={origin.y - v * scale} x2={origin.x + 10 * scale} y2={origin.y - v * scale}
              stroke="var(--border)" strokeWidth={0.3} opacity={0.3} />
            <text x={origin.x + v * scale} y={origin.y + 12} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{v}</text>
            <text x={origin.x - 5} y={origin.y - v * scale + 3} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}

        {/* Constant Product (Uniswap) - 파란색 */}
        <path d={toPath(cpPoints)} stroke="#3b82f6" strokeWidth={1.5} fill="none" opacity={0.7} />

        {/* Constant Sum - 빨간색 */}
        <path d={toPath(csPoints)} stroke="#ef4444" strokeWidth={1.5} fill="none" opacity={0.7} strokeDasharray="4 2" />

        {/* StableSwap (Curve) - 초록색 */}
        <path d={toPath(ssPoints)} stroke="#10b981" strokeWidth={2.5} fill="none" />

        {/* 균형점 (center) */}
        <circle cx={origin.x + 5 * scale} cy={origin.y - 5 * scale} r={4} fill="#f59e0b" />

        {/* 라벨 */}
        <text x={origin.x + 10 * scale + 10} y={origin.y + 3} fontSize={8}
          fill="var(--muted-foreground)">token0</text>
        <text x={origin.x - 10} y={origin.y - 10 * scale - 5} textAnchor="end" fontSize={8}
          fill="var(--muted-foreground)">token1</text>

        {/* 범례 */}
        <g transform="translate(295, 55)">
          <rect x={0} y={0} width={165} height={65} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <line x1={8} y1={15} x2={30} y2={15} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={35} y={18} fontSize={8} fill="var(--foreground)">x+y=D (CS, 슬리피지 0)</text>

          <line x1={8} y1={33} x2={30} y2={33} stroke="#10b981" strokeWidth={2.5} />
          <text x={35} y={36} fontSize={8} fontWeight={600} fill="#10b981">StableSwap (혼합)</text>

          <line x1={8} y1={51} x2={30} y2={51} stroke="#3b82f6" strokeWidth={1.5} />
          <text x={35} y={54} fontSize={8} fill="var(--foreground)">x·y=k (CP, Uniswap)</text>
        </g>

        <text x={240} y={247} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">
          페그 근처: CS처럼 flat · 이탈 시: CP로 전환 (유동성 보호)
        </text>
      </svg>
    </div>
  );
}
