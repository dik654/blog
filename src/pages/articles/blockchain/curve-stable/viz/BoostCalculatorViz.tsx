import { useState } from 'react';

export default function BoostCalculatorViz() {
  const [vecrv, setVecrv] = useState(100); // veCRV
  const [lp, setLp] = useState(100); // LP staked

  const totalVecrv = 10000;
  const totalLp = 100000;

  const vecrvShare = vecrv / totalVecrv;
  const lpShare = lp / totalLp;

  // boost = min(2.5x, 1 + 1.5 × vecrvShare / lpShare)
  const rawBoost = 1 + 1.5 * (vecrvShare / lpShare);
  const boost = Math.min(2.5, rawBoost);

  const baseReward = 100; // CRV/day
  const boostedReward = baseReward * boost;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">veCRV 보유</label>
        <input type="range" min={0} max={2000} step={10} value={vecrv}
          onChange={(e) => setVecrv(+e.target.value)} className="flex-1 accent-purple-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{vecrv}</span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">LP 스테이킹</label>
        <input type="range" min={10} max={2000} step={10} value={lp}
          onChange={(e) => setLp(+e.target.value)} className="flex-1 accent-green-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{lp}</span>
      </div>

      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Boost 계산기 — veCRV × LP 비율</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={54} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          boost = min(2.5×, 1 + 1.5 × (veCRV%) / (LP%))
        </text>
        <text x={260} y={84} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          전체 veCRV: {totalVecrv.toLocaleString()} · 전체 LP: {totalLp.toLocaleString()}
        </text>

        {/* 비율 */}
        <rect x={20} y={112} width={235} height={56} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.6} />
        <text x={32} y={130} fontSize={10} fontWeight={700} fill="#8b5cf6">veCRV 지분</text>
        <text x={242} y={130} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">
          {(vecrvShare * 100).toFixed(3)}%
        </text>
        <line x1={32} y1={136} x2={242} y2={136} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={32} y={154} fontSize={10} fontWeight={700} fill="#10b981">LP 지분</text>
        <text x={242} y={154} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">
          {(lpShare * 100).toFixed(3)}%
        </text>

        {/* boost 결과 */}
        <rect x={265} y={112} width={235} height={56} rx={8}
          fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={1} />
        <text x={382} y={134} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          Boost
        </text>
        <text x={382} y={160} textAnchor="middle" fontSize={22} fontWeight={700}
          fill={boost >= 2.5 ? '#10b981' : '#f59e0b'}>
          {boost.toFixed(2)}×{boost >= 2.5 ? ' (MAX)' : ''}
        </text>

        {/* 보상 비교 */}
        <text x={260} y={198} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">일일 CRV 보상 비교 (같은 LP)</text>

        <rect x={20} y={210} width={235} height={70} rx={8}
          fill="#6b7280" fillOpacity={0.08} stroke="#6b7280" strokeWidth={0.6} />
        <text x={137} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6b7280">
          Base (veCRV 없음)
        </text>
        <text x={137} y={258} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">
          {baseReward} CRV
        </text>
        <text x={137} y={274} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          1.0× (기본)
        </text>

        <rect x={265} y={210} width={235} height={70} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={382} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Boosted (현재 설정)
        </text>
        <text x={382} y={258} textAnchor="middle" fontSize={20} fontWeight={700} fill="#10b981">
          {boostedReward.toFixed(1)} CRV
        </text>
        <text x={382} y={274} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          +{((boost - 1) * 100).toFixed(0)}% 추가 보상
        </text>

        <text x={260} y={304} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Bob: 1% veCRV + 1% LP = 2.5× MAX · Alice: 0.1% veCRV + 1% LP = 1.15×
        </text>
      </svg>
    </div>
  );
}
