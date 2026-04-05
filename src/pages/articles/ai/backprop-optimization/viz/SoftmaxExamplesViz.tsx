export default function SoftmaxExamplesViz() {
  const examples = [
    {
      title: '표준 스케일',
      input: [1, 2, 3],
      output: [0.09, 0.245, 0.665],
      note: '최대값이 부각됨',
      color: '#3b82f6',
    },
    {
      title: '큰 스케일',
      input: [10, 20, 30],
      output: [0.00005, 0.0005, 0.999],
      note: '큰 값은 거의 1, 나머지 사라짐',
      color: '#ef4444',
    },
    {
      title: '작은 차이',
      input: [0.1, 0.2, 0.3],
      output: [0.30, 0.33, 0.37],
      note: '거의 균등 분포',
      color: '#10b981',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 330" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Softmax 증폭 효과 — 스케일에 따른 출력</text>

        {examples.map((ex, i) => {
          const x = 20 + i * 205;

          // 입력 바 차트 (normalize to 0-1 display)
          const inputMax = Math.max(...ex.input);
          const inputMin = Math.min(...ex.input);
          const inputRange = inputMax - inputMin || 1;

          return (
            <g key={ex.title}>
              <rect x={x} y={48} width={195} height={265} rx={10}
                fill={ex.color} fillOpacity={0.06} stroke={ex.color} strokeWidth={1.8} />

              <text x={x + 97} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill={ex.color}>
                {ex.title}
              </text>

              {/* 입력 logits */}
              <text x={x + 12} y={94} fontSize={11} fontWeight={700} fill="var(--foreground)">입력 x</text>
              {ex.input.map((v, j) => {
                const barH = ((v - inputMin) / inputRange) * 40 + 4;
                return (
                  <g key={j}>
                    <rect x={x + 20 + j * 55} y={140 - barH} width={40} height={barH}
                      fill="#94a3b8" fillOpacity={0.4} stroke="#94a3b8" strokeWidth={1} />
                    <text x={x + 40 + j * 55} y={152} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* 화살표 */}
              <text x={x + 97} y={176} textAnchor="middle" fontSize={14} fontWeight={700} fill={ex.color}>↓ softmax</text>

              {/* 출력 확률 */}
              <text x={x + 12} y={202} fontSize={11} fontWeight={700} fill="var(--foreground)">출력 p</text>
              {ex.output.map((v, j) => {
                const barH = v * 70 + 2;
                return (
                  <g key={j}>
                    <rect x={x + 20 + j * 55} y={260 - barH} width={40} height={barH}
                      fill={ex.color} fillOpacity={0.5} stroke={ex.color} strokeWidth={1.2} />
                    <text x={x + 40 + j * 55} y={272} textAnchor="middle" fontSize={9} fontFamily="monospace" fontWeight={700} fill={ex.color}>
                      {v < 0.001 ? v.toExponential(0) : v.toFixed(3)}
                    </text>
                  </g>
                );
              })}

              {/* 노트 */}
              <text x={x + 97} y={298} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                {ex.note}
              </text>
            </g>
          );
        })}

        <text x={320} y={325} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">공식: p_i = exp(x_i) / Σ exp(x_j) — 차이가 클수록 최대값만 남고 나머지 소멸</text>
      </svg>
    </div>
  );
}
