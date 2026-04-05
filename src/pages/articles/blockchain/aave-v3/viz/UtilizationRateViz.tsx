import { useState } from 'react';

export default function UtilizationRateViz() {
  const [utilization, setUtilization] = useState(75);
  const baseRate = 0;
  const slope1 = 4;
  const slope2 = 60;
  const uOptimal = 90;
  const reserveFactor = 10;

  const u = utilization / 100;
  const uOpt = uOptimal / 100;

  let borrowRate: number;
  if (u <= uOpt) {
    borrowRate = baseRate + slope1 * (u / uOpt);
  } else {
    borrowRate = baseRate + slope1 + slope2 * ((u - uOpt) / (1 - uOpt));
  }

  const supplyRate = borrowRate * u * (1 - reserveFactor / 100);

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">Utilization</label>
        <input type="range" min={0} max={100} step={1} value={utilization}
          onChange={(e) => setUtilization(+e.target.value)} className="flex-1 accent-blue-500" />
        <span className="text-sm font-bold text-foreground min-w-[50px] text-right">{utilization}%</span>
      </div>

      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">이자율 2단계 곡선 — USDC (U_opt=90%)</text>

        {/* 축 */}
        <line x1={60} y1={220} x2={480} y2={220} stroke="var(--foreground)" strokeWidth={1} />
        <line x1={60} y1={60} x2={60} y2={220} stroke="var(--foreground)" strokeWidth={1} />

        {/* Y축 눈금 */}
        {[0, 20, 40, 60].map(r => {
          const y = 220 - (r / 64) * 160;
          return (
            <g key={r}>
              <line x1={56} y1={y} x2={480} y2={y} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={52} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{r}%</text>
            </g>
          );
        })}

        {/* X축 눈금 */}
        {[0, 25, 50, 75, 90, 100].map(u => {
          const x = 60 + (u / 100) * 420;
          return (
            <g key={u}>
              <line x1={x} y1={220} x2={x} y2={224} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={236} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{u}%</text>
            </g>
          );
        })}

        {/* U_optimal 수직선 */}
        <line x1={60 + 0.9 * 420} y1={60} x2={60 + 0.9 * 420} y2={220}
          stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={60 + 0.9 * 420 + 4} y={74} fontSize={9} fontWeight={700} fill="#f59e0b">U_opt</text>

        {/* 2-slope 곡선 */}
        {(() => {
          const points: [number, number][] = [];
          for (let ui = 0; ui <= 100; ui += 1) {
            const ur = ui / 100;
            let rate;
            if (ur <= uOpt) rate = baseRate + slope1 * (ur / uOpt);
            else rate = baseRate + slope1 + slope2 * ((ur - uOpt) / (1 - uOpt));
            points.push([60 + ui / 100 * 420, 220 - (rate / 64) * 160]);
          }
          const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
          return <path d={path} stroke="#ef4444" strokeWidth={2.5} fill="none" />;
        })()}

        {/* 현재 위치 */}
        <circle cx={60 + u * 420} cy={220 - (borrowRate / 64) * 160} r={7}
          fill="#ef4444" stroke="var(--card)" strokeWidth={2} />

        {/* 결과 */}
        <rect x={20} y={254} width={235} height={56} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.8} />
        <text x={137} y={274} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          차입자 이자율
        </text>
        <text x={137} y={298} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--foreground)">
          {borrowRate.toFixed(2)}%
        </text>

        <rect x={265} y={254} width={235} height={56} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={382} y={274} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          예치자 이자율
        </text>
        <text x={382} y={298} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--foreground)">
          {supplyRate.toFixed(2)}%
        </text>
      </svg>
    </div>
  );
}
