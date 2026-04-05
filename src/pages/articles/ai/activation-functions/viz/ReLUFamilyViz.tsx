export default function ReLUFamilyViz() {
  const variants = [
    {
      name: 'Leaky ReLU',
      year: 2013,
      formula: 'max(0.01x, x)',
      usage: 'Dying ReLU 방지',
      notable: '+0.1% 미미',
      color: '#3b82f6',
    },
    {
      name: 'PReLU',
      year: 2015,
      formula: 'max(aᵢ·x, x)',
      usage: 'ResNet original',
      notable: 'a 학습 가능',
      color: '#10b981',
    },
    {
      name: 'ELU',
      year: 2015,
      formula: 'x or α(eˣ−1)',
      usage: '작은 FC net',
      notable: 'Smooth',
      color: '#f59e0b',
    },
    {
      name: 'SELU',
      year: 2017,
      formula: 'λ·ELU(x)',
      usage: 'Self-normalizing',
      notable: 'BatchNorm 불필요',
      color: '#ef4444',
    },
    {
      name: 'GELU',
      year: 2016,
      formula: 'x·Φ(x)',
      usage: 'BERT, GPT',
      notable: 'Transformer 표준',
      color: '#8b5cf6',
    },
    {
      name: 'Swish/SiLU',
      year: 2017,
      formula: 'x·σ(x)',
      usage: 'EfficientNet',
      notable: 'NAS 발견',
      color: '#06b6d4',
    },
    {
      name: 'SwiGLU',
      year: 2020,
      formula: '(x·W₁)⊙Swish(x·W₂)',
      usage: 'LLaMA, Mistral',
      notable: 'Gated',
      color: '#ec4899',
    },
    {
      name: 'Mish',
      year: 2019,
      formula: 'x·tanh(softplus(x))',
      usage: 'YOLOv4',
      notable: 'Smooth',
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
          const y = 48 + row * 160;
          return (
            <g key={v.name}>
              <rect x={x} y={y} width={148} height={148} rx={8}
                fill={v.color} fillOpacity={0.08} stroke={v.color} strokeWidth={1.8} />

              {/* 이름 */}
              <text x={x + 74} y={y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={v.color}>
                {v.name}
              </text>
              {/* 연도 */}
              <text x={x + 74} y={y + 36} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {v.year}
              </text>
              <line x1={x + 10} y1={y + 42} x2={x + 138} y2={y + 42} stroke={v.color} strokeOpacity={0.3} strokeWidth={0.8} />

              {/* 공식 */}
              <text x={x + 10} y={y + 60} fontSize={9} fontWeight={700} fill="var(--foreground)">공식</text>
              <text x={x + 10} y={y + 74} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {v.formula}
              </text>

              {/* 사용처 */}
              <text x={x + 10} y={y + 94} fontSize={9} fontWeight={700} fill="var(--foreground)">사용처</text>
              <text x={x + 10} y={y + 108} fontSize={9} fill="var(--muted-foreground)">
                {v.usage}
              </text>

              {/* 특징 */}
              <text x={x + 10} y={y + 128} fontSize={9} fontWeight={700} fill="var(--foreground)">특징</text>
              <text x={x + 10} y={y + 142} fontSize={9} fill="var(--muted-foreground)">
                {v.notable}
              </text>
            </g>
          );
        })}

        <text x={320} y={365} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">진화 방향: 음수 구간 살리기 → smooth하게 → gated 조합</text>
      </svg>
    </div>
  );
}
