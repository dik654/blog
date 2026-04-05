export default function SigmoidUsageViz() {
  const usages = [
    { name: 'Binary Classification', icon: '⚖️', color: '#3b82f6', detail: 'P(class=1)', loss: 'BCE' },
    { name: 'Multi-label', icon: '🏷️', color: '#10b981', detail: '각 클래스 독립 0/1', loss: 'Σ BCE' },
    { name: 'LSTM/GRU Gates', icon: '🚪', color: '#f59e0b', detail: 'Forget/Input/Output', loss: '-' },
    { name: 'Attention (variant)', icon: '🔍', color: '#8b5cf6', detail: '독립 attention', loss: '-' },
    { name: 'Calibration', icon: '🎯', color: '#ef4444', detail: 'Logit → probability', loss: '-' },
    { name: 'GLU Gating', icon: '⚡', color: '#06b6d4', detail: '(x·W₁)⊙σ(x·W₂)', loss: '-' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 240" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Sigmoid 현대 사용처 — Hidden은 끝, Output/Gate는 살아남음</text>

        {usages.map((u, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 20 + col * 207;
          const y = 48 + row * 88;
          return (
            <g key={u.name}>
              <rect x={x} y={y} width={195} height={78} rx={8}
                fill={u.color} fillOpacity={0.08} stroke={u.color} strokeWidth={1.8} />

              <text x={x + 16} y={y + 28} fontSize={18}>{u.icon}</text>
              <text x={x + 42} y={y + 28} fontSize={12} fontWeight={700} fill={u.color}>{u.name}</text>

              <line x1={x + 14} y1={y + 36} x2={x + 181} y2={y + 36} stroke={u.color} strokeOpacity={0.3} strokeWidth={0.8} />

              <text x={x + 14} y={y + 54} fontSize={10} fill="var(--muted-foreground)">
                {u.detail}
              </text>
              {u.loss !== '-' && (
                <text x={x + 14} y={y + 70} fontSize={10} fontFamily="monospace" fontWeight={700} fill={u.color}>
                  loss: {u.loss}
                </text>
              )}
            </g>
          );
        })}

        <text x={320} y={230} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">Hidden layer에선 ReLU/GELU에 자리를 내줌 — 하지만 출력·게이팅에선 여전히 필수</text>
      </svg>
    </div>
  );
}
