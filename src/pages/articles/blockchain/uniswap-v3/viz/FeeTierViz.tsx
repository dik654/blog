export default function FeeTierViz() {
  const tiers = [
    { fee: '0.01%', spacing: 1, use: 'Stable 페어', example: 'USDC/USDT', color: '#06b6d4' },
    { fee: '0.05%', spacing: 10, use: 'Correlated', example: 'ETH/stETH', color: '#10b981' },
    { fee: '0.3%', spacing: 60, use: '일반 페어', example: 'ETH/USDC', color: '#3b82f6' },
    { fee: '1%', spacing: 200, use: 'Exotic', example: 'SHIB/ETH', color: '#ef4444' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">4개 Fee Tier — 변동성에 맞춘 수수료</text>

        {tiers.map((t, i) => {
          const y = 52 + i * 62;
          return (
            <g key={i}>
              {/* tier 박스 */}
              <rect x={20} y={y} width={480} height={54} rx={8}
                fill={t.color} fillOpacity={0.08} stroke={t.color} strokeWidth={1} />

              {/* 수수료 강조 */}
              <rect x={30} y={y + 10} width={80} height={34} rx={4}
                fill={t.color} fillOpacity={0.25} stroke={t.color} strokeWidth={0.8} />
              <text x={70} y={y + 32} textAnchor="middle" fontSize={14} fontWeight={700} fill={t.color}>
                {t.fee}
              </text>

              {/* tick spacing 시각화 */}
              <g transform={`translate(130, ${y + 12})`}>
                <text x={0} y={10} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">
                  tick spacing
                </text>
                <text x={0} y={24} fontSize={13} fontWeight={700} fill="var(--foreground)">
                  {t.spacing}
                </text>

                {/* spacing 표시 눈금 */}
                <line x1={56} y1={16} x2={176} y2={16} stroke={t.color} strokeWidth={0.8} />
                {Array.from({ length: Math.min(6, Math.ceil(200 / t.spacing) + 1) }).map((_, j) => {
                  const gap = Math.max(20, 120 / Math.min(6, Math.ceil(200 / t.spacing)));
                  const xj = 56 + j * gap;
                  if (xj > 176) return null;
                  return (
                    <line key={j} x1={xj} y1={12} x2={xj} y2={20} stroke={t.color} strokeWidth={1} />
                  );
                })}
              </g>

              {/* 용도 */}
              <text x={330} y={y + 22} fontSize={11} fontWeight={700} fill="var(--foreground)">
                {t.use}
              </text>
              <text x={330} y={y + 38} fontSize={10} fill="var(--muted-foreground)">
                예: {t.example}
              </text>

              {/* 변동성 인디케이터 */}
              <rect x={444} y={y + 14} width={48} height={26} rx={4}
                fill={t.color} fillOpacity={0.15} stroke={t.color} strokeWidth={0.6} />
              <text x={468} y={y + 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={t.color}>
                {['낮음', '낮음', '중간', '높음'][i]}
              </text>
            </g>
          );
        })}

        {/* 하단 설명 */}
        <text x={260} y={316} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">ETH/USDC는 3개 tier(0.05%, 0.3%, 1%) 병존 · 시장이 자연스럽게 유동성 tier 결정</text>
      </svg>
    </div>
  );
}
