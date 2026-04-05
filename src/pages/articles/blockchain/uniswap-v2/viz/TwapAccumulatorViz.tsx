export default function TwapAccumulatorViz() {
  const events = [
    { t: 0, price: 3000, accum: 0 },
    { t: 60, price: 3000, accum: 180000 },   // 60s × 3000
    { t: 180, price: 3100, accum: 552000 },  // +120s × 3100
    { t: 300, price: 3050, accum: 918000 },  // +120s × 3050
    { t: 420, price: 3150, accum: 1296000 }, // +120s × 3150
  ];

  const w = 420;
  const h = 130;
  const padLeft = 68;
  const totalTime = 420;
  const maxPrice = 3200;
  const minPrice = 2900;

  const toX = (t: number) => padLeft + (t / totalTime) * w;
  const toYPrice = (p: number) => 62 + h - ((p - minPrice) / (maxPrice - minPrice)) * h;

  // 계단식 가격 path
  const priceSteps: string[] = [];
  for (let i = 0; i < events.length - 1; i++) {
    const e = events[i];
    const next = events[i + 1];
    if (i === 0) priceSteps.push(`M ${toX(e.t)} ${toYPrice(e.price)}`);
    priceSteps.push(`L ${toX(next.t)} ${toYPrice(e.price)}`);
    priceSteps.push(`L ${toX(next.t)} ${toYPrice(next.price)}`);
  }
  const pathData = priceSteps.join(' ');

  // area fill 아래 영역
  const areaPath = `${pathData} L ${toX(events[events.length - 1].t)} ${62 + h} L ${toX(0)} ${62 + h} Z`;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">TWAP — price × time 누적 (적분)</text>

        <text x={260} y={40} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">priceCumulative += price × timeElapsed (스왑/mint/burn 시 갱신)</text>

        {/* 축 */}
        <line x1={padLeft} y1={62 + h} x2={padLeft + w} y2={62 + h} stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={62} x2={padLeft} y2={62 + h} stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 */}
        {[2900, 3000, 3100, 3200].map(v => {
          const y = toYPrice(v);
          return (
            <g key={v}>
              <line x1={padLeft} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                ${v}
              </text>
            </g>
          );
        })}

        {/* X축 */}
        {[0, 60, 180, 300, 420].map(t => {
          const x = toX(t);
          return (
            <g key={t}>
              <line x1={x} y1={62 + h} x2={x} y2={62 + h + 4} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={62 + h + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {t}s
              </text>
            </g>
          );
        })}

        {/* Area (적분 영역) */}
        <path d={areaPath} fill="#3b82f6" fillOpacity={0.12} />

        {/* 가격 곡선 */}
        <path d={pathData} stroke="#3b82f6" strokeWidth={2.5} fill="none" />

        {/* 이벤트 포인트 */}
        {events.map((e, i) => (
          <g key={i}>
            <circle cx={toX(e.t)} cy={toYPrice(e.price)} r={4} fill="#3b82f6" stroke="var(--card)" strokeWidth={1.5} />
            <text x={toX(e.t)} y={toYPrice(e.price) - 8} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
              ${e.price}
            </text>
          </g>
        ))}

        {/* 누적값 표시 */}
        <text x={padLeft + w + 10} y={62 + h / 2 + 4} fontSize={10} fontWeight={700} fill="#3b82f6">
          적분
        </text>
        <text x={padLeft + w + 10} y={62 + h / 2 + 18} fontSize={8} fill="var(--muted-foreground)">
          = 면적
        </text>

        {/* TWAP 계산 */}
        <rect x={20} y={234} width={480} height={76} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={254} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          TWAP 계산 — 두 시점의 cumulative 차이
        </text>
        <text x={260} y={276} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          TWAP = (cumulative_end − cumulative_start) / timeElapsed
        </text>
        <text x={260} y={294} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          예시: (1,296,000 − 0) / 420s = 3,086 USDC/ETH (평균)
        </text>
      </svg>
    </div>
  );
}
