export default function ReserveCompositionViz() {
  const composition = [
    { label: 'US Treasury bills', pct: 80, desc: '< 3개월 단기 국채', color: '#3b82f6' },
    { label: 'Cash', pct: 15, desc: 'BNY Mellon, Customers Bank', color: '#10b981' },
    { label: 'Reverse repo', pct: 5, desc: 'overnight', color: '#f59e0b' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Circle Reserve Fund — USDC 준비금 구성 (2024)</text>

        {/* 누적 막대 */}
        <text x={260} y={56} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">전체 준비금 구성</text>

        <g transform="translate(20, 68)">
          {(() => {
            let offset = 0;
            return composition.map((c) => {
              const start = offset;
              offset += c.pct;
              return (
                <g key={c.label}>
                  <rect x={(start / 100) * 480} y={0} width={(c.pct / 100) * 480} height={40}
                    fill={c.color} fillOpacity={0.9} />
                  <text x={(start / 100) * 480 + (c.pct / 100) * 480 / 2} y={18}
                    textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
                    {c.pct}%
                  </text>
                  {c.pct >= 10 && (
                    <text x={(start / 100) * 480 + (c.pct / 100) * 480 / 2} y={33}
                      textAnchor="middle" fontSize={9} fontWeight={600} fill="#fff">
                      {c.label}
                    </text>
                  )}
                </g>
              );
            });
          })()}
          <rect x={0} y={0} width={480} height={40} rx={4} fill="transparent"
            stroke="var(--border)" strokeWidth={1} />
        </g>

        {/* 상세 박스 */}
        <text x={260} y={140} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">자산별 상세</text>

        {composition.map((c, i) => {
          const y = 154 + i * 54;
          return (
            <g key={c.label}>
              <rect x={20} y={y} width={480} height={44} rx={6}
                fill={c.color} fillOpacity={0.08} stroke={c.color} strokeWidth={0.8} />
              <rect x={20} y={y} width={6} height={44} fill={c.color} rx={2} />
              <text x={40} y={y + 20} fontSize={11} fontWeight={700} fill={c.color}>{c.label}</text>
              <text x={40} y={y + 35} fontSize={9} fill="var(--muted-foreground)">{c.desc}</text>
              <text x={484} y={y + 29} textAnchor="end" fontSize={18} fontWeight={700} fill={c.color}>
                {c.pct}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
