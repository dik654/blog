export default function ConcentratedViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">V2 vs V3 — 유동성 분포 비교</text>

        {/* V2 (왼쪽) */}
        <text x={125} y={52} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">V2: 전 구간 분산</text>

        {/* V2 축 */}
        <line x1={30} y1={220} x2={220} y2={220} stroke="var(--foreground)" strokeWidth={1} />
        <line x1={30} y1={220} x2={30} y2={70} stroke="var(--foreground)" strokeWidth={1} />
        <text x={125} y={240} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">가격</text>
        <text x={22} y={148} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">유동성</text>

        {/* V2: 얇은 분산 곡선 */}
        <path d="M 35 210 Q 125 200 215 210" stroke="#3b82f6" strokeWidth={2.5} fill="none" opacity={0.6} />
        <path d="M 35 210 Q 125 200 215 210 L 215 220 L 35 220 Z" fill="#3b82f6" opacity={0.2} />

        {/* 현재 가격 */}
        <line x1={125} y1={75} x2={125} y2={220} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={125} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">$3000</text>

        {/* V2 라벨 */}
        <text x={125} y={262} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#3b82f6">$100 → 작은 depth</text>
        <text x={125} y={278} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">대부분 "사용 안 되는 구간"에 잠김</text>

        {/* 구분선 */}
        <line x1={260} y1={46} x2={260} y2={286} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />

        {/* V3 (오른쪽) */}
        <text x={390} y={52} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">V3: 가격 구간 집중</text>

        <line x1={300} y1={220} x2={490} y2={220} stroke="var(--foreground)" strokeWidth={1} />
        <line x1={300} y1={220} x2={300} y2={70} stroke="var(--foreground)" strokeWidth={1} />
        <text x={390} y={240} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">가격</text>
        <text x={292} y={148} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">유동성</text>

        {/* V3: 집중된 구간들 */}
        <rect x={360} y={98} width={70} height={122} fill="#10b981" opacity={0.5} />
        <rect x={355} y={102} width={80} height={118} fill="#10b981" opacity={0.3} />

        {/* 현재 가격 */}
        <line x1={390} y1={75} x2={390} y2={220} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={390} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">$3000</text>

        {/* P_a, P_b */}
        <text x={360} y={240} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">P_a</text>
        <text x={430} y={240} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">P_b</text>

        {/* V3 라벨 */}
        <text x={390} y={262} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#10b981">$100 → 50-200배 depth</text>
        <text x={390} y={278} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">구간 집중 → 자본 효율 극대화</text>
      </svg>
    </div>
  );
}
