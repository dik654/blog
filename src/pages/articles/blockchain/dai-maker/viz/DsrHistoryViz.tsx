export default function DsrHistoryViz() {
  const history = [
    { year: 2020, dsr: 0, note: '긴급 셧다운 근처' },
    { year: 2021, dsr: 0.01, note: '낮은 금리 환경' },
    { year: 2022, dsr: 1, note: 'Fed 금리 인상 시작' },
    { year: 2023, dsr: 8, note: '5% → 8% 급등' },
    { year: 2024, dsr: 12, note: 'Spark SubDAO 최고점' },
    { year: 2025, dsr: 6.5, note: '안정화' },
  ];

  const w = 440;
  const h = 160;
  const padLeft = 48;
  const maxRate = 14;

  const toX = (i: number) => padLeft + (i / (history.length - 1)) * w;
  const toY = (r: number) => 56 + h - (r / maxRate) * h;

  const pathData = history.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.dsr)}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">DSR 연도별 이력 — Fed 금리와 연동</text>

        {/* 축 */}
        <line x1={padLeft} y1={56 + h} x2={padLeft + w} y2={56 + h}
          stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={56} x2={padLeft} y2={56 + h}
          stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 눈금 */}
        {[0, 3, 6, 9, 12].map(r => {
          const y = toY(r);
          return (
            <g key={r}>
              <line x1={padLeft - 3} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={10}
                fill="var(--muted-foreground)">{r}%</text>
            </g>
          );
        })}

        {/* X축 눈금 */}
        {history.map((p, i) => {
          const x = toX(i);
          return (
            <g key={p.year}>
              <line x1={x} y1={56 + h} x2={x} y2={56 + h + 4} stroke="var(--foreground)" strokeWidth={0.6} />
              <text x={x} y={56 + h + 18} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                {p.year}
              </text>
            </g>
          );
        })}

        {/* 영역 채우기 */}
        <path
          d={`${pathData} L ${toX(history.length - 1)} ${56 + h} L ${padLeft} ${56 + h} Z`}
          fill="#10b981" fillOpacity={0.12}
        />

        {/* 라인 */}
        <path d={pathData} stroke="#10b981" strokeWidth={2.5} fill="none" />

        {/* 포인트 */}
        {history.map((p, i) => (
          <g key={p.year}>
            <circle cx={toX(i)} cy={toY(p.dsr)} r={5} fill="#10b981" stroke="var(--card)" strokeWidth={1.5} />
            <text x={toX(i)} y={toY(p.dsr) - 12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
              {p.dsr}%
            </text>
          </g>
        ))}

        {/* 하단 설명 */}
        <rect x={20} y={254} width={480} height={40} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={30} y={272} fontSize={10} fontWeight={700} fill="var(--foreground)">조정 메커니즘:</text>
        <text x={138} y={272} fontSize={10} fill="var(--muted-foreground)">
          DAI ＞ $1 → DSR↓ (수요↓) · DAI ＜ $1 → DSR↑ (수요↑)
        </text>
        <text x={30} y={288} fontSize={9.5} fill="var(--muted-foreground)">
          2023-2024 Fed 금리 인상 반영 → DSR 급등 (전통 stable yield + 프리미엄)
        </text>
      </svg>
    </div>
  );
}
