export default function BalanceDeltaViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">BalanceDelta — 부호의 의미</text>

        {/* delta 부호 의미 */}
        <rect x={20} y={42} width={235} height={100} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} />
        <text x={137} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          음수 delta (delta ＜ 0)
        </text>
        <text x={137} y={82} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">
          User가 PoolManager에 빚
        </text>
        <text x={137} y={102} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          User는 settle()로 토큰 입금 필요
        </text>
        <text x={137} y={120} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">
          예: swap 입력 토큰 (-amount0)
        </text>

        <rect x={265} y={42} width={235} height={100} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
        <text x={382} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          양수 delta (delta ＞ 0)
        </text>
        <text x={382} y={82} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">
          PoolManager가 User에 빚
        </text>
        <text x={382} y={102} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          User는 take()로 토큰 수령
        </text>
        <text x={382} y={120} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
          예: swap 출력 토큰 (+amount1)
        </text>

        {/* 상태 전이 예시 */}
        <text x={260} y={172} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">swap 예시 상태 전이</text>

        <rect x={20} y={186} width={480} height={60} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={36} y={206} fontSize={11} fontWeight={700} fill="var(--foreground)">swap(USDC → ETH)</text>
        <text x={36} y={226} fontSize={10} fill="var(--muted-foreground)">delta[USDC] = </text>
        <text x={148} y={226} fontSize={11} fontWeight={700} fill="#ef4444">-1000 (settle 필요)</text>
        <text x={36} y={240} fontSize={10} fill="var(--muted-foreground)">delta[ETH] = </text>
        <text x={148} y={240} fontSize={11} fontWeight={700} fill="#10b981">+0.33 (take 가능)</text>

        {/* nonZeroDeltaCount */}
        <rect x={20} y={258} width={480} height={40} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
        <text x={36} y={278} fontSize={11} fontWeight={700} fill="#f59e0b">nonZeroDeltaCount:</text>
        <text x={168} y={278} fontSize={10} fill="var(--foreground)">
          0 → non-zero 전환 카운트
        </text>
        <text x={36} y={291} fontSize={9} fill="var(--muted-foreground)">
          lock 종료 시 이 카운트가 0이어야 성공 (모든 delta 정산 완료)
        </text>

        {/* 공식 */}
        <rect x={20} y={310} width={480} height={22} rx={4}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={0.6} />
        <text x={260} y={325} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          settle → delta 증가 (+) · take → delta 감소 (−) · 최종 delta == 0
        </text>
      </svg>
    </div>
  );
}
