export default function V2vsV3Viz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Compound V2 vs V3 — 역할 구조 비교</text>

        {/* V2 */}
        <text x={130} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          V2 — 모든 자산이 담보 + 차입 가능
        </text>

        <rect x={20} y={62} width={225} height={204} rx={8}
          fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={0.8} />

        <text x={132} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">User A</text>

        {[
          { y: 96, label: 'cUSDC', sub: 'supply + collateral' },
          { y: 126, label: 'cETH', sub: 'supply + collateral' },
          { y: 156, label: 'DAI debt', sub: 'borrow' },
          { y: 186, label: 'USDT debt', sub: 'borrow' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={36} y={b.y} width={190} height={26} rx={4}
              fill="var(--card)" stroke="#ef4444" strokeWidth={0.5} />
            <text x={46} y={b.y + 11} fontSize={10} fontWeight={700} fill="var(--foreground)">{b.label}</text>
            <text x={46} y={b.y + 22} fontSize={8} fill="var(--muted-foreground)">{b.sub}</text>
          </g>
        ))}

        <text x={132} y={248} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">
          복잡 · 다중 HF 계산 · 혼란
        </text>

        {/* 구분선 */}
        <line x1={260} y1={48} x2={260} y2={288} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />

        {/* V3 */}
        <text x={390} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          V3 — base + collateral 역할 분리
        </text>

        <rect x={275} y={62} width={225} height={204} rx={8}
          fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={0.8} />

        <text x={387} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          User A in Comet USDC
        </text>

        {[
          { y: 96, label: 'USDC supplied: 0', sub: 'base asset (not supplying)', color: '#6b7280' },
          { y: 126, label: 'WETH collateral: 5', sub: 'collateral only', color: '#3b82f6' },
          { y: 156, label: 'WBTC collateral: 0.1', sub: 'collateral only', color: '#f59e0b' },
          { y: 186, label: 'USDC debt: 10,000', sub: 'borrowing base', color: '#ef4444' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={291} y={b.y} width={190} height={26} rx={4}
              fill="var(--card)" stroke={b.color} strokeWidth={0.6} />
            <text x={301} y={b.y + 11} fontSize={10} fontWeight={700} fill={b.color}>{b.label}</text>
            <text x={301} y={b.y + 22} fontSize={8} fill="var(--muted-foreground)">{b.sub}</text>
          </g>
        ))}

        <text x={387} y={248} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">
          명확 · 단일 HF · 이해 쉬움
        </text>

        {/* 가스 비교 */}
        <text x={260} y={306} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Gas 비교</text>

        {[
          { op: 'supply', v2: 150, v3: 100 },
          { op: 'borrow', v2: 250, v3: 150 },
          { op: 'liquidate', v2: 300, v3: 200 },
        ].map((c, i) => {
          const x = 20 + i * 163;
          return (
            <g key={i}>
              <rect x={x} y={318} width={154} height={72} rx={6}
                fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
              <text x={x + 77} y={338} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                {c.op}
              </text>
              <text x={x + 16} y={360} fontSize={10} fontWeight={700} fill="#ef4444">V2: {c.v2}K</text>
              <text x={x + 138} y={360} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">
                V3: {c.v3}K
              </text>
              <text x={x + 77} y={380} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
                -{Math.round(((c.v2 - c.v3) / c.v2) * 100)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
