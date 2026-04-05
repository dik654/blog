import { useState } from 'react';

export default function ImpermanentLossViz() {
  const [priceRatio, setPriceRatio] = useState(2); // price change ratio

  // IL formula: IL = 2·sqrt(p) / (1+p) - 1
  const ilPct = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
  const ilPercent = ilPct * 100;

  // Initial $1000 LP position
  const initialValue = 1000;
  const hodlValue = 500 + 500 * priceRatio; // 50% USDC (stable) + 50% ETH (changes)
  const lpValue = initialValue * (1 + ilPct) * Math.sqrt(priceRatio) * 2 / (1 + priceRatio);
  // Simpler: LP value = 2 × sqrt(k × p)

  const k = 500 * 0.1; // initial 500 USDC, 0.1 ETH at $5000
  const newEthPrice = 5000 * priceRatio;
  const newY = Math.sqrt(k / (newEthPrice / 5000 * 5000));
  const newX = k / newY;
  const lpTotalValue = newX + newY * newEthPrice;

  const hodlValueDollar = 500 + 0.1 * newEthPrice;
  const ilDollar = lpTotalValue - hodlValueDollar;

  // IL curve points
  const ilCurve: { p: number; il: number }[] = [];
  for (let p = 0.1; p <= 10; p += 0.1) {
    const il = ((2 * Math.sqrt(p)) / (1 + p) - 1) * 100;
    ilCurve.push({ p, il });
  }

  const w = 440;
  const h = 140;
  const padLeft = 56;
  const minP = 0.1;
  const maxP = 10;
  const minIl = -30;
  const maxIl = 0;

  const toX = (p: number) => padLeft + (Math.log10(p) - Math.log10(minP)) / (Math.log10(maxP) - Math.log10(minP)) * w;
  const toY = (il: number) => 60 + h - ((il - minIl) / (maxIl - minIl)) * h;

  const pathData = ilCurve.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.p)} ${toY(p.il)}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">
          가격 변동률
        </label>
        <input
          type="range"
          min={0.2}
          max={5}
          step={0.1}
          value={priceRatio}
          onChange={(e) => setPriceRatio(+e.target.value)}
          className="flex-1 accent-red-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[75px] text-right">
          {priceRatio.toFixed(1)}×
        </span>
      </div>

      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Impermanent Loss — 가격 변동 vs HODL</text>

        {/* IL 곡선 */}
        <line x1={padLeft} y1={60} x2={padLeft} y2={60 + h} stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={60 + h} x2={padLeft + w} y2={60 + h} stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 */}
        {[0, -5, -10, -15, -20, -25, -30].map(v => {
          const y = toY(v);
          return (
            <g key={v}>
              <line x1={padLeft} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {v}%
              </text>
            </g>
          );
        })}

        {/* X축 (log) */}
        {[0.1, 0.5, 1, 2, 5, 10].map(p => {
          const x = toX(p);
          return (
            <g key={p}>
              <line x1={x} y1={60 + h} x2={x} y2={60 + h + 4} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={60 + h + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {p}×
              </text>
            </g>
          );
        })}

        {/* 1x 수직선 */}
        <line x1={toX(1)} y1={60} x2={toX(1)} y2={60 + h}
          stroke="#6b7280" strokeWidth={0.5} strokeDasharray="2 2" opacity={0.5} />

        {/* IL 곡선 */}
        <path d={pathData} stroke="#ef4444" strokeWidth={2.5} fill="none" />

        {/* 현재 값 포인터 */}
        <circle cx={toX(priceRatio)} cy={toY(ilPercent)} r={6} fill="#ef4444" stroke="var(--card)" strokeWidth={2} />
        <line x1={toX(priceRatio)} y1={toY(ilPercent)} x2={toX(priceRatio)} y2={60 + h}
          stroke="#ef4444" strokeWidth={0.8} strokeDasharray="2 2" />

        {/* 현재값 결과 */}
        <rect x={20} y={232} width={155} height={72} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.6} />
        <text x={97} y={252} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">HODL 가치</text>
        <text x={97} y={278} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          ${Math.round(hodlValueDollar).toLocaleString()}
        </text>
        <text x={97} y={296} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          단순 보유 시
        </text>

        <rect x={185} y={232} width={155} height={72} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={262} y={252} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">LP 가치</text>
        <text x={262} y={278} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          ${Math.round(lpTotalValue).toLocaleString()}
        </text>
        <text x={262} y={296} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          유동성 공급 시
        </text>

        <rect x={350} y={232} width={150} height={72} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
        <text x={425} y={252} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">IL</text>
        <text x={425} y={278} textAnchor="middle" fontSize={18} fontWeight={700} fill="#ef4444">
          {ilPercent.toFixed(2)}%
        </text>
        <text x={425} y={296} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ${Math.round(ilDollar).toLocaleString()} 손실
        </text>
      </svg>
    </div>
  );
}
