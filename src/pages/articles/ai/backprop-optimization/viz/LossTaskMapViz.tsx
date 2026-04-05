export default function LossTaskMapViz() {
  const rows = [
    { task: '회귀 (일반)', loss: 'MSE', activ: 'Identity', color: '#3b82f6' },
    { task: '회귀 (robust)', loss: 'Huber / MAE', activ: 'Identity', color: '#3b82f6' },
    { task: 'Binary 분류', loss: 'BCE', activ: 'Sigmoid', color: '#10b981' },
    { task: 'Multi-class 분류', loss: 'CE', activ: 'Softmax', color: '#10b981' },
    { task: 'Multi-label 분류', loss: 'Σ BCE', activ: 'Sigmoid × N', color: '#10b981' },
    { task: 'Unbalanced', loss: 'Focal Loss', activ: 'Softmax/Sigmoid', color: '#f59e0b' },
    { task: 'Generative', loss: 'KL / ELBO', activ: 'varies', color: '#8b5cf6' },
    { task: 'Ranking', loss: 'Contrastive / Triplet', activ: 'L2-normalized', color: '#ef4444' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 370" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Task → Loss → Activation 선택 맵</text>

        {/* 헤더 */}
        <rect x={20} y={48} width={600} height={32} rx={6}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={1} />
        <text x={120} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">Task</text>
        <text x={320} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">Loss</text>
        <text x={520} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">Output Activation</text>

        {/* 행들 */}
        {rows.map((r, i) => {
          const y = 80 + i * 34;
          return (
            <g key={i}>
              {i % 2 === 0 && (
                <rect x={20} y={y} width={600} height={34} fill="var(--muted)" opacity={0.1} />
              )}
              {/* task */}
              <text x={40} y={y + 22} fontSize={12} fontWeight={700} fill={r.color}>
                {r.task}
              </text>
              {/* loss bracket */}
              <rect x={220} y={y + 8} width={200} height={20} rx={3}
                fill={r.color} fillOpacity={0.1} stroke={r.color} strokeWidth={0.8} />
              <text x={320} y={y + 22} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700} fill={r.color}>
                {r.loss}
              </text>
              {/* activation */}
              <text x={440} y={y + 22} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
                {r.activ}
              </text>
            </g>
          );
        })}

        {/* 하단 팁 */}
        <rect x={20} y={356} width={600} height={0} stroke="var(--border)" strokeWidth={0.5} />
      </svg>
    </div>
  );
}
