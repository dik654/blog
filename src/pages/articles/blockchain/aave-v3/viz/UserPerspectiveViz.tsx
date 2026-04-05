export default function UserPerspectiveViz() {
  const steps = [
    {
      n: 1,
      action: 'USDC 예치',
      result: 'aUSDC 수령',
      detail: '이자 자동 누적 (시간↑)',
      color: '#10b981',
    },
    {
      n: 2,
      action: 'aUSDC 담보 설정',
      result: 'ETH 차입',
      detail: 'VariableDebtETH 발행',
      color: '#3b82f6',
    },
    {
      n: 3,
      action: '시간 경과',
      result: '가치 변동',
      detail: '담보/부채 비율 변경',
      color: '#f59e0b',
    },
    {
      n: 4,
      action: 'Health Factor 관리',
      result: '상환 or 청산',
      detail: 'HF < 1 → 청산 대상',
      color: '#ef4444',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">사용자 관점 — Aave 4단계 흐름</text>

        <defs>
          <marker id="up-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {steps.map((s, i) => {
          const y = 48 + i * 62;
          return (
            <g key={s.n}>
              {/* 단계 번호 */}
              <circle cx={42} cy={y + 26} r={16} fill={s.color} />
              <text x={42} y={y + 32} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff">
                {s.n}
              </text>

              {/* Action 박스 */}
              <rect x={72} y={y + 4} width={170} height={48} rx={6}
                fill={s.color} fillOpacity={0.12} stroke={s.color} strokeWidth={1} />
              <text x={157} y={y + 24} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
                {s.action}
              </text>
              <text x={157} y={y + 42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                사용자 행동
              </text>

              {/* 화살표 */}
              <line x1={242} y1={y + 28} x2={262} y2={y + 28}
                stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#up-arr)" />

              {/* Result 박스 */}
              <rect x={262} y={y + 4} width={238} height={48} rx={6}
                fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
              <text x={276} y={y + 22} fontSize={11} fontWeight={700} fill="var(--foreground)">
                {s.result}
              </text>
              <text x={276} y={y + 40} fontSize={9} fill="var(--muted-foreground)">
                {s.detail}
              </text>

              {/* 단계 간 연결선 */}
              {i < steps.length - 1 && (
                <line x1={42} y1={y + 42} x2={42} y2={y + 62}
                  stroke="#6b7280" strokeWidth={1.2} strokeDasharray="3 2" />
              )}
            </g>
          );
        })}

        {/* 하단 요약 */}
        <rect x={20} y={300} width={480} height={0} />
      </svg>
    </div>
  );
}
