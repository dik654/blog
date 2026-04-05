export default function SpecialOutputsViz() {
  const types = [
    {
      name: 'Multi-Label',
      color: '#3b82f6',
      icon: '🏷️',
      activation: 'Sigmoid × N',
      loss: 'Σ BCE per class',
      example: '영화 장르 (액션+코미디 동시)',
    },
    {
      name: 'Bounded Regression',
      color: '#10b981',
      icon: '📏',
      activation: 'Sigmoid(z)·(b−a)+a',
      loss: 'MSE',
      example: '출력 [a, b] 제한',
    },
    {
      name: 'Ordinal',
      color: '#f59e0b',
      icon: '⭐',
      activation: 'Multiple binary',
      loss: 'ordinal loss',
      example: '별점 1~5 (순서 있음)',
    },
    {
      name: 'Count',
      color: '#8b5cf6',
      icon: '🔢',
      activation: 'exp(z)',
      loss: 'Poisson',
      example: '양수 정수 예측',
    },
    {
      name: 'Probabilistic',
      color: '#ef4444',
      icon: '🎲',
      activation: '(μ, σ²) 출력',
      loss: 'Gaussian likelihood',
      example: '불확실성 추정',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 250" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">특수 출력층 설계 — 5가지</text>

        {types.map((t, i) => {
          const x = 18 + i * 125;
          return (
            <g key={t.name}>
              <rect x={x} y={48} width={115} height={185} rx={10}
                fill={t.color} fillOpacity={0.08} stroke={t.color} strokeWidth={1.8} />

              {/* 아이콘 */}
              <text x={x + 57} y={76} textAnchor="middle" fontSize={22}>{t.icon}</text>

              {/* 이름 */}
              <text x={x + 57} y={96} textAnchor="middle" fontSize={12} fontWeight={700} fill={t.color}>
                {t.name}
              </text>
              <line x1={x + 10} y1={104} x2={x + 105} y2={104} stroke={t.color} strokeOpacity={0.3} strokeWidth={1} />

              {/* Activation */}
              <text x={x + 10} y={122} fontSize={10} fontWeight={700} fill="var(--foreground)">활성화</text>
              <text x={x + 10} y={136} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {t.activation}
              </text>

              {/* Loss */}
              <text x={x + 10} y={156} fontSize={10} fontWeight={700} fill="var(--foreground)">손실</text>
              <text x={x + 10} y={170} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {t.loss}
              </text>

              {/* Example */}
              <text x={x + 10} y={190} fontSize={10} fontWeight={700} fill="var(--foreground)">예시</text>
              <text x={x + 10} y={204} fontSize={9} fill="var(--muted-foreground)">
                {t.example.length > 14 ? t.example.slice(0, 14) : t.example}
              </text>
              {t.example.length > 14 && (
                <text x={x + 10} y={216} fontSize={9} fill="var(--muted-foreground)">
                  {t.example.slice(14)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
