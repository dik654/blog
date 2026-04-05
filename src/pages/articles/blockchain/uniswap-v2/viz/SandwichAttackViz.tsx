export default function SandwichAttackViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">샌드위치 공격 — MEV bot 프론트런+백런</text>

        <defs>
          <marker id="sa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 블록 내 순서 */}
        <rect x={20} y={44} width={480} height={260} rx={8}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.6} />
        <text x={260} y={64} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--muted-foreground)">블록 N · 트랜잭션 순서</text>

        {[
          {
            y: 76,
            n: 'tx1',
            actor: 'MEV bot',
            action: '프론트런 매수 (100 ETH → USDC)',
            impact: '풀 가격 상승 유도',
            color: '#ef4444',
            amount: '+',
          },
          {
            y: 140,
            n: 'tx2',
            actor: 'User',
            action: '원래 스왑 (10 ETH → ≥29,700 USDC)',
            impact: '더 불리한 가격에 실행',
            color: '#f59e0b',
            amount: '●',
          },
          {
            y: 204,
            n: 'tx3',
            actor: 'MEV bot',
            action: '백런 매도 (USDC → ETH)',
            impact: '차익 실현 + 풀 가격 복귀',
            color: '#8b5cf6',
            amount: '-',
          },
        ].map((tx, i) => (
          <g key={i}>
            <rect x={36} y={tx.y} width={40} height={52} rx={4}
              fill={tx.color} fillOpacity={0.2} stroke={tx.color} strokeWidth={1} />
            <text x={56} y={tx.y + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill={tx.color}>
              {tx.amount}
            </text>
            <text x={56} y={tx.y + 40} textAnchor="middle" fontSize={9} fontWeight={600} fill={tx.color}>
              {tx.n}
            </text>

            <rect x={84} y={tx.y} width={400} height={52} rx={6}
              fill="var(--card)" stroke={tx.color} strokeWidth={0.8} />
            <text x={98} y={tx.y + 20} fontSize={11} fontWeight={700} fill={tx.color}>
              {tx.actor}
            </text>
            <text x={98} y={tx.y + 36} fontSize={10} fill="var(--foreground)">
              {tx.action}
            </text>
            <text x={470} y={tx.y + 46} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
              {tx.impact}
            </text>

            {i < 2 && (
              <line x1={56} y1={tx.y + 52} x2={56} y2={tx.y + 64}
                stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#sa-arr)" />
            )}
          </g>
        ))}

        {/* 방어 */}
        <rect x={20} y={316} width={480} height={40} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={36} y={334} fontSize={11} fontWeight={700} fill="#10b981">방어:</text>
        <text x={78} y={334} fontSize={10} fill="var(--foreground)">
          amountOutMin 설정 (1% slippage) · Flashbots · private mempool
        </text>
        <text x={36} y={348} fontSize={9} fill="var(--muted-foreground)">
          amountOutMin이 너무 낮으면 공격 허용 · 너무 높으면 revert 위험
        </text>
      </svg>
    </div>
  );
}
