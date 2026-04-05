export default function LayerActivationMapViz() {
  const positions = [
    {
      name: 'Hidden Layer',
      color: '#10b981',
      choices: [
        { arch: 'CNN/MLP', fn: 'ReLU', why: '빠름, 검증됨' },
        { arch: 'Transformer', fn: 'GELU', why: '부드러운 곡선' },
        { arch: 'LLaMA 계열', fn: 'SwiGLU', why: 'gating' },
        { arch: 'RNN internal', fn: 'Tanh', why: 'gate values' },
      ],
    },
    {
      name: 'Output Layer',
      color: '#3b82f6',
      choices: [
        { arch: 'Regression', fn: 'Identity', why: '연속값 예측' },
        { arch: 'Binary class', fn: 'Sigmoid', why: 'P(y=1)' },
        { arch: 'Multi-class', fn: 'Softmax', why: '확률 분포' },
        { arch: 'Multi-label', fn: 'Sigmoid×N', why: '독립 확률' },
      ],
    },
    {
      name: 'Gating (LSTM/GRU)',
      color: '#f59e0b',
      choices: [
        { arch: 'Forget/input/output', fn: 'Sigmoid', why: '0~1 게이트' },
        { arch: 'Cell update', fn: 'Tanh', why: '-1~1 값' },
      ],
    },
    {
      name: 'Attention',
      color: '#8b5cf6',
      choices: [
        { arch: 'Attention weights', fn: 'Softmax', why: '정규화' },
        { arch: 'Sparse variants', fn: 'ReLU² / Sigmoid', why: '선택적' },
      ],
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 380" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Layer Position → Activation 선택 맵</text>

        {positions.map((pos, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 20 + col * 312;
          const y = 48 + row * 168;
          const rowHeight = 24;

          return (
            <g key={pos.name}>
              <rect x={x} y={y} width={300} height={155} rx={10}
                fill={pos.color} fillOpacity={0.08} stroke={pos.color} strokeWidth={2} />

              {/* 제목 */}
              <text x={x + 16} y={y + 26} fontSize={14} fontWeight={700} fill={pos.color}>
                {pos.name}
              </text>
              <line x1={x + 16} y1={y + 36} x2={x + 284} y2={y + 36} stroke={pos.color} strokeOpacity={0.3} strokeWidth={1} />

              {/* 헤더 */}
              <text x={x + 16} y={y + 54} fontSize={10} fontWeight={700} fill="var(--muted-foreground)">사용처</text>
              <text x={x + 130} y={y + 54} fontSize={10} fontWeight={700} fill="var(--muted-foreground)">활성화</text>
              <text x={x + 210} y={y + 54} fontSize={10} fontWeight={700} fill="var(--muted-foreground)">이유</text>

              {/* 행들 */}
              {pos.choices.map((c, j) => {
                const rowY = y + 72 + j * rowHeight;
                return (
                  <g key={j}>
                    <text x={x + 16} y={rowY} fontSize={11} fill="var(--foreground)">
                      {c.arch}
                    </text>
                    <rect x={x + 126} y={rowY - 13} width={78} height={18} rx={3}
                      fill={pos.color} fillOpacity={0.15} stroke={pos.color} strokeWidth={0.5} />
                    <text x={x + 165} y={rowY} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700} fill={pos.color}>
                      {c.fn}
                    </text>
                    <text x={x + 210} y={rowY} fontSize={10} fill="var(--muted-foreground)">
                      {c.why}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        <text x={320} y={372} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">"One size fits all"은 옛말 — 위치·역할·아키텍처에 따라 활성화 선택</text>
      </svg>
    </div>
  );
}
