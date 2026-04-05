export default function LabelSmoothingViz() {
  const K = 5;
  const epsilon = 0.1;
  // 원본 one-hot (정답 = 2번 클래스)
  const hardLabel = [0, 0, 1, 0, 0];
  // Label smoothing: (1-ε)·one_hot + ε/K
  const softLabel = hardLabel.map((v) => (1 - epsilon) * v + epsilon / K);

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 310" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Label Smoothing — Hard vs Soft</text>
        <text x={320} y={42} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          공식: target = (1−ε)·one_hot + ε/K   (K=5, ε=0.1)
        </text>

        {/* Hard label (one-hot) */}
        <rect x={20} y={58} width={290} height={200} rx={10}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={2} />
        <text x={165} y={78} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
          Hard Label (ε = 0)
        </text>
        <text x={165} y={94} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          [0, 0, 1, 0, 0]
        </text>

        {/* Bar chart */}
        {hardLabel.map((v, i) => {
          const x = 40 + i * 50;
          const barH = v * 120;
          const isCorrect = i === 2;
          return (
            <g key={i}>
              <rect x={x} y={220 - barH} width={40} height={barH || 2}
                fill={isCorrect ? '#ef4444' : '#94a3b8'} fillOpacity={0.5}
                stroke={isCorrect ? '#ef4444' : '#94a3b8'} strokeWidth={1.5} />
              <text x={x + 20} y={234} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                c{i}
              </text>
              <text x={x + 20} y={220 - barH - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={isCorrect ? '#ef4444' : '#94a3b8'}>
                {v}
              </text>
            </g>
          );
        })}
        <line x1={30} y1={220} x2={300} y2={220} stroke="var(--border)" strokeWidth={1} />

        {/* Soft label */}
        <rect x={330} y={58} width={290} height={200} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={2} />
        <text x={475} y={78} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          Smoothed (ε = 0.1)
        </text>
        <text x={475} y={94} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          [0.02, 0.02, 0.92, 0.02, 0.02]
        </text>

        {/* Bar chart */}
        {softLabel.map((v, i) => {
          const x = 350 + i * 50;
          const barH = v * 120;
          const isCorrect = i === 2;
          return (
            <g key={i}>
              <rect x={x} y={220 - barH} width={40} height={barH}
                fill={isCorrect ? '#10b981' : '#94a3b8'} fillOpacity={0.5}
                stroke={isCorrect ? '#10b981' : '#94a3b8'} strokeWidth={1.5} />
              <text x={x + 20} y={234} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                c{i}
              </text>
              <text x={x + 20} y={220 - barH - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={isCorrect ? '#10b981' : '#94a3b8'}>
                {v.toFixed(3)}
              </text>
            </g>
          );
        })}
        <line x1={340} y1={220} x2={610} y2={220} stroke="var(--border)" strokeWidth={1} />

        {/* 효과 요약 */}
        <rect x={20} y={268} width={600} height={34} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={320} y={286} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          효과: Overconfidence 방지 · Test acc ↑1~2% · Calibration 개선 · BERT/ViT 표준
        </text>
        <text x={320} y={298} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          (단점: training loss 0 수렴 안함, KD와 상호작용)
        </text>
      </svg>
    </div>
  );
}
