export default function TerraTimelineViz() {
  const events = [
    { day: 'May 10', ust: 0.985, luna: 80, event: 'Anchor 대규모 인출', severity: 1 },
    { day: 'May 11', ust: 0.67, luna: 30, event: '심각한 depeg', severity: 2 },
    { day: 'May 12', ust: 0.30, luna: 0.10, event: 'LUNA hyperinflation', severity: 3 },
    { day: 'May 13', ust: 0.10, luna: 0.000001, event: '시스템 중단 · $40B 증발', severity: 4 },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Terra/UST Death Spiral — 2022년 5월 붕괴</text>

        <text x={260} y={42} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">4일 만에 $40B 시총 증발</text>

        {events.map((e, i) => {
          const y = 58 + i * 74;
          const severityColor = ['#f59e0b', '#ef4444', '#991b1b', '#7f1d1d'][e.severity - 1];
          return (
            <g key={i}>
              <rect x={20} y={y} width={480} height={66} rx={8}
                fill={severityColor} fillOpacity={0.08} stroke={severityColor} strokeWidth={0.8}
                strokeDasharray={e.severity >= 3 ? '3 2' : undefined} />

              {/* 날짜 */}
              <rect x={32} y={y + 12} width={90} height={42} rx={4}
                fill="var(--card)" stroke={severityColor} strokeWidth={0.8} />
              <text x={77} y={y + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill={severityColor}>
                2022.{e.day}
              </text>
              <text x={77} y={y + 46} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Day {i + 1}
              </text>

              {/* UST 가격 */}
              <text x={140} y={y + 22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">UST</text>
              <text x={140} y={y + 42} fontSize={14} fontWeight={700} fill={severityColor}>
                ${e.ust.toFixed(3)}
              </text>

              {/* LUNA 가격 */}
              <text x={220} y={y + 22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">LUNA</text>
              <text x={220} y={y + 42} fontSize={14} fontWeight={700} fill={severityColor}>
                ${e.luna < 1 ? e.luna.toFixed(6) : e.luna.toFixed(0)}
              </text>

              {/* 이벤트 */}
              <text x={310} y={y + 28} fontSize={11} fontWeight={700} fill="var(--foreground)">
                {e.event}
              </text>
              {/* 심각도 */}
              <text x={310} y={y + 48} fontSize={10} fontWeight={700} fill={severityColor}>
                {'●'.repeat(e.severity)}{'○'.repeat(4 - e.severity)}
              </text>
            </g>
          );
        })}

        {/* 교훈 */}
        <rect x={20} y={360} width={480} height={0} />
        <text x={260} y={374} textAnchor="middle" fontSize={10} fontStyle="italic" fill="#ef4444">
          교훈: 알고리드믹 페그는 "전방위 신뢰" 필요 · 신뢰 상실 → 연쇄 붕괴
        </text>
      </svg>
    </div>
  );
}
