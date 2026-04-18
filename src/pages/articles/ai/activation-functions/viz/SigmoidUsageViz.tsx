export default function SigmoidUsageViz() {
  const usages = [
    {
      name: 'Binary Classification',
      color: '#3b82f6',
      why: '출력을 0~1 확률로 변환',
      how: 'σ(logit) → P(class=1)',
      example: 'loss: BCEWithLogitsLoss',
    },
    {
      name: 'Multi-label',
      color: '#10b981',
      why: '각 클래스를 독립적으로 0/1 판단',
      how: '클래스마다 σ 적용 (softmax 아님)',
      example: 'loss: Σ BCE (클래스별 합산)',
    },
    {
      name: 'LSTM/GRU Gate',
      color: '#f59e0b',
      why: '정보 흐름을 0~1 밸브로 조절',
      how: 'forget·input·output 3개 gate',
      example: 'σ=0 차단, σ=1 통과',
    },
    {
      name: 'GLU Gating',
      color: '#06b6d4',
      why: '입력을 선택적으로 통과시킴',
      how: '(W₁x) ⊙ σ(W₂x)',
      example: 'SwiGLU, Transformer FFN',
    },
    {
      name: 'Calibration',
      color: '#ef4444',
      why: '모델 logit을 해석 가능한 확률로',
      how: 'P = σ(logit/T), T=temperature',
      example: '의료·금융 의사결정',
    },
    {
      name: 'Attention Gate',
      color: '#8b5cf6',
      why: '독립적 attention weight 생성',
      how: '각 위치에 σ (softmax 대신)',
      example: 'multi-query attention',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 310" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={22} textAnchor="middle" fontSize={15} fontWeight={700}
          fill="var(--foreground)">Sigmoid 현대 사용처</text>
        <text x={320} y={38} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">Hidden layer에선 ReLU/GELU로 대체 — Output/Gate에서 여전히 필수</text>

        {usages.map((u, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 15 + col * 207;
          const y = 52 + row * 118;
          return (
            <g key={u.name}>
              <rect x={x} y={y} width={198} height={106} rx={8}
                fill={`${u.color}08`} stroke={u.color} strokeWidth={1.5} />

              {/* title */}
              <text x={x + 99} y={y + 18} textAnchor="middle"
                fontSize={11} fontWeight={700} fill={u.color}>{u.name}</text>
              <line x1={x + 10} y1={y + 24} x2={x + 188} y2={y + 24}
                stroke={u.color} strokeOpacity={0.3} strokeWidth={0.6} />

              {/* why */}
              <text x={x + 10} y={y + 40} fontSize={9} fontWeight={600} fill="var(--foreground)">
                {u.why}
              </text>

              {/* how */}
              <text x={x + 10} y={y + 58} fontSize={8} fontFamily="monospace" fill={u.color}>
                {u.how}
              </text>

              {/* example */}
              <rect x={x + 8} y={y + 70} width={182} height={28} rx={5}
                fill="var(--muted)" fillOpacity={0.2} />
              <text x={x + 99} y={y + 88} textAnchor="middle"
                fontSize={8} fill="var(--muted-foreground)">
                {u.example}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
