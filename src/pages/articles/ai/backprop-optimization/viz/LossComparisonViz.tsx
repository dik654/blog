export default function LossComparisonViz() {
  // error 범위 -3 ~ 3
  const errs = Array.from({ length: 121 }, (_, i) => -3 + i * 0.05);

  const mse = (e: number) => e * e;
  const mae = (e: number) => Math.abs(e);
  const huber = (e: number, delta = 1) =>
    Math.abs(e) <= delta ? 0.5 * e * e : delta * (Math.abs(e) - 0.5 * delta);

  const plotX = (e: number) => 70 + ((e + 3) / 6) * 480;
  const plotY = (l: number) => 230 - (l / 9) * 170;

  const pathOf = (fn: (x: number) => number) =>
    errs.map((e, i) => `${i === 0 ? 'M' : 'L'} ${plotX(e).toFixed(1)} ${plotY(fn(e)).toFixed(1)}`).join(' ');

  const curves = [
    { name: 'MSE', path: pathOf(mse), color: '#ef4444', note: '이상치에 민감 (e²)' },
    { name: 'MAE', path: pathOf(mae), color: '#3b82f6', note: '이상치 강함 (|e|)' },
    { name: 'Huber', path: pathOf((e) => huber(e)), color: '#10b981', note: 'MSE+MAE 하이브리드' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">회귀 Loss 비교 — MSE vs MAE vs Huber</text>

        {/* 축 */}
        <line x1={70} y1={230} x2={560} y2={230} stroke="var(--border)" strokeWidth={1.5} />
        <line x1={plotX(0)} y1={50} x2={plotX(0)} y2={230} stroke="var(--border)" strokeWidth={1.5} />

        <text x={568} y={234} fontSize={12} fontWeight={600} fill="var(--muted-foreground)">error</text>
        <text x={plotX(0) - 4} y={44} fontSize={12} fontWeight={600} fill="var(--muted-foreground)" textAnchor="end">L</text>

        {/* x 눈금 */}
        {[-3, -2, -1, 0, 1, 2, 3].map((e) => (
          <g key={e}>
            <line x1={plotX(e)} y1={227} x2={plotX(e)} y2={233} stroke="var(--border)" strokeWidth={1} />
            {e !== 0 && <text x={plotX(e)} y={248} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">{e}</text>}
          </g>
        ))}

        {/* y 눈금 */}
        {[0, 2, 4, 6, 8].map((l) => (
          <g key={l}>
            <line x1={67} y1={plotY(l)} x2={73} y2={plotY(l)} stroke="var(--border)" strokeWidth={1} />
            <text x={62} y={plotY(l) + 4} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">{l}</text>
          </g>
        ))}

        {/* 곡선 */}
        {curves.map((c) => (
          <path key={c.name} d={c.path} fill="none" stroke={c.color} strokeWidth={2.5} opacity={0.9} />
        ))}

        {/* 범례 */}
        {curves.map((c, i) => {
          const x = 70 + i * 170;
          return (
            <g key={c.name}>
              <line x1={x} y1={275} x2={x + 26} y2={275} stroke={c.color} strokeWidth={3} />
              <text x={x + 32} y={279} fontSize={13} fontWeight={700} fill={c.color}>{c.name}</text>
              <text x={x} y={298} fontSize={10} fill="var(--muted-foreground)">{c.note}</text>
            </g>
          );
        })}

        {/* 인사이트 */}
        <rect x={70} y={308} width={490} height={22} rx={4}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.6} />
        <text x={315} y={324} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          MSE: 제곱 → 큰 error 폭증 | MAE: 선형 | Huber: |e|≤δ에서 MSE, 그 외 MAE
        </text>
      </svg>
    </div>
  );
}
