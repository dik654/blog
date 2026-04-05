export default function L1L2Viz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 320" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">L1 vs L2 Regularization — 제약 영역의 기하학</text>

        {/* L1 (diamond) */}
        <rect x={20} y={48} width={290} height={260} rx={10}
          fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={2} />
        <text x={165} y={70} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b82f6">
          L1 (Lasso) — Sparse
        </text>
        <text x={165} y={86} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          L = L_data + λ·Σ|θᵢ|
        </text>

        {/* 축 */}
        <line x1={50} y1={200} x2={280} y2={200} stroke="var(--border)" strokeWidth={1} />
        <line x1={165} y1={100} x2={165} y2={290} stroke="var(--border)" strokeWidth={1} />
        <text x={284} y={204} fontSize={10} fill="var(--muted-foreground)">θ₁</text>
        <text x={160} y={100} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">θ₂</text>

        {/* L1 마름모 */}
        <polygon points="165,130 235,200 165,270 95,200"
          fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={2.2} />
        <text x={165} y={220} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">|θ₁|+|θ₂| ≤ 1</text>

        {/* Loss contour (타원) */}
        <ellipse cx={210} cy={165} rx={48} ry={32} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
        <ellipse cx={210} cy={165} rx={32} ry={22} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
        <ellipse cx={210} cy={165} rx={18} ry={12} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
        <circle cx={210} cy={165} r={4} fill="#ef4444" />
        <text x={218} y={162} fontSize={9} fill="#ef4444">loss min</text>

        {/* 접촉점 (축 위) */}
        <circle cx={235} cy={200} r={8} fill="#f59e0b" fillOpacity={0.5} stroke="#f59e0b" strokeWidth={2} />
        <text x={244} y={196} fontSize={10} fontWeight={700} fill="#f59e0b">해 (θ₂=0)</text>

        <text x={165} y={298} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          꼭짓점에서 만나 → 많은 θ=0 (sparse)
        </text>

        {/* L2 (circle) */}
        <rect x={330} y={48} width={290} height={260} rx={10}
          fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={2} />
        <text x={475} y={70} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">
          L2 (Ridge) — Smooth
        </text>
        <text x={475} y={86} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          L = L_data + λ·Σθᵢ²
        </text>

        {/* 축 */}
        <line x1={360} y1={200} x2={590} y2={200} stroke="var(--border)" strokeWidth={1} />
        <line x1={475} y1={100} x2={475} y2={290} stroke="var(--border)" strokeWidth={1} />
        <text x={594} y={204} fontSize={10} fill="var(--muted-foreground)">θ₁</text>
        <text x={470} y={100} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">θ₂</text>

        {/* L2 원 */}
        <circle cx={475} cy={200} r={65} fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={2.2} />
        <text x={475} y={220} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">θ₁²+θ₂² ≤ 1</text>

        {/* Loss contour */}
        <ellipse cx={520} cy={165} rx={48} ry={32} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
        <ellipse cx={520} cy={165} rx={32} ry={22} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
        <ellipse cx={520} cy={165} rx={18} ry={12} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
        <circle cx={520} cy={165} r={4} fill="#ef4444" />
        <text x={528} y={162} fontSize={9} fill="#ef4444">loss min</text>

        {/* 접촉점 (곡선 위) */}
        <circle cx={529} cy={177} r={8} fill="#f59e0b" fillOpacity={0.5} stroke="#f59e0b" strokeWidth={2} />
        <text x={540} y={172} fontSize={10} fontWeight={700} fill="#f59e0b">해 (small)</text>

        <text x={475} y={298} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          원 경계에서 만남 → θ 모두 작지만 ≠ 0
        </text>
      </svg>
    </div>
  );
}
