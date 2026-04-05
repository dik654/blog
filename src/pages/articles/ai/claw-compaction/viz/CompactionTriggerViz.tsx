export default function CompactionTriggerViz() {
  const bars = [
    { label: '시스템 프롬프트', value: 15, color: '#6b7280', stacked: true },
    { label: '도구 정의', value: 10, color: '#8b5cf6', stacked: true },
    { label: '압축 요약', value: 8, color: '#10b981', stacked: true },
    { label: '최근 메시지', value: 85, color: '#3b82f6', stacked: true },
  ];

  const totalBudget = 160;
  let cumulative = 0;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 260" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">토큰 예산 관리 — 압축 트리거</text>

        {/* 예산 바 */}
        <rect x={50} y={74} width={460} height={46} rx={4}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />

        {/* Stack 차지 */}
        {bars.map((bar) => {
          const x = 50 + (cumulative / totalBudget) * 460;
          const w = (bar.value / totalBudget) * 460;
          cumulative += bar.value;
          return (
            <g key={bar.label}>
              <rect x={x} y={74} width={w} height={46}
                fill={bar.color} opacity={0.6} />
              {w > 46 && (
                <text x={x + w / 2} y={102} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill="white">{bar.value}K</text>
              )}
            </g>
          );
        })}

        {/* 최대 한계선 */}
        <line x1={50} y1={66} x2={50} y2={128} stroke="var(--foreground)" strokeWidth={1} />
        <line x1={510} y1={66} x2={510} y2={128} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={50} y={142} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">0</text>
        <text x={510} y={142} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">160K (한계)</text>

        {/* 현재 사용량 */}
        <text x={50 + (118 / totalBudget) * 460} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#3b82f6">118K 사용</text>

        {/* 범례 */}
        <g transform="translate(50, 162)">
          {bars.map((bar, i) => (
            <g key={bar.label} transform={`translate(${i * 118}, 0)`}>
              <rect x={0} y={0} width={14} height={14} fill={bar.color} opacity={0.6} rx={2} />
              <text x={20} y={11} fontSize={9} fill="var(--foreground)">{bar.label}</text>
            </g>
          ))}
        </g>

        {/* 압축 트리거 조건 */}
        <rect x={50} y={200} width={460} height={42} rx={6}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
        <text x={280} y={220} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#ef4444">
          should_compact() → true if tokens &gt; 160K
        </text>
        <text x={280} y={234} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">압축 실행 → 최근 15개 보존 + 오래된 것 요약</text>
      </svg>
    </div>
  );
}
