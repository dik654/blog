export default function PsmArbitrageViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">PSM 차익거래 — 2가지 페그 회복 시나리오</text>

        <defs>
          <marker id="ar-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 시나리오 1: DAI > $1 */}
        <rect x={20} y={40} width={480} height={158} rx={8}
          fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={1} />
        <text x={36} y={58} fontSize={12} fontWeight={700} fill="#f59e0b">
          시나리오 1 — DAI = $1.02 (페그 초과, 공급 부족)
        </text>

        {/* Step boxes for scenario 1 */}
        {[
          { x: 30, y: 70, w: 110, label: 'USDC 100K', sub: 'Arbitrageur' },
          { x: 150, y: 70, w: 100, label: 'PSM', sub: 'mint DAI' },
          { x: 260, y: 70, w: 120, label: 'DAI 100K', sub: '→ DEX 매도' },
          { x: 390, y: 70, w: 100, label: '$102K 수령', sub: '수익 $2K' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width={s.w} height={44} rx={6}
              fill="var(--card)" stroke="#f59e0b" strokeWidth={0.8} />
            <text x={s.x + s.w / 2} y={s.y + 18} textAnchor="middle" fontSize={10} fontWeight={700}
              fill="var(--foreground)">{s.label}</text>
            <text x={s.x + s.w / 2} y={s.y + 34} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{s.sub}</text>
            {i < 3 && (
              <line x1={s.x + s.w} y1={s.y + 22} x2={s.x + s.w + 10} y2={s.y + 22}
                stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ar-arr)" />
            )}
          </g>
        ))}

        <text x={36} y={134} fontSize={10} fontWeight={600} fill="var(--foreground)">결과:</text>
        <text x={78} y={134} fontSize={10} fill="var(--muted-foreground)">DAI 공급 증가 (100K mint) → 가격 $1.02 → $1.00 회귀</text>

        {/* 수익 공식 */}
        <rect x={30} y={146} width={460} height={42} rx={6}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={42} y={164} fontSize={10} fontWeight={700} fill="#10b981">차익거래 수익:</text>
        <text x={42} y={180} fontSize={10} fill="var(--foreground)">
          DAI 판매액 (102K) − USDC 비용 (100K) = $2,000 (2% margin)
        </text>

        {/* 시나리오 2: DAI < $1 */}
        <rect x={20} y={208} width={480} height={158} rx={8}
          fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1} />
        <text x={36} y={226} fontSize={12} fontWeight={700} fill="#ef4444">
          시나리오 2 — DAI = $0.98 (페그 이하, 수요 부족)
        </text>

        {[
          { x: 30, y: 238, w: 110, label: '$98K USDC', sub: 'Arbitrageur' },
          { x: 150, y: 238, w: 100, label: 'DEX 매수', sub: '→ 100K DAI' },
          { x: 260, y: 238, w: 120, label: 'DAI 100K', sub: '→ PSM 환급' },
          { x: 390, y: 238, w: 100, label: 'USDC 100K', sub: '수익 $2K' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width={s.w} height={44} rx={6}
              fill="var(--card)" stroke="#ef4444" strokeWidth={0.8} />
            <text x={s.x + s.w / 2} y={s.y + 18} textAnchor="middle" fontSize={10} fontWeight={700}
              fill="var(--foreground)">{s.label}</text>
            <text x={s.x + s.w / 2} y={s.y + 34} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{s.sub}</text>
            {i < 3 && (
              <line x1={s.x + s.w} y1={s.y + 22} x2={s.x + s.w + 10} y2={s.y + 22}
                stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#ar-arr)" />
            )}
          </g>
        ))}

        <text x={36} y={302} fontSize={10} fontWeight={600} fill="var(--foreground)">결과:</text>
        <text x={78} y={302} fontSize={10} fill="var(--muted-foreground)">DAI 수요 증가 (DEX 매수) → 가격 $0.98 → $1.00 회귀</text>

        <rect x={30} y={314} width={460} height={42} rx={6}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={42} y={332} fontSize={10} fontWeight={700} fill="#10b981">차익거래 수익:</text>
        <text x={42} y={348} fontSize={10} fill="var(--foreground)">
          USDC 수령 (100K) − DEX 비용 (98K) = $2,000 (2% margin)
        </text>
      </svg>
    </div>
  );
}
