export default function InvariantViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">StableSwap Invariant — 두 곡선의 합</text>

        {/* 공식 박스 */}
        <rect x={60} y={45} width={360} height={60} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={68} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">A · n^n · Σx + D = A · D · n^n + D^(n+1) / (n^n · Πx)</text>
        <text x={240} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          Σx = 합 (Constant Sum 성분) · Πx = 곱 (Constant Product 성분)
        </text>
        <text x={240} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          A = amplification · D = invariant · n = 토큰 개수
        </text>

        {/* CS와 CP 구성 요소 */}
        <rect x={30} y={130} width={200} height={85} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} />
        <text x={130} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
          Constant Sum 성분
        </text>
        <text x={130} y={165} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          A · n^n · Σx
        </text>
        <text x={130} y={183} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          x_i 합에 비례
        </text>
        <text x={130} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          균형 시 우세 (슬리피지 ↓)
        </text>

        {/* + */}
        <text x={240} y={175} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">+</text>

        <rect x={250} y={130} width={200} height={85} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1} />
        <text x={350} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
          Constant Product 성분
        </text>
        <text x={350} y={165} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          D^(n+1) / (n^n · Πx)
        </text>
        <text x={350} y={183} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          x_i 곱에 반비례
        </text>
        <text x={350} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          극단 시 우세 (유동성 보호)
        </text>

        <text x={240} y={232} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          A → 0: 순수 CP · A → ∞: 순수 CS · 실제: A = 50 ~ 5000
        </text>
      </svg>
    </div>
  );
}
