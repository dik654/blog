export default function SqrtPriceViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">왜 √P를 쓰는가 — 선형성의 힘</text>

        {/* 비교 */}
        <rect x={20} y={44} width={480} height={60} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          V2 vs V3 — 가격 변수 선택
        </text>
        <text x={140} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">V2: P 직접</text>
        <text x={140} y={96} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">x · y = k (비선형)</text>
        <text x={380} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">V3: √P</text>
        <text x={380} y={96} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Δy = L · Δ(√P) (선형)</text>

        {/* 핵심 공식 */}
        <text x={260} y={132} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">√P로 표현된 선형 관계</text>

        <rect x={20} y={146} width={235} height={62} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={137} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          Δy = L × Δ(√P)
        </text>
        <text x={137} y={186} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          token1 변화 ∝ √P 변화
        </text>
        <text x={137} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          L 고정 → 선형 증가
        </text>

        <rect x={265} y={146} width={235} height={62} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={382} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Δx = L × Δ(1/√P)
        </text>
        <text x={382} y={186} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          token0 변화 ∝ 1/√P 변화
        </text>
        <text x={382} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          inverse 선형 관계
        </text>

        {/* 장점 */}
        <text x={260} y={236} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">√P 사용의 장점</text>

        {[
          { label: '선형 관계', desc: '구간별 계산 단순', color: '#3b82f6' },
          { label: '가산성', desc: '인접 구간 L 선형 합산', color: '#10b981' },
          { label: '정밀도', desc: '극단값에서 overflow 방지', color: '#f59e0b' },
        ].map((item, i) => {
          const x = 20 + i * 163;
          return (
            <g key={i}>
              <rect x={x} y={250} width={154} height={54} rx={6}
                fill={item.color} fillOpacity={0.08} stroke={item.color} strokeWidth={0.6} />
              <text x={x + 77} y={270} textAnchor="middle" fontSize={11} fontWeight={700} fill={item.color}>
                ✓ {item.label}
              </text>
              <text x={x + 77} y={288} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {item.desc}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
