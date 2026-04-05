export default function OverfitUnderfitViz() {
  // 손실 곡선 생성
  const epochs = 40;
  const epochArr = Array.from({ length: epochs + 1 }, (_, i) => i);

  // Training loss — 지속적으로 감소
  const trainLoss = epochArr.map((e) => 2.0 * Math.exp(-e * 0.15) + 0.1);

  // Validation loss — 15 epoch 이후 반등
  const valLoss = epochArr.map((e) => {
    if (e < 15) return 2.0 * Math.exp(-e * 0.12) + 0.25;
    return 0.35 + (e - 15) * 0.025;
  });

  // 좌표 변환: epoch 0~40 → x 80~560, loss 0~2.5 → y 230~60
  const plotX = (e: number) => 80 + (e / epochs) * 480;
  const plotY = (l: number) => 230 - (l / 2.5) * 170;

  const pathTrain = trainLoss.map((l, i) => `${i === 0 ? 'M' : 'L'} ${plotX(i).toFixed(1)} ${plotY(l).toFixed(1)}`).join(' ');
  const pathVal = valLoss.map((l, i) => `${i === 0 ? 'M' : 'L'} ${plotX(i).toFixed(1)} ${plotY(l).toFixed(1)}`).join(' ');

  // Sweet spot at epoch 15
  const sweetX = plotX(15);
  const sweetY = plotY(valLoss[15]);

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 400" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">과적합 vs 과소적합 — 손실 곡선</text>

        {/* 축 */}
        <line x1={80} y1={230} x2={560} y2={230} stroke="var(--border)" strokeWidth={1.5} />
        <line x1={80} y1={60} x2={80} y2={230} stroke="var(--border)" strokeWidth={1.5} />

        <text x={568} y={234} fontSize={12} fontWeight={600} fill="var(--muted-foreground)">Epoch</text>
        <text x={74} y={54} fontSize={12} fontWeight={600} fill="var(--muted-foreground)" textAnchor="end">Loss</text>

        {/* x 눈금 */}
        {[0, 10, 20, 30, 40].map((e) => (
          <g key={e}>
            <line x1={plotX(e)} y1={227} x2={plotX(e)} y2={233} stroke="var(--border)" strokeWidth={1} />
            <text x={plotX(e)} y={248} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle">{e}</text>
          </g>
        ))}
        {/* y 눈금 */}
        {[0, 0.5, 1, 1.5, 2].map((l) => (
          <g key={l}>
            <line x1={77} y1={plotY(l)} x2={83} y2={plotY(l)} stroke="var(--border)" strokeWidth={1} />
            <text x={74} y={plotY(l) + 4} fontSize={10} fill="var(--muted-foreground)" textAnchor="end">{l}</text>
          </g>
        ))}

        {/* 3개 구간 배경 */}
        <rect x={80} y={60} width={plotX(8) - 80} height={170} fill="#f59e0b" fillOpacity={0.08} />
        <rect x={plotX(8)} y={60} width={plotX(20) - plotX(8)} height={170} fill="#10b981" fillOpacity={0.08} />
        <rect x={plotX(20)} y={60} width={560 - plotX(20)} height={170} fill="#ef4444" fillOpacity={0.08} />

        {/* 구간 라벨 */}
        <text x={(80 + plotX(8)) / 2} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          과소적합 (Underfit)
        </text>
        <text x={(plotX(8) + plotX(20)) / 2} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Sweet Spot
        </text>
        <text x={(plotX(20) + 560) / 2} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          과적합 (Overfit)
        </text>

        {/* 곡선 */}
        <path d={pathTrain} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
        <path d={pathVal} fill="none" stroke="#ef4444" strokeWidth={2.5} />

        {/* Sweet spot 표시 */}
        <circle cx={sweetX} cy={sweetY} r={8} fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeWidth={2.5} />
        <line x1={sweetX} y1={230} x2={sweetX} y2={sweetY} stroke="#10b981" strokeDasharray="4 3" strokeWidth={1.2} />
        <text x={sweetX + 12} y={sweetY - 8} fontSize={11} fontWeight={700} fill="#10b981">최적</text>

        {/* 곡선 라벨 */}
        <text x={plotX(35)} y={plotY(trainLoss[35]) + 18} fontSize={11} fontWeight={700} fill="#3b82f6">Training</text>
        <text x={plotX(35)} y={plotY(valLoss[35]) - 8} fontSize={11} fontWeight={700} fill="#ef4444">Validation</text>

        {/* 대응 방안 */}
        <rect x={20} y={270} width={300} height={115} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={170} y={290} textAnchor="middle" fontSize={13} fontWeight={700} fill="#f59e0b">
          과소적합 대응
        </text>
        <text x={30} y={310} fontSize={11} fill="var(--muted-foreground)">• 더 큰 모델 / 더 깊게</text>
        <text x={30} y={326} fontSize={11} fill="var(--muted-foreground)">• 더 오래 학습 (epoch 증가)</text>
        <text x={30} y={342} fontSize={11} fill="var(--muted-foreground)">• Learning rate 조정</text>
        <text x={30} y={358} fontSize={11} fill="var(--muted-foreground)">• Feature engineering</text>
        <text x={30} y={374} fontSize={11} fill="var(--muted-foreground)">• 정규화 강도 완화</text>

        <rect x={320} y={270} width={300} height={115} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1.5} />
        <text x={470} y={290} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
          과적합 대응
        </text>
        <text x={330} y={310} fontSize={11} fill="var(--muted-foreground)">• 더 많은 데이터 / Augmentation</text>
        <text x={330} y={326} fontSize={11} fill="var(--muted-foreground)">• Dropout (0.1~0.5)</text>
        <text x={330} y={342} fontSize={11} fill="var(--muted-foreground)">• Weight decay (L2 regularization)</text>
        <text x={330} y={358} fontSize={11} fill="var(--muted-foreground)">• Early stopping (Sweet Spot에서)</text>
        <text x={330} y={374} fontSize={11} fill="var(--muted-foreground)">• 모델 크기 감소</text>
      </svg>
    </div>
  );
}
