export default function ReLUFamilyViz() {
  const variants = [
    {
      name: 'Leaky ReLU',
      year: 2013,
      formula: 'max(0.01x, x)',
      meaning: '음수에 작은 기울기 0.01',
      usage: 'Dying ReLU 방지',
      color: '#3b82f6',
    },
    {
      name: 'PReLU',
      year: 2015,
      formula: 'max(aᵢ·x, x)',
      meaning: 'aᵢ = 학습되는 기울기',
      usage: 'ResNet',
      color: '#10b981',
    },
    {
      name: 'ELU',
      year: 2015,
      formula: 'x or α(eˣ−1)',
      meaning: '음수: smooth 포화 곡선',
      usage: 'FC network',
      color: '#f59e0b',
    },
    {
      name: 'SELU',
      year: 2017,
      formula: 'λ·ELU(x)',
      meaning: 'λ,α 고정 → 자기정규화',
      usage: 'BN 없이 FC',
      color: '#ef4444',
    },
    {
      name: 'GELU',
      year: 2016,
      formula: 'x·Φ(x)',
      meaning: 'Φ = 정규분포 CDF',
      usage: 'BERT, GPT',
      color: '#8b5cf6',
    },
    {
      name: 'Swish',
      year: 2017,
      formula: 'x·σ(x)',
      meaning: 'σ = sigmoid, NAS 발견',
      usage: 'EfficientNet',
      color: '#06b6d4',
    },
    {
      name: 'SwiGLU',
      year: 2020,
      formula: 'Swish(W₁x)⊙W₂x',
      meaning: '⊙ = element-wise 곱',
      usage: 'LLaMA, PaLM',
      color: '#ec4899',
    },
    {
      name: 'Mish',
      year: 2019,
      formula: 'x·tanh(ln(1+eˣ))',
      meaning: 'softplus = ln(1+eˣ)',
      usage: 'YOLOv4',
      color: '#14b8a6',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 370" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">ReLU 가족 — 8가지 변형 진화</text>

        {variants.map((v, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 18 + col * 156;
          const y = 42 + row * 152;
          return (
            <g key={v.name}>
              <rect x={x} y={y} width={148} height={138} rx={8}
                fill={v.color} fillOpacity={0.06} stroke={v.color} strokeWidth={1.8} />

              {/* 이름 + 연도 */}
              <text x={x + 74} y={y + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={v.color}>
                {v.name}
              </text>
              <text x={x + 74} y={y + 34} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {v.year}
              </text>
              <line x1={x + 10} y1={y + 40} x2={x + 138} y2={y + 40} stroke={v.color} strokeOpacity={0.3} strokeWidth={0.8} />

              {/* 공식 */}
              <text x={x + 74} y={y + 58} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">
                {v.formula}
              </text>

              {/* 의미 — 수식 기호 설명 */}
              <text x={x + 74} y={y + 74} textAnchor="middle" fontSize={8} fill={v.color}>
                {v.meaning}
              </text>

              <line x1={x + 10} y1={y + 82} x2={x + 138} y2={y + 82} stroke="var(--border)" strokeOpacity={0.3} strokeWidth={0.5} />

              {/* 사용처 */}
              <text x={x + 74} y={y + 98} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                {v.usage}
              </text>

              {/* 세대 구분 뱃지 */}
              <rect x={x + 30} y={y + 108} width={88} height={18} rx={9}
                fill={v.color} fillOpacity={0.15} stroke={v.color} strokeWidth={0.6} />
              <text x={x + 74} y={y + 121} textAnchor="middle" fontSize={8} fontWeight={600} fill={v.color}>
                {i < 4 ? '1세대 변형' : '2세대 혁신'}
              </text>
            </g>
          );
        })}

        <rect x={18} y={340} width={604} height={24} rx={5}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.6} />
        <text x={320} y={356} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">진화 방향: 음수 구간 살리기(Leaky) → smooth 곡선(ELU) → 확률적 마스킹(GELU) → gated 조합(SwiGLU)</text>
      </svg>
    </div>
  );
}
