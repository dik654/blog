export default function TemperatureViz() {
  const input = [1, 2, 3];

  const softmaxT = (x: number[], T: number) => {
    const scaled = x.map((v) => v / T);
    const maxV = Math.max(...scaled);
    const exp = scaled.map((v) => Math.exp(v - maxV));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map((v) => v / sum);
  };

  const temps = [
    { T: 0.1, label: 'T=0.1', note: '거의 one-hot', color: '#ef4444' },
    { T: 0.5, label: 'T=0.5', note: 'sharper', color: '#f59e0b' },
    { T: 1.0, label: 'T=1.0', note: '표준', color: '#3b82f6' },
    { T: 2.0, label: 'T=2.0', note: 'softer', color: '#10b981' },
    { T: 5.0, label: 'T=5.0', note: 'nearly uniform', color: '#8b5cf6' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 330" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Temperature Scaling — 출력 분포 조절</text>
        <text x={320} y={42} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          입력 logits = [1, 2, 3] · 공식: softmax(x/T)
        </text>

        {temps.map((t, i) => {
          const x = 20 + i * 125;
          const probs = softmaxT(input, t.T);
          return (
            <g key={t.label}>
              <rect x={x} y={62} width={115} height={220} rx={8}
                fill={t.color} fillOpacity={0.06} stroke={t.color} strokeWidth={1.8} />

              <text x={x + 57} y={82} textAnchor="middle" fontSize={13} fontWeight={700} fill={t.color}>
                {t.label}
              </text>

              {/* 바 차트 */}
              {probs.map((p, j) => {
                const barH = p * 110 + 2;
                return (
                  <g key={j}>
                    <rect x={x + 15 + j * 30} y={210 - barH} width={24} height={barH}
                      fill={t.color} fillOpacity={0.5} stroke={t.color} strokeWidth={1.2} />
                    <text x={x + 27 + j * 30} y={225} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
                      x={j + 1}
                    </text>
                    <text x={x + 27 + j * 30} y={210 - barH - 4} textAnchor="middle" fontSize={8} fontFamily="monospace" fontWeight={700} fill={t.color}>
                      {p < 0.01 ? p.toFixed(3) : p.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* 축 */}
              <line x1={x + 10} y1={210} x2={x + 105} y2={210} stroke="var(--border)" strokeWidth={0.8} />

              <text x={x + 57} y={250} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                {t.note}
              </text>

              {/* entropy 표시 */}
              <text x={x + 57} y={266} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                entropy={(-probs.reduce((s, p) => s + p * Math.log(p + 1e-10), 0)).toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* 사용 사례 */}
        <rect x={20} y={294} width={600} height={30} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={320} y={314} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          사용: LLM 샘플링(T=0.7 balanced), Knowledge Distillation(T=5~10), Model Calibration
        </text>
      </svg>
    </div>
  );
}
