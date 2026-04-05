import { useState } from 'react';

export default function LinearVsCompoundViz() {
  const [rate, setRate] = useState(10); // 10% APY
  const years = 5;
  const steps = 60;

  // Linear: index = 1 + rate * dt
  const linearPoints: { t: number; v: number }[] = [];
  // Compound: index = (1 + rate)^dt (simplified per-year compound)
  const compoundPoints: { t: number; v: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * years;
    const linear = 1 + (rate / 100) * t;
    const compound = Math.pow(1 + rate / 100, t);
    linearPoints.push({ t, v: linear });
    compoundPoints.push({ t, v: compound });
  }

  const finalLinear = linearPoints[steps].v;
  const finalCompound = compoundPoints[steps].v;
  const gap = ((finalCompound - finalLinear) / finalLinear) * 100;

  const w = 440;
  const h = 160;
  const padLeft = 60;
  const maxV = rate >= 15 ? 2.5 : rate >= 8 ? 1.8 : 1.3;

  const toX = (t: number) => padLeft + (t / years) * w;
  const toY = (v: number) => 70 + h - ((v - 1.0) / (maxV - 1.0)) * h;

  const linearPath = linearPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.v)}`).join(' ');
  const compoundPath = compoundPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.v)}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">이자율 (APY)</label>
        <input type="range" min={1} max={25} step={1} value={rate}
          onChange={(e) => setRate(+e.target.value)} className="flex-1 accent-red-500" />
        <span className="text-sm font-bold text-foreground min-w-[50px] text-right">{rate}%</span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Linear (예치) vs Compound (차입) 이자 누적</text>

        {/* 범례 */}
        <rect x={30} y={40} width={14} height={14} rx={2} fill="#10b981" fillOpacity={0.4} />
        <text x={50} y={52} fontSize={10} fontWeight={600} fill="#10b981">Linear (aToken)</text>
        <rect x={180} y={40} width={14} height={14} rx={2} fill="#f59e0b" fillOpacity={0.4} />
        <text x={200} y={52} fontSize={10} fontWeight={600} fill="#f59e0b">Compound (debtToken)</text>

        {/* 축 */}
        <line x1={padLeft} y1={70 + h} x2={padLeft + w} y2={70 + h} stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={70} x2={padLeft} y2={70 + h} stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 */}
        {[1.0, 1.25, 1.5, 1.75, 2.0, 2.25].filter(v => v <= maxV).map(v => {
          const y = toY(v);
          return (
            <g key={v}>
              <line x1={padLeft} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {v.toFixed(2)}×
              </text>
            </g>
          );
        })}

        {/* X축 */}
        {[0, 1, 2, 3, 4, 5].map(t => {
          const x = toX(t);
          return (
            <g key={t}>
              <line x1={x} y1={70 + h} x2={x} y2={70 + h + 4} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={70 + h + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {t}년
              </text>
            </g>
          );
        })}

        {/* Linear 경로 */}
        <path d={linearPath} stroke="#10b981" strokeWidth={2.5} fill="none" />

        {/* Compound 경로 */}
        <path d={compoundPath} stroke="#f59e0b" strokeWidth={2.5} fill="none" />

        {/* 끝점 마커 */}
        <circle cx={toX(years)} cy={toY(finalLinear)} r={5} fill="#10b981" stroke="var(--card)" strokeWidth={1.5} />
        <circle cx={toX(years)} cy={toY(finalCompound)} r={5} fill="#f59e0b" stroke="var(--card)" strokeWidth={1.5} />

        {/* 결과 박스 */}
        <rect x={20} y={258} width={155} height={72} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={97} y={278} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Linear (5년 후)
        </text>
        <text x={97} y={304} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">
          {finalLinear.toFixed(3)}×
        </text>
        <text x={97} y={322} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          단순 누적
        </text>

        <rect x={185} y={258} width={150} height={72} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={260} y={278} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          Compound (5년 후)
        </text>
        <text x={260} y={304} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">
          {finalCompound.toFixed(3)}×
        </text>
        <text x={260} y={322} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          복리 (Taylor 3차 근사)
        </text>

        <rect x={345} y={258} width={155} height={72} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
        <text x={422} y={278} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          Spread (프로토콜 수익)
        </text>
        <text x={422} y={304} textAnchor="middle" fontSize={20} fontWeight={700} fill="#ef4444">
          +{gap.toFixed(2)}%
        </text>
        <text x={422} y={322} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          차입-예치 차이
        </text>
      </svg>
    </div>
  );
}
