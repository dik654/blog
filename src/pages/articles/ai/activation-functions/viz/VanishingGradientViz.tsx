export default function VanishingGradientViz() {
  // σ'(x) = σ(x)(1-σ(x)), max at x=0 is 0.25
  const maxGrad = 0.25;
  const layers = Array.from({ length: 21 }, (_, i) => i);
  const gradients = layers.map((n) => Math.pow(maxGrad, n));

  // log scale plot
  const plotX = (n: number) => 70 + (n / 20) * 500;
  const plotY = (val: number) => {
    const logVal = Math.log10(val + 1e-20);
    // log 0 to log 1e-12 → y 230 to y 50
    return 230 - ((logVal + 12) / 12) * 180;
  };

  const path = gradients
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${plotX(i).toFixed(1)} ${plotY(v).toFixed(1)}`)
    .join(' ');

  const points = [
    { n: 1, v: 0.25, note: '1층: 0.25' },
    { n: 5, v: 0.00098, note: '5층: 1e-3' },
    { n: 10, v: 9.5e-7, note: '10층: 1e-6' },
    { n: 20, v: 9.1e-13, note: '20층: 1e-12' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Sigmoid의 Vanishing Gradient — 0.25ᴺ 지수 감쇠</text>
        <text x={320} y={42} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          σ'(x) = σ(x)·(1−σ(x)),  max σ'(0) = 0.25  →  N층 누적 gradient ∝ 0.25ᴺ
        </text>

        {/* 축 */}
        <line x1={70} y1={230} x2={570} y2={230} stroke="var(--border)" strokeWidth={1.5} />
        <line x1={70} y1={50} x2={70} y2={230} stroke="var(--border)" strokeWidth={1.5} />

        <text x={578} y={234} fontSize={12} fontWeight={600} fill="var(--muted-foreground)">층수 N</text>
        <text x={64} y={44} fontSize={12} fontWeight={600} fill="var(--muted-foreground)" textAnchor="end">gradient</text>

        {/* y 눈금 (log scale) */}
        {[0, -3, -6, -9, -12].map((logV) => (
          <g key={logV}>
            <line x1={67} y1={plotY(Math.pow(10, logV))} x2={73} y2={plotY(Math.pow(10, logV))} stroke="var(--border)" strokeWidth={1} />
            <text x={62} y={plotY(Math.pow(10, logV)) + 4} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)" textAnchor="end">
              10^{logV}
            </text>
          </g>
        ))}

        {/* x 눈금 */}
        {[0, 5, 10, 15, 20].map((n) => (
          <g key={n}>
            <line x1={plotX(n)} y1={227} x2={plotX(n)} y2={233} stroke="var(--border)" strokeWidth={1} />
            <text x={plotX(n)} y={248} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">{n}</text>
          </g>
        ))}

        {/* 감쇠 곡선 */}
        <path d={path} fill="none" stroke="#ef4444" strokeWidth={2.5} />

        {/* 실용 한계선 (1e-6) */}
        <line x1={70} y1={plotY(1e-6)} x2={570} y2={plotY(1e-6)} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={575} y={plotY(1e-6) + 4} fontSize={10} fontWeight={700} fill="#f59e0b">
          학습 한계 (1e-6)
        </text>

        {/* 주요 지점 마커 */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={plotX(p.n)} cy={plotY(p.v)} r={6} fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={2} />
            <text x={plotX(p.n) + 10} y={plotY(p.v) - 8} fontSize={10} fontWeight={700} fill="#ef4444">{p.note}</text>
          </g>
        ))}

        {/* 해결책 요약 */}
        <rect x={20} y={272} width={600} height={60} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.5} />
        <text x={32} y={290} fontSize={12} fontWeight={700} fill="#10b981">해결책 (현대 딥러닝)</text>
        <text x={32} y={308} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          1) ReLU (양수 구간 gradient=1)   2) BatchNorm   3) Residual/Skip connections (ResNet)
        </text>
        <text x={32} y={324} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          4) LSTM/GRU gating   5) Xavier/He initialization   → 100+ layer 학습 가능
        </text>
      </svg>
    </div>
  );
}
