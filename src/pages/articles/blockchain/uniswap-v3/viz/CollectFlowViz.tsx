export default function CollectFlowViz() {
  const steps = [
    { n: 1, label: 'getFeeGrowthInside()', detail: '최신 Inside 값 조회 (포함-배제)', color: '#3b82f6' },
    { n: 2, label: '증분 계산', detail: 'Δ = Inside_now − Inside_last', color: '#f59e0b' },
    { n: 3, label: 'tokensOwed 업데이트', detail: 'owed += Δ × liquidity', color: '#8b5cf6' },
    { n: 4, label: '스냅샷 + 전송', detail: 'last = Inside_now · token 전송', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 310" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">collect() — 수수료 수거 4단계</text>

        <defs>
          <marker id="cf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {steps.map((s, i) => {
          const y = 46 + i * 60;
          return (
            <g key={s.n}>
              <circle cx={44} cy={y + 24} r={16} fill={s.color} />
              <text x={44} y={y + 30} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
                {s.n}
              </text>
              <rect x={76} y={y} width={424} height={48} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
              <text x={90} y={y + 22} fontSize={12} fontWeight={700} fill={s.color}>
                {s.label}
              </text>
              <text x={90} y={y + 38} fontSize={10} fill="var(--muted-foreground)">
                {s.detail}
              </text>
              {i < steps.length - 1 && (
                <line x1={44} y1={y + 40} x2={44} y2={y + 60}
                  stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#cf-arr)" />
              )}
            </g>
          );
        })}

        {/* 주의 */}
        <rect x={20} y={292} width={480} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={305} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">
          마지막 수거 이후 누적된 수수료만 계산 (이중 청구 방지) · 부분 수거 가능
        </text>
      </svg>
    </div>
  );
}
