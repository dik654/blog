export default function TrainingLoopViz() {
  const steps = [
    { n: 1, name: '초기화', detail: 'Xavier/He', color: '#3b82f6' },
    { n: 2, name: '순전파', detail: 'x → ŷ', color: '#10b981' },
    { n: 3, name: '손실 계산', detail: 'L = loss(ŷ,y)', color: '#f59e0b' },
    { n: 4, name: '역전파', detail: 'dL/dW', color: '#8b5cf6' },
    { n: 5, name: '업데이트', detail: 'W−η·∇L', color: '#ef4444' },
    { n: 6, name: '반복', detail: 'epoch/batch', color: '#06b6d4' },
  ];

  const cx = 320, cy = 210, loopR = 140, nodeR = 36;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 390" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={28} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">학습 전체 루프 — 6단계</text>

        {/* 화살표 (원호) — 노드 뒤에 렌더 */}
        {steps.map((_, i) => {
          const a1 = (i * 60 - 90) * Math.PI / 180;
          const a2 = ((i + 1) * 60 - 90) * Math.PI / 180;
          const arcR = loopR + nodeR + 6;
          const x1 = cx + Math.cos(a1) * arcR;
          const y1 = cy + Math.sin(a1) * arcR;
          const x2 = cx + Math.cos(a2) * arcR;
          const y2 = cy + Math.sin(a2) * arcR;
          return (
            <path key={i}
              d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${arcR} ${arcR} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
              fill="none" stroke="#8b5cf6" strokeWidth={1.5} opacity={0.4} strokeDasharray="4 3" />
          );
        })}

        {/* 원형 배치로 6 단계 */}
        {steps.map((step, i) => {
          const angle = (i * 60 - 90) * Math.PI / 180;
          const x = cx + Math.cos(angle) * loopR;
          const y = cy + Math.sin(angle) * loopR;
          return (
            <g key={step.n}>
              <circle cx={x} cy={y} r={nodeR} fill="var(--card)" />
              <circle cx={x} cy={y} r={nodeR} fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={2} />
              <text x={x} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={step.color}>
                {step.n}. {step.name}
              </text>
              <text x={x} y={y + 9} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
                {step.detail}
              </text>
            </g>
          );
        })}

        {/* 중앙 라벨 */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          학습 루프
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          (수렴까지 반복)
        </text>

      </svg>
    </div>
  );
}
