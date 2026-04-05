export default function SingletonViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">V3 (컨트랙트 다수) vs V4 (Singleton)</text>

        {/* V3 (왼쪽) */}
        <text x={125} y={50} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#ef4444">V3: 풀마다 컨트랙트</text>

        {[
          { x: 40, y: 66, label: 'ETH/USDC', color: '#3b82f6' },
          { x: 130, y: 66, label: 'ETH/DAI', color: '#8b5cf6' },
          { x: 40, y: 106, label: 'USDC/DAI', color: '#f59e0b' },
          { x: 130, y: 106, label: 'WBTC/ETH', color: '#10b981' },
          { x: 40, y: 146, label: 'LINK/ETH', color: '#ec4899' },
          { x: 130, y: 146, label: '... 수천개', color: '#6b7280' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={80} height={34} rx={4}
              fill={b.color} fillOpacity={0.1} stroke={b.color} strokeWidth={0.8} />
            <text x={b.x + 40} y={b.y + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={b.color}>
              {b.label}
            </text>
            <text x={b.x + 40} y={b.y + 28} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              Pool 0x...
            </text>
          </g>
        ))}

        <text x={125} y={208} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">배포당 ~5M gas</text>
        <text x={125} y={226} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#ef4444">다중 홉 = 컨트랙트 간 호출</text>

        {/* 구분선 */}
        <line x1={250} y1={40} x2={250} y2={288} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />

        {/* V4 (오른쪽) */}
        <text x={390} y={50} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#10b981">V4: Singleton</text>

        <rect x={280} y={66} width={220} height={130} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.2} />
        <text x={390} y={88} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          PoolManager
        </text>
        <text x={390} y={104} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          단일 컨트랙트
        </text>

        <rect x={294} y={116} width={192} height={68} rx={6}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.6} />
        <text x={390} y={132} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
          mapping(PoolId =&gt; Pool.State)
        </text>
        <text x={390} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ETH/USDC, ETH/DAI, ...
        </text>
        <text x={390} y={164} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          모든 풀이 mapping entry
        </text>
        <text x={390} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          (storage write만 필요)
        </text>

        <text x={390} y={208} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">풀 생성당 ~180K gas</text>
        <text x={390} y={226} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#10b981">25배 절감</text>

        {/* 하단 */}
        <rect x={20} y={252} width={480} height={50} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={272} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">핵심 차이</text>
        <text x={260} y={290} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">V3: contract deployment (5M gas) | V4: storage mapping entry (50K gas)</text>
      </svg>
    </div>
  );
}
