export default function OptimizerEvolutionViz() {
  const opts = [
    {
      name: 'SGD',
      year: '~1950s',
      color: '#94a3b8',
      update: 'θ ← θ − η·∇L',
      state: '(없음)',
      issue: '진동, 안장점',
    },
    {
      name: 'Momentum',
      year: '1964',
      color: '#3b82f6',
      update: 'v ← β·v + ∇L\nθ ← θ − η·v',
      state: 'v (velocity)',
      issue: '여전히 고정 lr',
    },
    {
      name: 'Adam',
      year: '2015',
      color: '#10b981',
      update: 'm ← β₁·m + (1−β₁)·∇L\nv ← β₂·v + (1−β₂)·∇L²\nθ ← θ − η·m̂/(√v̂+ε)',
      state: 'm, v (1·2차 moment)',
      issue: 'L2와 상호작용',
    },
    {
      name: 'AdamW',
      year: '2017',
      color: '#ef4444',
      update: 'Adam update\n+ θ ← θ − η·λ·θ\n(weight decay 분리)',
      state: 'm, v + λ',
      issue: 'Transformer 표준',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Optimizer 진화 — SGD → Momentum → Adam → AdamW</text>

        {opts.map((o, i) => {
          const x = 18 + i * 156;
          const updates = o.update.split('\n');
          return (
            <g key={o.name}>
              <rect x={x} y={52} width={148} height={260} rx={8}
                fill={o.color} fillOpacity={0.08} stroke={o.color} strokeWidth={1.8} />

              {/* 이름 + 연도 */}
              <text x={x + 74} y={74} textAnchor="middle" fontSize={14} fontWeight={700} fill={o.color}>
                {o.name}
              </text>
              <text x={x + 74} y={90} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {o.year}
              </text>
              <line x1={x + 10} y1={98} x2={x + 138} y2={98} stroke={o.color} strokeOpacity={0.3} strokeWidth={0.8} />

              {/* Update 공식 */}
              <text x={x + 10} y={116} fontSize={9} fontWeight={700} fill="var(--foreground)">Update</text>
              {updates.map((u, j) => (
                <text key={j} x={x + 10} y={130 + j * 13} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                  {u}
                </text>
              ))}

              {/* State */}
              <text x={x + 10} y={200} fontSize={9} fontWeight={700} fill="var(--foreground)">State</text>
              <text x={x + 10} y={214} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {o.state}
              </text>

              {/* Note */}
              <text x={x + 10} y={238} fontSize={9} fontWeight={700} fill="var(--foreground)">특징</text>
              <text x={x + 10} y={252} fontSize={9} fill="var(--muted-foreground)">
                {o.issue.length > 16 ? o.issue.slice(0, 16) : o.issue}
              </text>
              {o.issue.length > 16 && (
                <text x={x + 10} y={266} fontSize={9} fill="var(--muted-foreground)">
                  {o.issue.slice(16)}
                </text>
              )}

              {/* LR 표시 */}
              <rect x={x + 10} y={280} width={128} height={22} rx={4}
                fill={o.color} fillOpacity={0.15} stroke={o.color} strokeWidth={0.8} />
              <text x={x + 74} y={295} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill={o.color}>
                lr: {i === 0 ? '0.01~0.1' : i === 1 ? '0.01' : '1e-3'}
              </text>
            </g>
          );
        })}

        <text x={320} y={330} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">핵심 발전: 관성 추가(Momentum) → 적응적 lr(Adam) → weight decay 분리(AdamW)</text>
      </svg>
    </div>
  );
}
