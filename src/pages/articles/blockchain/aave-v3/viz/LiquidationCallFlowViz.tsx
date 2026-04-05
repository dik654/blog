export default function LiquidationCallFlowViz() {
  const steps = [
    { n: 1, label: 'HF 계산', detail: 'calculateUserAccountData()', color: '#3b82f6' },
    { n: 2, label: 'HF < 1 확인', detail: 'require healthFactor < 1e18', color: '#ef4444' },
    { n: 3, label: '최대 청산량 계산', detail: 'userDebt × 50% (CLOSE_FACTOR)', color: '#f59e0b' },
    { n: 4, label: '담보 계산 + 보너스', detail: 'debtValue × (1 + bonus) / collateralPrice', color: '#8b5cf6' },
    { n: 5, label: '토큰 이동', detail: 'liquidator ↔ user 자산 교환', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">liquidationCall() — 5단계 청산 실행</text>

        {/* 입력 */}
        <rect x={20} y={42} width={480} height={44} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={36} y={60} fontSize={11} fontWeight={700} fill="var(--foreground)">입력 파라미터:</text>
        <text x={130} y={60} fontSize={10} fill="var(--muted-foreground)">
          collateralAsset, debtAsset, user, debtToCover, receiveAToken
        </text>
        <text x={36} y={78} fontSize={9} fill="var(--muted-foreground)">
          청산자(MEV bot)가 호출 · user는 HF ＜ 1 상태
        </text>

        <defs>
          <marker id="lc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {steps.map((s, i) => {
          const y = 100 + i * 54;
          return (
            <g key={s.n}>
              <circle cx={44} cy={y + 22} r={16} fill={s.color} />
              <text x={44} y={y + 28} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
                {s.n}
              </text>
              <rect x={72} y={y} width={428} height={44} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
              <text x={86} y={y + 20} fontSize={12} fontWeight={700} fill={s.color}>
                {s.label}
              </text>
              <text x={86} y={y + 36} fontSize={10} fill="var(--muted-foreground)">
                {s.detail}
              </text>
              {i < steps.length - 1 && (
                <line x1={44} y1={y + 38} x2={44} y2={y + 54}
                  stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#lc-arr)" />
              )}
            </g>
          );
        })}

        {/* 주요 제약 */}
        <rect x={20} y={380} width={480} height={0} />
        <text x={260} y={394} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">CLOSE_FACTOR 50% · HF ＜ 0.95면 100% 청산 (bad debt 방지)</text>
      </svg>
    </div>
  );
}
