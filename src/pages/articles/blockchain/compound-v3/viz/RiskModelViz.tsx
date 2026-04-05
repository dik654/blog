export default function RiskModelViz() {
  const caps = [
    { asset: 'WETH', current: 320000, cap: 500000, color: '#3b82f6' },
    { asset: 'WBTC', current: 3200, cap: 5000, color: '#f59e0b' },
    { asset: 'LINK', current: 850000, cap: 1000000, color: '#8b5cf6' },
    { asset: 'UNI', current: 180000, cap: 500000, color: '#ec4899' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Supply Cap — Collateral별 리스크 격리</text>

        {/* Base vs Collateral 차이 */}
        <rect x={20} y={42} width={480} height={52} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={130} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Base Asset (USDC)
        </text>
        <text x={130} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          Cap 없음 (∞)
        </text>
        <text x={130} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          무제한 예치 가능
        </text>

        <line x1={260} y1={52} x2={260} y2={86} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />

        <text x={390} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          Collateral Assets
        </text>
        <text x={390} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          각 자산마다 Supply Cap
        </text>
        <text x={390} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          utilization 기반 차입 제한
        </text>

        {/* Supply Cap 현황 막대 */}
        <text x={260} y={120} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">자산별 Supply Cap 현황</text>

        {caps.map((c, i) => {
          const y = 134 + i * 52;
          const fillPct = (c.current / c.cap) * 100;
          const barW = 340;
          return (
            <g key={i}>
              {/* 자산 라벨 */}
              <text x={20} y={y + 16} fontSize={11} fontWeight={700} fill={c.color}>
                {c.asset}
              </text>
              <text x={20} y={y + 30} fontSize={8} fill="var(--muted-foreground)">
                {(c.current / 1000).toFixed(0)}K / {(c.cap / 1000).toFixed(0)}K
              </text>

              {/* 배경 바 */}
              <rect x={70} y={y + 4} width={barW} height={28} rx={4}
                fill="var(--border)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.3} />
              {/* 사용 바 */}
              <rect x={70} y={y + 4} width={(fillPct / 100) * barW} height={28} rx={4}
                fill={c.color} fillOpacity={0.4} stroke={c.color} strokeWidth={0.8} />
              {/* Cap 표시 */}
              <line x1={70 + barW} y1={y} x2={70 + barW} y2={y + 36}
                stroke="#ef4444" strokeWidth={1.2} strokeDasharray="2 2" />
              <text x={70 + barW - 4} y={y + 22} textAnchor="end" fontSize={10} fontWeight={700} fill="#fff"
                style={{ textShadow: '0 0 2px rgba(0,0,0,0.4)' }}>
                {fillPct.toFixed(0)}%
              </text>

              {/* Cap 라벨 */}
              <text x={420} y={y + 16} fontSize={9} fontWeight={700} fill="#ef4444">CAP</text>
              <text x={420} y={y + 28} fontSize={8} fill="var(--muted-foreground)">
                {(c.cap / 1000).toFixed(0)}K
              </text>
            </g>
          );
        })}

        {/* 3가지 이점 */}
        <text x={260} y={358} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Supply Cap 3가지 이점</text>

        {[
          { x: 20, label: '리스크 격리', desc: 'exploit 영향 제한' },
          { x: 180, label: '점진적 검증', desc: '낮은 cap → 확대' },
          { x: 340, label: 'DAO 제어', desc: 'cap 조정으로 관리' },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y={368} width={160} height={26} rx={4}
              fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.6} />
            <text x={item.x + 80} y={380} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">
              ✓ {item.label}
            </text>
            <text x={item.x + 80} y={390} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              {item.desc}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
