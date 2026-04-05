export default function SwapLoopViz() {
  const steps = [
    { n: 1, label: '다음 tick 찾기', detail: 'tickBitmap.nextInitialized...', color: '#3b82f6' },
    { n: 2, label: 'tick → √P 변환', detail: 'TickMath.getSqrtRatioAtTick()', color: '#06b6d4' },
    { n: 3, label: 'computeSwapStep', detail: '한 구간 내 swap 계산', color: '#8b5cf6' },
    { n: 4, label: '잔여량 업데이트', detail: 'remaining -= amountIn + fee', color: '#f59e0b' },
    { n: 5, label: '수수료 누적', detail: 'feeGrowthGlobal += fee / L', color: '#ef4444' },
    { n: 6, label: 'crossing 체크', detail: '√P == sqrtPriceNext? → L 조정', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">swap() 메인 루프 — 6단계 iteration</text>

        {/* 루프 조건 */}
        <rect x={20} y={40} width={480} height={42} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={59} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          while 조건
        </text>
        <text x={260} y={74} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          amountSpecifiedRemaining ≠ 0 && sqrtPriceX96 ≠ sqrtPriceLimitX96
        </text>

        <defs>
          <marker id="sl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {steps.map((s, i) => {
          const y = 94 + i * 50;
          return (
            <g key={s.n}>
              <circle cx={44} cy={y + 18} r={14} fill={s.color} />
              <text x={44} y={y + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">
                {s.n}
              </text>
              <rect x={72} y={y} width={340} height={36} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
              <text x={86} y={y + 17} fontSize={11} fontWeight={700} fill={s.color}>
                {s.label}
              </text>
              <text x={86} y={y + 30} fontSize={9.5} fill="var(--muted-foreground)">
                {s.detail}
              </text>
              {i < steps.length - 1 && (
                <line x1={44} y1={y + 32} x2={44} y2={y + 50}
                  stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#sl-arr)" />
              )}
            </g>
          );
        })}

        {/* 루프백 화살표 */}
        <path d="M 420 112 Q 490 112 490 390 Q 490 388 448 388" fill="none"
          stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#sl-arr)" />
        <text x={496} y={240} textAnchor="end" fontSize={9} fontWeight={700} fill="#8b5cf6">
          loop
        </text>

        {/* 종료 조건 */}
        <rect x={20} y={396} width={480} height={0} />
      </svg>
    </div>
  );
}
