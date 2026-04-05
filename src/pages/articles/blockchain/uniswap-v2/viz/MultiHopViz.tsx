export default function MultiHopViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 250" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">다중 홉 라우팅 — A → B → C → D</text>

        <defs>
          <marker id="arr-hop" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="arr-dash" markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>

        {/* Router */}
        <rect x={20} y={58} width={80} height={50} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={60} y={80} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Router
        </text>
        <text x={60} y={96} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          _swap(...)
        </text>

        {/* 토큰 체인 */}
        {[
          { x: 120, label: 'DAI', sub: 'A', color: '#f59e0b' },
          { x: 222, label: 'WETH', sub: 'B', color: '#10b981' },
          { x: 324, label: 'USDC', sub: 'C', color: '#8b5cf6' },
          { x: 426, label: 'WBTC', sub: 'D', color: '#ef4444' },
        ].map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={58} width={72} height={50} rx={25}
              fill={t.color} fillOpacity={0.1} stroke={t.color} strokeWidth={1} />
            <text x={t.x + 36} y={80} textAnchor="middle" fontSize={12} fontWeight={700} fill={t.color}>
              {t.label}
            </text>
            <text x={t.x + 36} y={96} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              token {t.sub}
            </text>
          </g>
        ))}

        {/* Pair 컨트랙트들 */}
        {[
          { x: 156, label: 'Pair A/B', sub: 'DAI/WETH' },
          { x: 258, label: 'Pair B/C', sub: 'WETH/USDC' },
          { x: 360, label: 'Pair C/D', sub: 'USDC/WBTC' },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={144} width={100} height={42} rx={6}
              fill="#6b7280" fillOpacity={0.1} stroke="#6b7280" strokeWidth={0.8} />
            <text x={p.x + 50} y={162} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6b7280">
              {p.label}
            </text>
            <text x={p.x + 50} y={176} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {p.sub}
            </text>
          </g>
        ))}

        {/* 토큰 이동 화살표 (가로) */}
        <line x1={192} y1={83} x2={222} y2={83}
          stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arr-hop)" />
        <line x1={294} y1={83} x2={324} y2={83}
          stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arr-hop)" />
        <line x1={396} y1={83} x2={426} y2={83}
          stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arr-hop)" />

        {/* Pair 연결 (세로 점선) */}
        <line x1={206} y1={108} x2={206} y2={144} stroke="#6b7280" strokeWidth={0.5} strokeDasharray="3 2" />
        <line x1={308} y1={108} x2={308} y2={144} stroke="#6b7280" strokeWidth={0.5} strokeDasharray="3 2" />
        <line x1={410} y1={108} x2={410} y2={144} stroke="#6b7280" strokeWidth={0.5} strokeDasharray="3 2" />

        {/* Router 지시 */}
        <line x1={100} y1={83} x2={120} y2={83}
          stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arr-hop)" />

        {/* 설명 */}
        <text x={260} y={212} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">다음 Pair를 to 주소로 지정 → Router 경유 없음</text>
        <text x={260} y={232} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">각 홉은 다음 Pair로 직접 전송 → gas 절감 (3홉도 단일 tx)</text>
      </svg>
    </div>
  );
}
