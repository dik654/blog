import { useState } from 'react';

export default function KinkModelViz() {
  const [utilization, setUtilization] = useState(85);

  // Comet USDC parameters
  const borrowKink = 90;
  const borrowBase = 1.5; // %
  const borrowSlopeLow = 3.3; // annual rate at kink (low slope produces 3% over 90%)
  const borrowSlopeHigh = 200; // % steep
  const supplyBase = 0;
  const supplySlopeLow = 3.7;
  const supplySlopeHigh = 172;

  const calcBorrow = (u: number) => {
    if (u <= borrowKink) {
      return borrowBase + (borrowSlopeLow * u) / borrowKink;
    }
    return borrowBase + borrowSlopeLow + (borrowSlopeHigh * (u - borrowKink)) / (100 - borrowKink);
  };

  const calcSupply = (u: number) => {
    if (u <= borrowKink) {
      return supplyBase + (supplySlopeLow * u) / borrowKink;
    }
    return supplyBase + supplySlopeLow + (supplySlopeHigh * (u - borrowKink)) / (100 - borrowKink);
  };

  const borrowRate = calcBorrow(utilization);
  const supplyRate = calcSupply(utilization);
  const spread = borrowRate - supplyRate;

  const w = 440;
  const h = 160;
  const padLeft = 54;
  const maxRate = 25;

  const toX = (u: number) => padLeft + (u / 100) * w;
  const toY = (r: number) => 66 + h - (r / maxRate) * h;

  // Generate curve points
  const borrowPoints: { u: number; r: number }[] = [];
  const supplyPoints: { u: number; r: number }[] = [];
  for (let u = 0; u <= 100; u += 1) {
    borrowPoints.push({ u, r: calcBorrow(u) });
    supplyPoints.push({ u, r: calcSupply(u) });
  }

  const borrowPath = borrowPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.u)} ${toY(Math.min(p.r, maxRate))}`)
    .join(' ');
  const supplyPath = supplyPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.u)} ${toY(Math.min(p.r, maxRate))}`)
    .join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">Utilization</label>
        <input type="range" min={0} max={100} step={1} value={utilization}
          onChange={(e) => setUtilization(+e.target.value)} className="flex-1 accent-red-500" />
        <span className="text-sm font-bold text-foreground min-w-[50px] text-right">{utilization}%</span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Kink 모델 — Comet USDC (kink=90%)</text>

        {/* 범례 */}
        <rect x={30} y={38} width={14} height={14} rx={2} fill="#ef4444" fillOpacity={0.4} />
        <text x={50} y={50} fontSize={10} fontWeight={600} fill="#ef4444">Borrow rate</text>
        <rect x={160} y={38} width={14} height={14} rx={2} fill="#10b981" fillOpacity={0.4} />
        <text x={180} y={50} fontSize={10} fontWeight={600} fill="#10b981">Supply rate</text>
        <rect x={290} y={38} width={14} height={14} rx={2} fill="#f59e0b" fillOpacity={0.4} />
        <text x={310} y={50} fontSize={10} fontWeight={600} fill="#f59e0b">Kink (90%)</text>

        {/* 축 */}
        <line x1={padLeft} y1={66 + h} x2={padLeft + w} y2={66 + h} stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={66} x2={padLeft} y2={66 + h} stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 */}
        {[0, 5, 10, 15, 20, 25].map(r => {
          const y = toY(r);
          return (
            <g key={r}>
              <line x1={padLeft} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {r}%
              </text>
            </g>
          );
        })}

        {/* X축 */}
        {[0, 25, 50, 75, 90, 100].map(u => {
          const x = toX(u);
          return (
            <g key={u}>
              <line x1={x} y1={66 + h} x2={x} y2={66 + h + 4} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={66 + h + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {u}%
              </text>
            </g>
          );
        })}

        {/* Kink 수직선 */}
        <line x1={toX(borrowKink)} y1={66} x2={toX(borrowKink)} y2={66 + h}
          stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2" />

        {/* Supply 영역 */}
        <path d={`${supplyPath} L ${padLeft + w} ${66 + h} L ${padLeft} ${66 + h} Z`}
          fill="#10b981" fillOpacity={0.1} />
        {/* Borrow 곡선 */}
        <path d={borrowPath} stroke="#ef4444" strokeWidth={2.5} fill="none" />
        {/* Supply 곡선 */}
        <path d={supplyPath} stroke="#10b981" strokeWidth={2.5} fill="none" />

        {/* 현재 위치 */}
        <circle cx={toX(utilization)} cy={toY(Math.min(borrowRate, maxRate))} r={5}
          fill="#ef4444" stroke="var(--card)" strokeWidth={1.5} />
        <circle cx={toX(utilization)} cy={toY(Math.min(supplyRate, maxRate))} r={5}
          fill="#10b981" stroke="var(--card)" strokeWidth={1.5} />

        {/* 결과 */}
        <rect x={20} y={256} width={155} height={72} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.8} />
        <text x={97} y={276} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          Borrow rate
        </text>
        <text x={97} y={302} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">
          {borrowRate.toFixed(2)}%
        </text>
        <text x={97} y={320} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          {utilization <= borrowKink ? 'low slope' : 'high slope'}
        </text>

        <rect x={185} y={256} width={150} height={72} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={260} y={276} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Supply rate
        </text>
        <text x={260} y={302} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">
          {supplyRate.toFixed(2)}%
        </text>
        <text x={260} y={320} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          APY 예치자
        </text>

        <rect x={345} y={256} width={155} height={72} rx={8}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} />
        <text x={422} y={276} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          Spread
        </text>
        <text x={422} y={302} textAnchor="middle" fontSize={20} fontWeight={700} fill="#f59e0b">
          {spread.toFixed(2)}%
        </text>
        <text x={422} y={320} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          프로토콜 수익
        </text>
      </svg>
    </div>
  );
}
