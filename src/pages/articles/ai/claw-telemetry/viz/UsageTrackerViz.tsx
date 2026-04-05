export default function UsageTrackerViz() {
  const pricing = [
    { model: 'Opus 4.6', input: 15, output: 75, color: '#ec4899' },
    { model: 'Sonnet 4.6', input: 3, output: 15, color: '#3b82f6' },
    { model: 'Haiku 4.5', input: 1, output: 5, color: '#10b981' },
    { model: 'GPT-4o', input: 2.5, output: 10, color: '#8b5cf6' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">UsageTracker — 모델별 단가 ($ per 1M)</text>

        {/* 테이블 헤더 */}
        <rect x={30} y={50} width={500} height={28} fill="var(--muted)" rx={4} />
        <text x={115} y={69} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">모델</text>
        <text x={280} y={69} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">Input</text>
        <text x={445} y={69} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">Output</text>

        {/* 행들 */}
        {pricing.map((p, i) => {
          const y = 84 + i * 40;
          return (
            <g key={p.model}>
              <rect x={30} y={y} width={500} height={34} rx={4}
                fill={p.color} fillOpacity={0.06} stroke={p.color} strokeWidth={0.5} />
              <rect x={30} y={y} width={3} height={34} fill={p.color} rx={1} />
              <text x={115} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={p.color}>{p.model}</text>

              {/* Input bar */}
              <rect x={210} y={y + 10} width={Math.round(p.input * 3)} height={14} rx={2}
                fill={p.color} opacity={0.5} />
              <text x={215 + Math.round(p.input * 3) + 5} y={y + 22} fontSize={9}
                fontWeight={600} fill="var(--foreground)">${p.input}</text>

              {/* Output bar */}
              <rect x={395} y={y + 10} width={Math.round(p.output * 1)} height={14} rx={2}
                fill={p.color} opacity={0.8} />
              <text x={400 + Math.round(p.output * 1) + 5} y={y + 22} fontSize={9}
                fontWeight={600} fill="var(--foreground)">${p.output}</text>
            </g>
          );
        })}

        {/* 총 비용 공식 */}
        <rect x={30} y={260} width={500} height={52} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={281} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          총 비용 = Σ (tokens × price / 1,000,000)
        </text>
        <text x={280} y={299} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          cache_creation: 1.25× · cache_read: 0.1× (90% 절감)
        </text>
      </svg>
    </div>
  );
}
