export default function SupplyFlowViz() {
  const steps = [
    { n: 1, label: 'reserve.updateState()', desc: '누적 이자 index 갱신', color: '#3b82f6' },
    { n: 2, label: 'validateSupply()', desc: '공급 한도 체크', color: '#f59e0b' },
    { n: 3, label: 'aToken.mint()', desc: 'scaled balance 생성', color: '#10b981' },
    { n: 4, label: 'setUsingAsCollateral', desc: '첫 공급 시 담보 설정', color: '#8b5cf6' },
    { n: 5, label: 'safeTransferFrom', desc: '토큰 이동 (user → aToken)', color: '#06b6d4' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">supply() — 5단계 예치 흐름</text>

        <defs>
          <marker id="sup-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {steps.map((s, i) => {
          const y = 48 + i * 58;
          return (
            <g key={s.n}>
              <circle cx={44} cy={y + 22} r={15} fill={s.color} />
              <text x={44} y={y + 28} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
                {s.n}
              </text>
              <rect x={72} y={y} width={428} height={46} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
              <text x={86} y={y + 20} fontSize={12} fontWeight={700} fill={s.color}>
                {s.label}
              </text>
              <text x={86} y={y + 37} fontSize={10} fill="var(--muted-foreground)">
                {s.desc}
              </text>
              {i < steps.length - 1 && (
                <line x1={44} y1={y + 38} x2={44} y2={y + 58}
                  stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#sup-arr)" />
              )}
            </g>
          );
        })}

        {/* 결과 */}
        <rect x={20} y={346} width={480} height={0} />
      </svg>
    </div>
  );
}
