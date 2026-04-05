export default function DutchAuctionViz() {
  const origin = { x: 75, y: 210 };
  const w = 400;
  const h = 140;
  const maxPrice = 3500;
  const startPrice = 3300;
  const cut = 0.99;

  // 15 step 생성 (각 1분)
  const points: [number, number][] = [];
  for (let t = 0; t <= 15; t++) {
    const price = startPrice * Math.pow(cut, t);
    points.push([t, price]);
  }

  const toX = (t: number) => origin.x + (t / 15) * w;
  const toY = (p: number) => origin.y - ((p - 2800) / (maxPrice - 2800)) * h;

  const pathData = points.map(([t, p], i) => `${i === 0 ? 'M' : 'L'} ${toX(t)} ${toY(p)}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 280" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Dutch Auction — 가격 하락 경매 (Liquidations 2.0)</text>

        {/* 축 */}
        <line x1={origin.x} y1={origin.y} x2={origin.x + w} y2={origin.y}
          stroke="var(--foreground)" strokeWidth={1} />
        <line x1={origin.x} y1={origin.y} x2={origin.x} y2={origin.y - h}
          stroke="var(--foreground)" strokeWidth={1} />

        {/* Y축 라벨 */}
        {[2800, 3000, 3200, 3500].map(p => (
          <g key={p}>
            <line x1={origin.x - 4} y1={toY(p)} x2={origin.x} y2={toY(p)}
              stroke="var(--foreground)" strokeWidth={0.8} />
            <text x={origin.x - 8} y={toY(p) + 4} textAnchor="end" fontSize={10}
              fill="var(--muted-foreground)">${p}</text>
          </g>
        ))}

        {/* X축 라벨 */}
        {[0, 5, 10, 15].map(t => (
          <g key={t}>
            <line x1={toX(t)} y1={origin.y} x2={toX(t)} y2={origin.y + 4}
              stroke="var(--foreground)" strokeWidth={0.8} />
            <text x={toX(t)} y={origin.y + 18} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)">{t}min</text>
          </g>
        ))}

        {/* 시장가 라인 */}
        <line x1={origin.x} y1={toY(3000)} x2={origin.x + w} y2={toY(3000)}
          stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={origin.x + w + 6} y={toY(3000) + 4} fontSize={10} fontWeight={600} fill="#f59e0b">시장가</text>

        {/* 경매 곡선 */}
        <path d={pathData} stroke="#3b82f6" strokeWidth={2.5} fill="none" />

        {/* 시작 점 */}
        <circle cx={toX(0)} cy={toY(startPrice)} r={5} fill="#3b82f6" />
        <text x={toX(0) + 10} y={toY(startPrice) - 6} fontSize={10} fontWeight={700} fill="#3b82f6">
          시작 $3,300 (+10%)
        </text>

        {/* 낙찰 점 */}
        <circle cx={toX(8)} cy={toY(startPrice * Math.pow(cut, 8))} r={6} fill="#10b981" />
        <text x={toX(8)} y={toY(startPrice * Math.pow(cut, 8)) - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          낙찰
        </text>
        <text x={toX(8)} y={toY(startPrice * Math.pow(cut, 8)) + 18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">
          ${Math.round(startPrice * Math.pow(cut, 8))}
        </text>

        {/* 설명 */}
        <text x={260} y={260} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">cut=0.99 · step=1min · 첫 매수자 낙찰</text>
      </svg>
    </div>
  );
}
