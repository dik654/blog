import { useState } from 'react';

export default function DynamicFeeViz() {
  const [volatility, setVolatility] = useState(3);

  // Fee tiers based on volatility
  let fee: number;
  let tier: string;
  let color: string;
  if (volatility > 5) {
    fee = 10000; // 1%
    tier = 'HIGH';
    color = '#ef4444';
  } else if (volatility > 2) {
    fee = 3000; // 0.3%
    tier = 'MID';
    color = '#f59e0b';
  } else {
    fee = 500; // 0.05%
    tier = 'LOW';
    color = '#10b981';
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">변동성</label>
        <input type="range" min={0} max={10} step={0.5} value={volatility}
          onChange={(e) => setVolatility(+e.target.value)} className="flex-1 accent-purple-500" />
        <span className="text-sm font-bold text-foreground min-w-[50px] text-right">{volatility}%</span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Dynamic Fee Hook — 변동성 기반 수수료</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={46} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          beforeSwap hook에서 수수료 동적 조정
        </text>
        <text x={260} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          변동성 측정 → updateDynamicLPFee(key, newFee) 호출
        </text>

        {/* 3단계 tier */}
        <text x={260} y={112} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">변동성 구간별 수수료</text>

        {[
          {
            x: 20, vrange: '< 2%', label: 'LOW', fee: '0.05% (500)',
            sel: tier === 'LOW', color: '#10b981',
          },
          {
            x: 180, vrange: '2-5%', label: 'MID', fee: '0.3% (3000)',
            sel: tier === 'MID', color: '#f59e0b',
          },
          {
            x: 340, vrange: '> 5%', label: 'HIGH', fee: '1.0% (10000)',
            sel: tier === 'HIGH', color: '#ef4444',
          },
        ].map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={126} width={160} height={86} rx={8}
              fill={t.color} fillOpacity={t.sel ? 0.18 : 0.06}
              stroke={t.color} strokeWidth={t.sel ? 2 : 0.6} />
            <text x={t.x + 80} y={148} textAnchor="middle" fontSize={10} fontWeight={700}
              fill="var(--muted-foreground)">volatility {t.vrange}</text>
            <text x={t.x + 80} y={170} textAnchor="middle" fontSize={16} fontWeight={700} fill={t.color}>
              {t.label}
            </text>
            <text x={t.x + 80} y={192} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
              {t.fee}
            </text>
            {t.sel && (
              <text x={t.x + 80} y={206} textAnchor="middle" fontSize={9} fontWeight={700} fill={t.color}>
                ← 현재
              </text>
            )}
          </g>
        ))}

        {/* 현재 적용 수수료 */}
        <rect x={20} y={230} width={480} height={60} rx={8}
          fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.2} />
        <text x={260} y={252} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
          현재 적용 수수료
        </text>
        <text x={260} y={278} textAnchor="middle" fontSize={24} fontWeight={700} fill="var(--foreground)">
          {(fee / 10000).toFixed(2)}% ({fee})
        </text>

        {/* 장점 */}
        <rect x={20} y={302} width={480} height={30} rx={6}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.6} />
        <text x={260} y={320} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          V3 고정 4 tier → V4 무제한 유연성 (LP 수익 최적화)
        </text>
      </svg>
    </div>
  );
}
