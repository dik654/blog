export default function SystemArchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">시스템 구조 — Pool → Asset Pools → Users</text>

        <defs>
          <marker id="sa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>

        {/* 최상단 — Pool Contract */}
        <rect x={190} y={46} width={140} height={50} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={260} y={66} textAnchor="middle" fontSize={13} fontWeight={700} fill="#8b5cf6">
          Pool Contract
        </text>
        <text x={260} y={84} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          메인 진입점
        </text>

        {/* 중간 — 3개 Asset Pool */}
        {[
          { x: 30, label: 'USDC Pool', size: '$500M', color: '#06b6d4' },
          { x: 200, label: 'ETH Pool', size: '$200M', color: '#3b82f6' },
          { x: 370, label: 'WBTC Pool', size: '$80M', color: '#f59e0b' },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={128} width={120} height={50} rx={8}
              fill={p.color} fillOpacity={0.1} stroke={p.color} strokeWidth={1} />
            <text x={p.x + 60} y={148} textAnchor="middle" fontSize={11} fontWeight={700} fill={p.color}>
              {p.label}
            </text>
            <text x={p.x + 60} y={166} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">
              {p.size}
            </text>
            {/* Pool → Asset Pool 연결선 */}
            <line x1={260} y1={96} x2={p.x + 60} y2={128}
              stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sa-arr)" />
          </g>
        ))}

        {/* 하단 — Lenders + Borrowers (USDC Pool 하위) */}
        <rect x={30} y={216} width={55} height={50} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={57} y={234} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          Lenders
        </text>
        <text x={57} y={250} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          aToken
        </text>
        <text x={57} y={260} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          수령
        </text>

        <rect x={95} y={216} width={55} height={50} rx={6}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
        <text x={122} y={234} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          Borrowers
        </text>
        <text x={122} y={250} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          DebtToken
        </text>
        <text x={122} y={260} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          수령
        </text>

        {/* USDC Pool → Users 연결선 */}
        <line x1={70} y1={178} x2={57} y2={216}
          stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sa-arr)" />
        <line x1={110} y1={178} x2={122} y2={216}
          stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sa-arr)" />

        {/* 중간 Pool에도 동일 구조 (축약) */}
        <rect x={205} y={216} width={110} height={50} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={260} y={242} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
          Lenders + Borrowers
        </text>
        <text x={260} y={258} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          (동일 구조)
        </text>
        <line x1={260} y1={178} x2={260} y2={216}
          stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sa-arr)" />

        <rect x={375} y={216} width={110} height={50} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={430} y={242} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
          Lenders + Borrowers
        </text>
        <text x={430} y={258} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          (동일 구조)
        </text>
        <line x1={430} y1={178} x2={430} y2={216}
          stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sa-arr)" />

        {/* 핵심 원리 */}
        <rect x={20} y={284} width={480} height={46} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={304} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          Pool Contract — 단일 진입점 + 자산별 독립 풀
        </text>
        <text x={260} y={322} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          각 자산은 별도 Reserve · 자체 이자율 · aToken/DebtToken 컨트랙트
        </text>
      </svg>
    </div>
  );
}
