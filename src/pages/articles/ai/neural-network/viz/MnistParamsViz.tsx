export default function MnistParamsViz() {
  const layers = [
    { name: 'Layer 1', from: 784, to: 50, weights: 39200, bias: 50, color: '#3b82f6' },
    { name: 'Layer 2', from: 50, to: 100, weights: 5000, bias: 100, color: '#10b981' },
    { name: 'Layer 3', from: 100, to: 10, weights: 1000, bias: 10, color: '#ef4444' },
  ];
  const total = 45360;

  const evolution = [
    { model: 'Linear', params: '7.8K', acc: '92.7%', year: '—', color: '#94a3b8' },
    { model: 'MLP-3', params: '~45K', acc: '~97%', year: '1990s', color: '#3b82f6' },
    { model: 'LeNet-5', params: '~60K', acc: '99.2%', year: '1998', color: '#10b981' },
    { model: 'ResNet-18', params: '~11M', acc: '99.5%', year: '2015', color: '#f59e0b' },
    { model: 'Human', params: '—', acc: '99.8%', year: '—', color: '#ef4444' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 420" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">MNIST MLP — 파라미터 수 & 진화</text>

        {/* 3-layer 파라미터 breakdown */}
        <text x={320} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          784 → 50 → 100 → 10 구조 파라미터
        </text>

        {layers.map((l, i) => {
          const x = 30 + i * 205;
          // 각 층 파라미터 비율 시각화
          const wFrac = l.weights / total;
          const barW = 170 * wFrac;
          return (
            <g key={i}>
              <rect x={x} y={68} width={185} height={125} rx={8}
                fill={l.color} fillOpacity={0.08} stroke={l.color} strokeWidth={1.8} />

              <text x={x + 92} y={88} textAnchor="middle" fontSize={12} fontWeight={700} fill={l.color}>
                {l.name}
              </text>
              <text x={x + 92} y={104} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {l.from} → {l.to}
              </text>

              {/* W breakdown */}
              <text x={x + 12} y={122} fontSize={10} fill="var(--muted-foreground)">
                W: {l.from}×{l.to} = <tspan fontWeight={700} fill={l.color}>{l.weights.toLocaleString()}</tspan>
              </text>
              <text x={x + 12} y={136} fontSize={10} fill="var(--muted-foreground)">
                b: <tspan fontWeight={700} fill={l.color}>{l.bias}</tspan>
              </text>

              <line x1={x + 12} y1={144} x2={x + 173} y2={144} stroke={l.color} strokeOpacity={0.3} strokeWidth={0.8} />

              <text x={x + 12} y={160} fontSize={10} fontWeight={700} fill={l.color}>
                총 {(l.weights + l.bias).toLocaleString()}
              </text>

              {/* 비율 바 */}
              <rect x={x + 12} y={166} width={160} height={6} rx={3}
                fill={l.color} fillOpacity={0.15} />
              <rect x={x + 12} y={166} width={barW} height={6} rx={3}
                fill={l.color} fillOpacity={0.7} />
              <text x={x + 92} y={180} textAnchor="middle" fontSize={9} fontWeight={600} fill={l.color}>
                {(wFrac * 100).toFixed(0)}% 차지
              </text>
            </g>
          );
        })}

        {/* 총계 */}
        <rect x={30} y={210} width={580} height={42} rx={7}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={320} y={230} textAnchor="middle" fontSize={14} fontWeight={700} fill="#8b5cf6">
          총 파라미터: 45,360개 (Float32 = 177 KB)
        </text>
        <text x={320} y={245} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Layer 1(W₁)이 87% 차지 — 입력 차원(784)이 컸기 때문
        </text>

        {/* 진화 비교 */}
        <text x={320} y={281} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          MNIST 해결 역사 — 모델 규모 vs 정확도
        </text>

        {evolution.map((e, i) => {
          const x = 25 + i * 120;
          return (
            <g key={i}>
              <rect x={x} y={293} width={110} height={100} rx={7}
                fill={e.color} fillOpacity={0.08} stroke={e.color} strokeWidth={1.5} />

              <text x={x + 55} y={312} textAnchor="middle" fontSize={12} fontWeight={700} fill={e.color}>
                {e.model}
              </text>

              <line x1={x + 10} y1={319} x2={x + 100} y2={319} stroke={e.color} strokeOpacity={0.3} strokeWidth={0.8} />

              <text x={x + 10} y={337} fontSize={9} fill="var(--muted-foreground)">Params</text>
              <text x={x + 100} y={337} textAnchor="end" fontSize={10} fontFamily="monospace" fontWeight={700} fill="var(--foreground)">
                {e.params}
              </text>

              <text x={x + 10} y={355} fontSize={9} fill="var(--muted-foreground)">Accuracy</text>
              <text x={x + 100} y={355} textAnchor="end" fontSize={10} fontFamily="monospace" fontWeight={700} fill={e.color}>
                {e.acc}
              </text>

              <text x={x + 10} y={373} fontSize={9} fill="var(--muted-foreground)">Year</text>
              <text x={x + 100} y={373} textAnchor="end" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {e.year}
              </text>
            </g>
          );
        })}

        <text x={320} y={411} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">비교: AlexNet(2012) ~60M, GPT-3(2020) 175B, GPT-4 1T+ — 규모 혁명</text>
      </svg>
    </div>
  );
}
