export default function AddLiquidityViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">addLiquidity — 최적 비율 자동 계산</text>

        {/* 입력 */}
        <rect x={20} y={42} width={480} height={74} rx={8}
          fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          사용자 의도 (Desired) vs 풀 현재 비율
        </text>

        <text x={40} y={86} fontSize={10} fontWeight={600} fill="var(--muted-foreground)">amountADesired</text>
        <text x={220} y={86} textAnchor="end" fontSize={11} fontWeight={700} fill="var(--foreground)">500 USDC</text>

        <text x={40} y={102} fontSize={10} fontWeight={600} fill="var(--muted-foreground)">amountBDesired</text>
        <text x={220} y={102} textAnchor="end" fontSize={11} fontWeight={700} fill="var(--foreground)">1 ETH</text>

        <text x={260} y={86} fontSize={10} fontWeight={600} fill="var(--muted-foreground)">reserve0 / reserve1</text>
        <text x={480} y={86} textAnchor="end" fontSize={11} fontWeight={700} fill="var(--foreground)">
          3,000,000 / 1,000
        </text>

        <text x={260} y={102} fontSize={10} fontWeight={600} fill="var(--muted-foreground)">현재 가격 (시장가)</text>
        <text x={480} y={102} textAnchor="end" fontSize={11} fontWeight={700} fill="#f59e0b">
          $3,000 / ETH
        </text>

        {/* 비교 */}
        <text x={260} y={140} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">사용자 의도 비율 vs 풀 비율</text>

        <rect x={20} y={152} width={230} height={60} rx={6}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={135} y={172} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          의도 비율 (USDC/ETH)
        </text>
        <text x={135} y={194} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">
          500 / 1 = 500
        </text>

        <rect x={270} y={152} width={230} height={60} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={385} y={172} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          풀 비율 (현재)
        </text>
        <text x={385} y={194} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">
          3M / 1K = 3,000
        </text>

        {/* 판단 */}
        <rect x={20} y={224} width={480} height={40} rx={6}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
        <text x={260} y={248} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          불일치 → ETH 1개면 3000 USDC 필요 (사용자 500만 보유)
        </text>

        {/* 조정 결과 */}
        <text x={260} y={288} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">자동 조정 → amountA 기준 비율 계산</text>

        <rect x={20} y={300} width={480} height={46} rx={8}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1} />
        <text x={40} y={320} fontSize={11} fontWeight={700} fill="#10b981">
          실제 예치:
        </text>
        <text x={140} y={320} fontSize={11} fontWeight={700} fill="var(--foreground)">
          500 USDC + 0.167 ETH
        </text>
        <text x={40} y={336} fontSize={9} fill="var(--muted-foreground)">
          amountB = amountADesired × reserve1 / reserve0 = 500 × 1000 / 3,000,000 = 0.167 ETH
        </text>
      </svg>
    </div>
  );
}
