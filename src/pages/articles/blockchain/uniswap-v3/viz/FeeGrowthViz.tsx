export default function FeeGrowthViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">feeGrowthInside — 포함-배제 원리 (Inclusion-Exclusion)</text>

        {/* 가격 축 */}
        <line x1={40} y1={130} x2={480} y2={130} stroke="var(--foreground)" strokeWidth={1} />

        {/* tickLower, tickUpper */}
        <line x1={160} y1={85} x2={160} y2={175} stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 2" />
        <line x1={360} y1={85} x2={360} y2={175} stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 2" />

        <text x={160} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">tickLower</text>
        <text x={360} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">tickUpper</text>

        {/* 현재 가격 */}
        <circle cx={260} cy={130} r={6} fill="#f59e0b" stroke="var(--card)" strokeWidth={2} />
        <text x={260} y={118} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">current</text>

        {/* 영역 색칠 */}
        <rect x={40} y={96} width={120} height={68} fill="#ef4444" fillOpacity={0.2} />
        <text x={100} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          Below
        </text>

        <rect x={160} y={96} width={200} height={68} fill="#10b981" fillOpacity={0.25} />
        <text x={260} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Inside (구간 내)
        </text>

        <rect x={360} y={96} width={120} height={68} fill="#3b82f6" fillOpacity={0.2} />
        <text x={420} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Above
        </text>

        <text x={100} y={192} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">tick ＜ tickLower</text>
        <text x={260} y={192} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">tickLower ≤ tick ≤ tickUpper</text>
        <text x={420} y={192} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">tick ＞ tickUpper</text>

        {/* 공식 */}
        <text x={260} y={222} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">포함-배제 원리</text>

        <rect x={20} y={234} width={480} height={46} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={260} y={254} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          Inside = Global − Below − Above
        </text>
        <text x={260} y={272} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          tick 단위 저장 · O(1) 계산 · 각 tick의 feeGrowthOutside만 추적
        </text>

        {/* LP 수수료 계산 */}
        <rect x={20} y={292} width={480} height={24} rx={4}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={308} textAnchor="middle" fontSize={10}
          fill="var(--foreground)">
          LP 수수료 = (Inside_current − Inside_lastSnapshot) × liquidity
        </text>
      </svg>
    </div>
  );
}
