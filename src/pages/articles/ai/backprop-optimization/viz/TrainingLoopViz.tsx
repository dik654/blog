export default function TrainingLoopViz() {
  const steps = [
    { n: 1, name: '초기화', detail: 'Xavier / He init', color: '#3b82f6' },
    { n: 2, name: '순전파', detail: 'x → ... → ŷ', color: '#10b981' },
    { n: 3, name: '손실 계산', detail: 'L = loss_fn(ŷ, y)', color: '#f59e0b' },
    { n: 4, name: '역전파', detail: 'dL/dW 계산', color: '#8b5cf6' },
    { n: 5, name: '업데이트', detail: 'W ← W − η·dL/dW', color: '#ef4444' },
    { n: 6, name: '반복', detail: 'epoch / batch', color: '#06b6d4' },
  ];

  const cx = 320, cy = 180, r = 120;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 380" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">학습 전체 루프 — 6단계</text>

        <defs>
          <marker id="tl-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* 원형 배치로 6 단계 */}
        {steps.map((step, i) => {
          const angle = (i * 60 - 90) * Math.PI / 180;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          return (
            <g key={step.n}>
              {/* 노드 */}
              <circle cx={x} cy={y} r={42} fill={step.color} fillOpacity={0.12} stroke={step.color} strokeWidth={2.2} />
              <text x={x} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={step.color}>
                {step.n}. {step.name}
              </text>
              <text x={x} y={y + 7} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {step.detail}
              </text>
            </g>
          );
        })}

        {/* 화살표 (원호) — 각 단계 사이 */}
        {steps.map((_, i) => {
          const a1 = (i * 60 - 90) * Math.PI / 180;
          const a2 = ((i + 1) * 60 - 90) * Math.PI / 180;
          const x1 = cx + Math.cos(a1) * (r + 42);
          const y1 = cy + Math.sin(a1) * (r + 42);
          const x2 = cx + Math.cos(a2) * (r + 42);
          const y2 = cy + Math.sin(a2) * (r + 42);
          // 외곽 따라 곡선
          return (
            <path key={i}
              d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r + 42} ${r + 42} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
              fill="none" stroke="#8b5cf6" strokeWidth={1.5} opacity={0.5} strokeDasharray="4 3" />
          );
        })}

        {/* 중앙 라벨 */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          학습 루프
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          (수렴까지 반복)
        </text>

        {/* PyTorch 코드 */}
        <rect x={20} y={310} width={600} height={60} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={328} fontSize={11} fontWeight={700} fill="var(--foreground)">PyTorch 코드</text>
        <text x={40} y={346} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          y_pred = model(x); loss = criterion(y_pred, y)
        </text>
        <text x={40} y={362} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          optimizer.zero_grad(); loss.backward(); optimizer.step()
        </text>
      </svg>
    </div>
  );
}
