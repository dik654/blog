export default function FeeModelViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">수수료 모델 — 0.3% · k 증가 · LP 수익</text>

        {/* 입력 파이프라인 */}
        <text x={260} y={50} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">입력 흐름 — 0.997 × Δx가 가격 계산에 사용</text>

        <defs>
          <marker id="fm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 입력 100 USDC */}
        <rect x={20} y={64} width={110} height={56} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={75} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Δx = 100
        </text>
        <text x={75} y={104} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          USDC 입력
        </text>

        {/* × 0.997 */}
        <rect x={165} y={64} width={110} height={56} rx={6}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={220} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          × 0.997
        </text>
        <text x={220} y={104} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          수수료 차감
        </text>

        {/* 99.7 */}
        <rect x={310} y={64} width={110} height={56} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={365} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          99.7 → 계산
        </text>
        <text x={365} y={104} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Δy 공식 입력
        </text>

        {/* 0.3 fee */}
        <rect x={440} y={64} width={60} height={56} rx={6}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
        <text x={470} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          0.3
        </text>
        <text x={470} y={104} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          수수료
        </text>

        <line x1={130} y1={92} x2={165} y2={92} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#fm-arr)" />
        <line x1={275} y1={92} x2={310} y2={92} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#fm-arr)" />
        <line x1={275} y1={82} x2={440} y2={82} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="2 2" markerEnd="url(#fm-arr)" />

        {/* k 증가 검증 */}
        <text x={260} y={154} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">k 불변식 검증 — 수수료로 인한 k 증가</text>

        <rect x={20} y={166} width={230} height={72} rx={8}
          fill="#6b7280" fillOpacity={0.08} stroke="#6b7280" strokeWidth={0.8} />
        <text x={135} y={186} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6b7280">
          Before — k_old
        </text>
        <text x={135} y={210} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          x × y = 1,000,000
        </text>
        <text x={135} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          원래 유동성
        </text>

        <rect x={270} y={166} width={230} height={72} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={385} y={186} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          After — k_new
        </text>
        <text x={385} y={210} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          {"> k_old (0.3% 증가)"}
        </text>
        <text x={385} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          수수료 reserve 통합
        </text>

        {/* 수수료 분배 */}
        <text x={260} y={262} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">0.3% 분배</text>

        <rect x={60} y={276} width={180} height={32} rx={4}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={0.8} />
        <text x={150} y={297} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          0.25% → LP (reserve 누적)
        </text>

        <rect x={280} y={276} width={180} height={32} rx={4}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={370} y={297} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          0.05% → 프로토콜 (off by default)
        </text>
      </svg>
    </div>
  );
}
