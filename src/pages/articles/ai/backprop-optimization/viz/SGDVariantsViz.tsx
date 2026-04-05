export default function SGDVariantsViz() {
  const variants = [
    {
      name: 'Vanilla GD',
      color: '#94a3b8',
      formula: 'θ ← θ − η·∇L(θ)',
      batch: '전체 데이터셋',
      pros: 'Smooth, deterministic',
      cons: 'Memory/time 비현실적',
    },
    {
      name: 'SGD',
      color: '#ef4444',
      formula: 'θ ← θ − η·∇L(θ; xᵢ)',
      batch: '샘플 1개',
      pros: 'Local minima 탈출',
      cons: '흔들림 (noisy)',
    },
    {
      name: 'Mini-batch',
      color: '#3b82f6',
      formula: 'θ ← θ − η·(1/B)·Σ∇L',
      batch: 'B=32~512',
      pros: 'GPU 효율 ⚖️ 안정성',
      cons: '— 현대 표준',
    },
    {
      name: 'Momentum',
      color: '#10b981',
      formula: 'v ← β·v + ∇L;  θ ← θ − η·v',
      batch: 'B + β=0.9',
      pros: 'Plateau/saddle 탈출',
      cons: '2~3배 수렴 가속',
    },
    {
      name: 'NAG',
      color: '#f59e0b',
      formula: 'v ← β·v + ∇L(θ+β·v)',
      batch: 'B + lookahead',
      pros: '미래 위치 gradient',
      cons: 'Momentum보다 안정',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 310" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">SGD 변형 — 5가지 진화 계보</text>

        {variants.map((v, i) => {
          const x = 18 + i * 125;
          return (
            <g key={v.name}>
              <rect x={x} y={48} width={115} height={245} rx={8}
                fill={v.color} fillOpacity={0.08} stroke={v.color} strokeWidth={1.8} />

              <text x={x + 57} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill={v.color}>
                {v.name}
              </text>
              <line x1={x + 10} y1={76} x2={x + 105} y2={76} stroke={v.color} strokeOpacity={0.3} strokeWidth={1} />

              {/* 공식 */}
              <text x={x + 10} y={96} fontSize={9} fontWeight={700} fill="var(--foreground)">공식</text>
              <text x={x + 10} y={112} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {v.formula.length > 18 ? v.formula.slice(0, 18) : v.formula}
              </text>
              {v.formula.length > 18 && (
                <text x={x + 10} y={126} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                  {v.formula.slice(18)}
                </text>
              )}

              {/* 배치 */}
              <text x={x + 10} y={150} fontSize={9} fontWeight={700} fill="var(--foreground)">배치</text>
              <text x={x + 10} y={166} fontSize={9} fill="var(--muted-foreground)">
                {v.batch}
              </text>

              {/* 장점 */}
              <text x={x + 10} y={190} fontSize={9} fontWeight={700} fill="#10b981">장점</text>
              <text x={x + 10} y={206} fontSize={9} fill="var(--muted-foreground)">
                {v.pros.length > 14 ? v.pros.slice(0, 14) : v.pros}
              </text>
              {v.pros.length > 14 && (
                <text x={x + 10} y={220} fontSize={9} fill="var(--muted-foreground)">
                  {v.pros.slice(14)}
                </text>
              )}

              {/* 단점/특징 */}
              <text x={x + 10} y={244} fontSize={9} fontWeight={700} fill="#f59e0b">특징</text>
              <text x={x + 10} y={260} fontSize={9} fill="var(--muted-foreground)">
                {v.cons.length > 14 ? v.cons.slice(0, 14) : v.cons}
              </text>
              {v.cons.length > 14 && (
                <text x={x + 10} y={274} fontSize={9} fill="var(--muted-foreground)">
                  {v.cons.slice(14)}
                </text>
              )}
            </g>
          );
        })}

        <text x={320} y={305} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">진화: GD→SGD(샘플링)→Mini-batch(배치)→Momentum(관성)→NAG(예측)</text>
      </svg>
    </div>
  );
}
