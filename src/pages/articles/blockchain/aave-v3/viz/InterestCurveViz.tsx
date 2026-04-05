export default function InterestCurveViz() {
  const origin = { x: 60, y: 200 };
  const w = 340;
  const h = 150;

  // Kink 모델 (USDC 파라미터)
  // U < 90%: rate = 0 + 4% × (U/90)
  // U >= 90%: rate = 4% + 60% × ((U-90)/10)
  const kinkU = 0.9;

  const points: [number, number][] = [];
  for (let u = 0; u <= 1; u += 0.01) {
    let rate;
    if (u <= kinkU) {
      rate = 0 + 0.04 * (u / kinkU);
    } else {
      rate = 0.04 + 0.6 * ((u - kinkU) / (1 - kinkU));
    }
    points.push([u, rate]);
  }

  const maxRate = 0.64;
  const toX = (u: number) => origin.x + u * w;
  const toY = (r: number) => origin.y - (r / maxRate) * h;

  const pathData = points
    .map(([u, r], i) => `${i === 0 ? 'M' : 'L'} ${toX(u)} ${toY(r)}`)
    .join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Aave 이자율 곡선 — Kink 모델 (USDC)</text>

        {/* 축 */}
        <line x1={origin.x} y1={origin.y} x2={origin.x + w} y2={origin.y}
          stroke="var(--foreground)" strokeWidth={1} />
        <line x1={origin.x} y1={origin.y} x2={origin.x} y2={origin.y - h}
          stroke="var(--foreground)" strokeWidth={1} />

        {/* X축 라벨 */}
        {[0, 0.25, 0.5, 0.75, 0.9, 1].map(u => (
          <g key={u}>
            <line x1={toX(u)} y1={origin.y} x2={toX(u)} y2={origin.y + 4}
              stroke="var(--foreground)" strokeWidth={0.8} />
            <text x={toX(u)} y={origin.y + 15} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{(u * 100).toFixed(0)}%</text>
          </g>
        ))}

        {/* Y축 라벨 */}
        {[0, 0.04, 0.2, 0.4, 0.6].map(r => (
          <g key={r}>
            <line x1={origin.x - 4} y1={toY(r)} x2={origin.x} y2={toY(r)}
              stroke="var(--foreground)" strokeWidth={0.8} />
            <text x={origin.x - 7} y={toY(r) + 3} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">{(r * 100).toFixed(0)}%</text>
          </g>
        ))}

        {/* Kink 점선 */}
        <line x1={toX(kinkU)} y1={origin.y} x2={toX(kinkU)} y2={toY(0.04)}
          stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.6} />
        <line x1={origin.x} y1={toY(0.04)} x2={toX(kinkU)} y2={toY(0.04)}
          stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.6} />

        {/* 곡선 */}
        <path d={pathData} stroke="#3b82f6" strokeWidth={2.5} fill="none" />

        {/* Kink 점 */}
        <circle cx={toX(kinkU)} cy={toY(0.04)} r={5} fill="#ef4444" />
        <text x={toX(kinkU)} y={toY(0.04) - 10} textAnchor="middle" fontSize={8} fontWeight={700}
          fill="#ef4444">Optimal</text>
        <text x={toX(kinkU)} y={toY(0.04) - 22} textAnchor="middle" fontSize={7}
          fill="#ef4444">U=90%, rate=4%</text>

        {/* 범례 */}
        <text x={origin.x + w / 2} y={origin.y + 30} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Utilization</text>

        <text x={origin.x - 35} y={origin.y - h + 5} fontSize={8}
          fill="var(--muted-foreground)">Borrow Rate</text>

        {/* 구간 설명 */}
        <text x={toX(0.45)} y={toY(0.02) - 8} textAnchor="middle" fontSize={8}
          fill="#3b82f6">slope1 (완만)</text>
        <text x={toX(0.95)} y={toY(0.35)} textAnchor="middle" fontSize={8}
          fill="#ef4444">slope2 (가파름)</text>

        <text x={240} y={250} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">최적점 초과 시 급격한 증가 → bank run 방지</text>
      </svg>
    </div>
  );
}
