export default function LiquidityIndexViz() {
  // Linear interest: index grows linearly between interactions
  const events = [
    { t: 0, index: 1.0, action: '초기', rate: 5 },
    { t: 3, index: 1.0125, action: 'updateState (interaction)', rate: 5 },
    { t: 6, index: 1.0250, action: 'updateState (interaction)', rate: 5 },
    { t: 9, index: 1.0375, action: 'updateState (interaction)', rate: 5 },
    { t: 12, index: 1.05, action: '1년', rate: 5 },
  ];

  const w = 440;
  const h = 150;
  const padLeft = 60;

  const toX = (t: number) => padLeft + (t / 12) * w;
  const toY = (idx: number) => 68 + h - ((idx - 1.0) / 0.05) * h;

  const pathData = events.map((e, i) => `${i === 0 ? 'M' : 'L'} ${toX(e.t)} ${toY(e.index)}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">liquidityIndex — 상호작용마다 갱신 (Linear 누적)</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={40} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          newIndex = oldIndex × (1 + rate × dt / YEAR)
        </text>
        <text x={260} y={76} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          선형 이자 계산 · 단기간 복리 근사 · 사용자 interaction 시 update
        </text>

        {/* 축 */}
        <line x1={padLeft} y1={68 + h} x2={padLeft + w} y2={68 + h} stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={68} x2={padLeft} y2={68 + h} stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 눈금 */}
        {[1.0, 1.01, 1.02, 1.03, 1.04, 1.05].map(v => {
          const y = toY(v);
          return (
            <g key={v}>
              <line x1={padLeft} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {v.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* X축 눈금 */}
        {[0, 3, 6, 9, 12].map(t => {
          const x = toX(t);
          return (
            <g key={t}>
              <line x1={x} y1={68 + h} x2={x} y2={68 + h + 4} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={68 + h + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {t}개월
              </text>
            </g>
          );
        })}

        {/* Linear 경로 */}
        <path d={pathData} stroke="#10b981" strokeWidth={2.5} fill="none" />

        {/* 이벤트 포인트 */}
        {events.map((e, i) => (
          <g key={i}>
            <circle cx={toX(e.t)} cy={toY(e.index)} r={5} fill="#10b981" stroke="var(--card)" strokeWidth={1.5} />
            <text x={toX(e.t)} y={toY(e.index) - 10} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
              {e.index.toFixed(4)}
            </text>
          </g>
        ))}

        {/* Before/After 예시 */}
        <rect x={20} y={254} width={235} height={76} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.6} />
        <text x={137} y={274} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          user 예치 시점 (t=0)
        </text>
        <text x={32} y={294} fontSize={10} fill="var(--muted-foreground)">scaledBalance</text>
        <text x={242} y={294} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">1000</text>
        <text x={32} y={310} fontSize={10} fill="var(--muted-foreground)">index 저장</text>
        <text x={242} y={310} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">1.0000</text>
        <text x={32} y={324} fontSize={10} fill="var(--muted-foreground)">실제 잔액</text>
        <text x={242} y={324} textAnchor="end" fontSize={10} fontWeight={700} fill="#3b82f6">1,000 USDC</text>

        <rect x={265} y={254} width={235} height={76} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={382} y={274} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          1년 후 조회 (t=12)
        </text>
        <text x={277} y={294} fontSize={10} fill="var(--muted-foreground)">scaledBalance</text>
        <text x={487} y={294} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">1000</text>
        <text x={277} y={310} fontSize={10} fill="var(--muted-foreground)">new index</text>
        <text x={487} y={310} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">1.0500</text>
        <text x={277} y={324} fontSize={10} fill="var(--muted-foreground)">실제 잔액</text>
        <text x={487} y={324} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">1,050 USDC</text>
      </svg>
    </div>
  );
}
