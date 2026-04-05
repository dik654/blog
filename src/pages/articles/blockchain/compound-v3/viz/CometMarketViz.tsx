export default function CometMarketViz() {
  const collaterals = [
    { name: 'WETH', ltv: 83, lt: 90, color: '#3b82f6' },
    { name: 'WBTC', ltv: 70, lt: 77, color: '#f59e0b' },
    { name: 'LINK', ltv: 67, lt: 73, color: '#8b5cf6' },
    { name: 'UNI', ltv: 64, lt: 71, color: '#ec4899' },
    { name: 'COMP', ltv: 60, lt: 67, color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Comet USDC Market — 구조 (1 Base + N Collateral)</text>

        <defs>
          <marker id="cm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>

        {/* 최상단 — Comet USDC Market */}
        <rect x={140} y={42} width={240} height={56} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={260} y={64} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          Comet USDC Market
        </text>
        <text x={260} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          컨트랙트 1개 · Base: USDC
        </text>

        {/* Base Asset 박스 (왼쪽) */}
        <rect x={20} y={124} width={220} height={90} rx={8}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={130} y={144} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Base Asset: USDC
        </text>
        <text x={32} y={164} fontSize={10} fill="var(--muted-foreground)">• 예치 → 이자 수령</text>
        <text x={32} y={180} fontSize={10} fill="var(--muted-foreground)">• 차입 → 이자 지불</text>
        <text x={32} y={196} fontSize={10} fill="var(--muted-foreground)">• 이자율: utilization 기반</text>
        <text x={32} y={210} fontSize={9} fontWeight={700} fill="#3b82f6">
          ❌ 담보 역할 없음
        </text>

        {/* Collateral Assets 박스 (오른쪽) */}
        <rect x={260} y={124} width={240} height={90} rx={8}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={380} y={144} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          Collateral Assets (N개)
        </text>
        <text x={272} y={164} fontSize={10} fill="var(--muted-foreground)">• 담보 전용 (이자 없음)</text>
        <text x={272} y={180} fontSize={10} fill="var(--muted-foreground)">• 차입 불가</text>
        <text x={272} y={196} fontSize={10} fill="var(--muted-foreground)">• 각자 supply cap 설정</text>
        <text x={272} y={210} fontSize={9} fontWeight={700} fill="#f59e0b">
          ✓ 순수 담보 역할
        </text>

        {/* 화살표 from top to base/collateral */}
        <line x1={220} y1={98} x2={140} y2={124} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#cm-arr)" />
        <line x1={300} y1={98} x2={360} y2={124} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#cm-arr)" />

        {/* Collateral 리스트 */}
        <text x={260} y={240} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">담보 자산별 파라미터</text>

        {collaterals.map((c, i) => {
          const y = 254 + i * 26;
          return (
            <g key={i}>
              <rect x={20} y={y} width={480} height={22} rx={4}
                fill={c.color} fillOpacity={0.08} stroke={c.color} strokeWidth={0.5} />
              <rect x={20} y={y} width={5} height={22} fill={c.color} rx={2} />
              <text x={40} y={y + 15} fontSize={10} fontWeight={700} fill={c.color}>{c.name}</text>
              <text x={200} y={y + 15} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                borrow LTV: <tspan fontWeight={700} fill="var(--foreground)">{c.ltv}%</tspan>
              </text>
              <text x={340} y={y + 15} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                liquidate LT: <tspan fontWeight={700} fill="var(--foreground)">{c.lt}%</tspan>
              </text>
              <text x={480} y={y + 15} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                안전 마진 {c.lt - c.ltv}%
              </text>
            </g>
          );
        })}

        {/* 독립 market */}
        <rect x={20} y={388} width={480} height={0} />
        <text x={260} y={395} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">여러 Market 동시 존재: Comet USDC / Comet ETH / Comet USDbC (Base) — 각 독립</text>
      </svg>
    </div>
  );
}
