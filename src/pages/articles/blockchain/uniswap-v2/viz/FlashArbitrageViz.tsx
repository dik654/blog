export default function FlashArbitrageViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Flash Arbitrage — Uniswap ↔ SushiSwap 가격차</text>

        <defs>
          <marker id="fa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="fa-arr-g" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#10b981" />
          </marker>
        </defs>

        {/* 시세 상황 */}
        <rect x={20} y={42} width={480} height={56} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">시세 차이 감지</text>

        <text x={40} y={84} fontSize={10} fill="#3b82f6" fontWeight={700}>Uniswap:</text>
        <text x={110} y={84} fontSize={10} fill="var(--foreground)">1 WETH = 3,000 USDC</text>

        <text x={270} y={84} fontSize={10} fill="#ef4444" fontWeight={700}>SushiSwap:</text>
        <text x={350} y={84} fontSize={10} fill="var(--foreground)">1 WETH = 3,100 USDC</text>

        {/* 4단계 */}
        {[
          {
            n: 1, y: 110, label: 'Uniswap에서 WETH 빌리기 (담보 없음)',
            detail: 'pair.swap(0, 1e18, this, "trigger")',
            color: '#3b82f6',
          },
          {
            n: 2, y: 162, label: 'SushiSwap에서 WETH → USDC 매도',
            detail: '1 WETH × $3,100 = 3,100 USDC 획득',
            color: '#ef4444',
          },
          {
            n: 3, y: 214, label: '상환 USDC 계산 (0.3% 수수료)',
            detail: 'usdcOwed = 3,009 USDC (3000/0.997)',
            color: '#8b5cf6',
          },
          {
            n: 4, y: 266, label: '상환 + 차익 실현',
            detail: '3,100 - 3,009 = 91 USDC 수익',
            color: '#10b981',
          },
        ].map(s => (
          <g key={s.n}>
            <circle cx={42} cy={s.y + 20} r={15} fill={s.color} />
            <text x={42} y={s.y + 26} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
              {s.n}
            </text>
            <rect x={70} y={s.y} width={430} height={40} rx={6}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
            <text x={82} y={s.y + 18} fontSize={11} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={82} y={s.y + 34} fontSize={10} fill="var(--muted-foreground)">
              {s.detail}
            </text>
            {s.n < 4 && (
              <line x1={42} y1={s.y + 35} x2={42} y2={s.y + 52} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#fa-arr)" />
            )}
          </g>
        ))}

        {/* 순이익 */}
        <rect x={20} y={316} width={480} height={20} rx={4}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={0.6} />
        <text x={260} y={331} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#10b981">순이익 91 USDC · 실패하면 전체 revert (자본 0 리스크)</text>
      </svg>
    </div>
  );
}
