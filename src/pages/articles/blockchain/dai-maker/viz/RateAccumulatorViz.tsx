import { useState } from 'react';

export default function RateAccumulatorViz() {
  const [sf, setSf] = useState(5); // Stability Fee %
  const initialDebt = 15000;

  const years = 3;
  const steps = 36; // monthly
  const dataPoints: { t: number; rate: number; debt: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const dt = (i / steps) * years;
    const rate = Math.pow(1 + sf / 100, dt);
    const debt = initialDebt * rate;
    dataPoints.push({ t: dt, rate, debt });
  }

  const w = 460;
  const h = 160;
  const padLeft = 58;
  const padBottom = 34;
  const maxDebt = 20000;
  const minDebt = 15000;

  const toX = (t: number) => padLeft + (t / years) * w;
  const toY = (d: number) => 60 + h - ((d - minDebt) / (maxDebt - minDebt)) * h;

  const pathData = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.debt)}`).join(' ');

  const final = dataPoints[dataPoints.length - 1];
  const debtDelta = final.debt - initialDebt;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* SF 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">
          Stability Fee
        </label>
        <input
          type="range"
          min={0}
          max={15}
          step={0.5}
          value={sf}
          onChange={(e) => setSf(+e.target.value)}
          className="flex-1 accent-amber-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{sf}%/년</span>
      </div>

      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">rate accumulator — SF 누적 (3년)</text>

        {/* 공식 */}
        <text x={260} y={44} textAnchor="middle" fontSize={11} fontWeight={600}
          fill="var(--muted-foreground)">
          rate[t] = (1 + SF)^t · debt[t] = art × rate[t]
        </text>

        {/* 차트 */}
        {/* 축 */}
        <line x1={padLeft} y1={60 + h} x2={padLeft + w} y2={60 + h}
          stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={60} x2={padLeft} y2={60 + h}
          stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 눈금 */}
        {[15000, 16000, 17000, 18000, 19000, 20000].map(v => {
          const y = toY(v);
          return (
            <g key={v}>
              <line x1={padLeft - 3} y1={y} x2={padLeft} y2={y} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {(v / 1000).toFixed(0)}K
              </text>
              <line x1={padLeft} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
            </g>
          );
        })}

        {/* X축 눈금 */}
        {[0, 1, 2, 3].map(t => {
          const x = toX(t);
          return (
            <g key={t}>
              <line x1={x} y1={60 + h} x2={x} y2={60 + h + 3} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={60 + h + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {t}년
              </text>
            </g>
          );
        })}

        {/* 기준선 (초기 부채) */}
        <line x1={padLeft} y1={toY(initialDebt)} x2={padLeft + w} y2={toY(initialDebt)}
          stroke="#6b7280" strokeWidth={0.6} strokeDasharray="3 2" opacity={0.5} />
        <text x={padLeft + w - 4} y={toY(initialDebt) - 4} textAnchor="end" fontSize={8.5} fill="#6b7280">
          초기 15K
        </text>

        {/* 누적 곡선 */}
        <path d={pathData} stroke="#f59e0b" strokeWidth={2.5} fill="none" />

        {/* 끝점 마커 */}
        <circle cx={toX(final.t)} cy={toY(final.debt)} r={5} fill="#f59e0b" stroke="var(--card)" strokeWidth={1.5} />

        {/* 정보 박스 */}
        <g transform="translate(26, 242)">
          <rect x={0} y={0} width={156} height={48} rx={6}
            fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.6} />
          <text x={12} y={18} fontSize={10} fontWeight={700} fill="#3b82f6">초기</text>
          <text x={146} y={18} textAnchor="end" fontSize={10} fontWeight={700} fill="#3b82f6">
            ${initialDebt.toLocaleString()}
          </text>
          <text x={12} y={36} fontSize={9} fill="var(--muted-foreground)">urn.art × rate(0)</text>
        </g>

        <g transform="translate(186, 242)">
          <rect x={0} y={0} width={156} height={48} rx={6}
            fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.6} />
          <text x={12} y={18} fontSize={10} fontWeight={700} fill="#f59e0b">3년 후 부채</text>
          <text x={146} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill="#f59e0b">
            ${Math.round(final.debt).toLocaleString()}
          </text>
          <text x={12} y={36} fontSize={9} fill="var(--muted-foreground)">rate = {final.rate.toFixed(3)}×</text>
        </g>

        <g transform="translate(346, 242)">
          <rect x={0} y={0} width={148} height={48} rx={6}
            fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.6} />
          <text x={12} y={18} fontSize={10} fontWeight={700} fill="#ef4444">이자 누적</text>
          <text x={138} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill="#ef4444">
            +${Math.round(debtDelta).toLocaleString()}
          </text>
          <text x={12} y={36} fontSize={9} fill="var(--muted-foreground)">
            +{((debtDelta / initialDebt) * 100).toFixed(1)}% 증가
          </text>
        </g>
      </svg>
    </div>
  );
}
