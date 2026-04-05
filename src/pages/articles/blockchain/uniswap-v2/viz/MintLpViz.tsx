export default function MintLpViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">mint() — LP 토큰 발행 공식</text>

        {/* Case 1: 최초 LP */}
        <rect x={20} y={44} width={480} height={132} rx={8}
          fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1} />
        <text x={36} y={64} fontSize={12} fontWeight={700} fill="#3b82f6">Case 1 — 최초 LP (totalSupply = 0)</text>

        {/* 공식 */}
        <rect x={40} y={76} width={440} height={38} rx={6}
          fill="var(--card)" stroke="#3b82f6" strokeWidth={0.6} />
        <text x={260} y={101} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">
          liquidity = √(amount0 × amount1) − MINIMUM_LIQUIDITY
        </text>

        {/* 예시 */}
        <text x={36} y={132} fontSize={10} fontWeight={700} fill="var(--foreground)">예시:</text>
        <text x={80} y={132} fontSize={10} fill="var(--muted-foreground)">amount0 = 1000 USDC</text>
        <text x={260} y={132} fontSize={10} fill="var(--muted-foreground)">amount1 = 1 ETH</text>

        <text x={36} y={150} fontSize={10} fontWeight={700} fill="#10b981">LP:</text>
        <text x={80} y={150} fontSize={10} fill="var(--foreground)">√(1000 × 1) − 1000 = </text>
        <text x={260} y={150} fontSize={11} fontWeight={700} fill="#10b981">30.62 LP</text>

        <text x={36} y={168} fontSize={9} fontWeight={600} fill="#ef4444">잠금:</text>
        <text x={80} y={168} fontSize={9} fill="var(--muted-foreground)">
          1000 wei → address(0) (영구 잠금 · 공격 방지)
        </text>

        {/* Case 2: 기존 LP */}
        <rect x={20} y={188} width={480} height={132} rx={8}
          fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1} />
        <text x={36} y={208} fontSize={12} fontWeight={700} fill="#10b981">Case 2 — 기존 LP (totalSupply ＞ 0)</text>

        <rect x={40} y={220} width={440} height={38} rx={6}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.6} />
        <text x={260} y={245} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          liquidity = min(amount0·total/r0, amount1·total/r1)
        </text>

        <text x={36} y={276} fontSize={10} fontWeight={700} fill="var(--foreground)">예시:</text>
        <text x={80} y={276} fontSize={10} fill="var(--muted-foreground)">amount = 100 + 0.1 ETH</text>
        <text x={260} y={276} fontSize={10} fill="var(--muted-foreground)">reserve = 1000 + 1 ETH</text>

        <text x={36} y={294} fontSize={10} fontWeight={700} fill="#10b981">LP:</text>
        <text x={80} y={294} fontSize={10} fill="var(--foreground)">min(100·100/1000, 0.1·100/1) = </text>
        <text x={340} y={294} fontSize={11} fontWeight={700} fill="#10b981">10 LP</text>

        <text x={36} y={312} fontSize={9} fill="var(--muted-foreground)">
          min() 사용 → 비율이 맞지 않으면 초과분은 손실 (Router가 사전 조정)
        </text>

        {/* 하단 설명 */}
        <text x={260} y={344} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">
          sqrt(x·y) 공식 → 초기 ratio와 무관 · 기존 풀은 비율 맞춰 발행
        </text>
      </svg>
    </div>
  );
}
