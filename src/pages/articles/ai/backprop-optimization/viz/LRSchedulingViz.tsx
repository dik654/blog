export default function LRSchedulingViz() {
  const totalSteps = 100;
  const steps = Array.from({ length: totalSteps + 1 }, (_, i) => i);

  // 각 schedule 계산
  const eta0 = 1.0;
  const constant = steps.map(() => eta0);
  const stepDecay = steps.map((t) => eta0 * Math.pow(0.5, Math.floor(t / 30)));
  const cosine = steps.map((t) => 0.05 + 0.5 * (eta0 - 0.05) * (1 + Math.cos(Math.PI * t / totalSteps)));
  const warmupCosine = steps.map((t) => {
    const warmup = 10;
    if (t < warmup) return (eta0 * t) / warmup;
    const tNorm = (t - warmup) / (totalSteps - warmup);
    return 0.05 + 0.5 * (eta0 - 0.05) * (1 + Math.cos(Math.PI * tNorm));
  });
  const cyclical = steps.map((t) => 0.1 + 0.45 * (1 + Math.sin((t / 20) * Math.PI)));

  const plotX = (t: number) => 60 + (t / totalSteps) * 520;
  const plotY = (lr: number) => 220 - (lr / 1.1) * 170;

  const pathOf = (arr: number[]) =>
    arr.map((lr, i) => `${i === 0 ? 'M' : 'L'} ${plotX(i).toFixed(1)} ${plotY(lr).toFixed(1)}`).join(' ');

  const schedules = [
    { name: 'Constant', path: pathOf(constant), color: '#94a3b8', note: '고정 (baseline)' },
    { name: 'Step Decay', path: pathOf(stepDecay), color: '#3b82f6', note: '계단식 감소' },
    { name: 'Cosine', path: pathOf(cosine), color: '#10b981', note: '부드러운 cos 감쇠' },
    { name: 'Warmup+Cosine', path: pathOf(warmupCosine), color: '#ef4444', note: 'LLM 표준' },
    { name: 'Cyclical', path: pathOf(cyclical), color: '#f59e0b', note: '주기적 증감' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Learning Rate Scheduling — 5가지 전략</text>

        {/* 축 */}
        <line x1={60} y1={220} x2={580} y2={220} stroke="var(--border)" strokeWidth={1.5} />
        <line x1={60} y1={50} x2={60} y2={220} stroke="var(--border)" strokeWidth={1.5} />

        <text x={588} y={224} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">step</text>
        <text x={54} y={44} fontSize={11} fontWeight={600} fill="var(--muted-foreground)" textAnchor="end">lr</text>

        {/* x 눈금 */}
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={plotX(t)} y1={217} x2={plotX(t)} y2={223} stroke="var(--border)" strokeWidth={1} />
            <text x={plotX(t)} y={238} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">{t}</text>
          </g>
        ))}

        {/* y 눈금 */}
        {[0, 0.5, 1.0].map((lr) => (
          <g key={lr}>
            <line x1={57} y1={plotY(lr)} x2={63} y2={plotY(lr)} stroke="var(--border)" strokeWidth={1} />
            <text x={54} y={plotY(lr) + 4} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">{lr.toFixed(1)}</text>
          </g>
        ))}

        {/* 곡선들 */}
        {schedules.map((s) => (
          <path key={s.name} d={s.path} fill="none" stroke={s.color} strokeWidth={2.2} opacity={0.9} />
        ))}

        {/* 범례 */}
        {schedules.map((s, i) => {
          const x = 60 + i * 118;
          return (
            <g key={s.name}>
              <line x1={x} y1={265} x2={x + 22} y2={265} stroke={s.color} strokeWidth={3} />
              <text x={x + 28} y={269} fontSize={11} fontWeight={700} fill={s.color}>{s.name}</text>
              <text x={x} y={285} fontSize={9} fill="var(--muted-foreground)">{s.note}</text>
            </g>
          );
        })}

        {/* 표준값 메모 */}
        <rect x={60} y={297} width={520} height={34} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={72} y={315} fontSize={10} fontWeight={700} fill="var(--foreground)">표준 초기값:</text>
        <text x={148} y={315} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          SGD=0.01~0.1, Adam=1e-3, BERT/LLM=1e-4~5e-5
        </text>
        <text x={72} y={328} fontSize={10} fontWeight={700} fill="var(--foreground)">2023~ 표준:</text>
        <text x={148} y={328} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          Warmup + Cosine decay (LLM 훈련)
        </text>
      </svg>
    </div>
  );
}
