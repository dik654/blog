export default function Word2VecImpactViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Word2Vec (2013) — 4가지 혁신</text>

        {/* Before */}
        <rect x={20} y={48} width={290} height={130} rx={10}
          fill="#94a3b8" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1.8} />
        <text x={165} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill="#94a3b8">
          Before Word2Vec (~2013)
        </text>
        <line x1={30} y1={78} x2={300} y2={78} stroke="#94a3b8" strokeOpacity={0.3} strokeWidth={0.8} />

        {[
          { label: 'One-hot encoding', detail: '10K~100K 차원 희소 벡터', y: 98 },
          { label: 'TF-IDF', detail: '통계적 가중치', y: 118 },
          { label: 'LSA/LSI', detail: '행렬 분해, 부분 포착', y: 138 },
        ].map((b, i) => (
          <g key={i}>
            <text x={35} y={b.y} fontSize={11} fontWeight={700} fill="#94a3b8">• {b.label}</text>
            <text x={170} y={b.y} fontSize={10} fill="var(--muted-foreground)">{b.detail}</text>
          </g>
        ))}
        <text x={35} y={162} fontSize={10} fontWeight={700} fill="#ef4444">
          한계: 단어 관계 불명확, 차원 폭발
        </text>

        {/* After */}
        <rect x={330} y={48} width={290} height={130} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.8} />
        <text x={475} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          Word2Vec (2013, Mikolov)
        </text>
        <line x1={340} y1={78} x2={610} y2={78} stroke="#10b981" strokeOpacity={0.3} strokeWidth={0.8} />

        {[
          { label: '100~300 dim', detail: 'Dense vector (99.7% 감소)', y: 98 },
          { label: 'Dist. Hypothesis', detail: '컨텍스트 = 의미', y: 118 },
          { label: '선형 산술', detail: 'king−man+woman≈queen', y: 138 },
        ].map((b, i) => (
          <g key={i}>
            <text x={345} y={b.y} fontSize={11} fontWeight={700} fill="#10b981">• {b.label}</text>
            <text x={475} y={b.y} fontSize={10} fill="var(--muted-foreground)">{b.detail}</text>
          </g>
        ))}
        <text x={345} y={162} fontSize={10} fontWeight={700} fill="#10b981">
          현대 LLM 임베딩 레이어의 직접 선조
        </text>

        {/* 4 innovations */}
        <text x={320} y={208} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          4가지 핵심 혁신
        </text>

        {[
          { n: 1, name: 'Distributional Hypothesis 실현', detail: '신경망으로 자동 학습', color: '#3b82f6' },
          { n: 2, name: 'Dense Representation', detail: '100K → 300 dim (99.7%↓)', color: '#10b981' },
          { n: 3, name: 'Efficient Training', detail: 'Neg Sampling → 100배 빠름', color: '#f59e0b' },
          { n: 4, name: 'Linear Semantic Structure', detail: '성별·수도·복수형 축 자동 학습', color: '#8b5cf6' },
        ].map((inv, i) => {
          const x = 20 + (i % 2) * 310;
          const y = 224 + Math.floor(i / 2) * 56;
          return (
            <g key={inv.n}>
              <rect x={x} y={y} width={300} height={48} rx={8}
                fill={inv.color} fillOpacity={0.08} stroke={inv.color} strokeWidth={1.5} />
              <circle cx={x + 22} cy={y + 24} r={13} fill={inv.color} fillOpacity={0.2} stroke={inv.color} strokeWidth={1.5} />
              <text x={x + 22} y={y + 28} textAnchor="middle" fontSize={12} fontWeight={700} fill={inv.color}>{inv.n}</text>
              <text x={x + 42} y={y + 22} fontSize={11} fontWeight={700} fill="var(--foreground)">{inv.name}</text>
              <text x={x + 42} y={y + 38} fontSize={10} fill="var(--muted-foreground)">{inv.detail}</text>
            </g>
          );
        })}

        <text x={320} y={332} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">영향: 50,000+ 인용 · GloVe, FastText 후속 · BERT·GPT 임베딩의 시조</text>
      </svg>
    </div>
  );
}
