import { useState } from 'react';

export default function KeeperIncentiveViz() {
  const [tab, setTab] = useState(15000);
  const flatTip = 100;
  const chipBps = 10; // 0.1% = 10 bps (chip = 0.001)
  const chip = chipBps / 10000;

  const chipReward = tab * chip;
  const totalReward = flatTip + chipReward;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* tab 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">
          tab (부채)
        </label>
        <input
          type="range"
          min={1000}
          max={200000}
          step={1000}
          value={tab}
          onChange={(e) => setTab(+e.target.value)}
          className="flex-1 accent-purple-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[90px] text-right">
          ${tab.toLocaleString()}
        </span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Keeper 보상 공식 — flat + chip × tab</text>

        {/* 공식 */}
        <rect x={20} y={40} width={480} height={50} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="#3b82f6">reward = flatTip + chip × tab</text>
        <text x={260} y={80} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">고정 bounty + 부채 비율 (keeper 호출 유인)</text>

        {/* 파라미터 3개 박스 */}
        {[
          { x: 20, label: 'flatTip', value: `${flatTip} DAI`, desc: '고정 보상', color: '#3b82f6' },
          { x: 186, label: 'chip', value: `${chip} (${chipBps}bps)`, desc: 'tab 비율', color: '#8b5cf6' },
          { x: 352, label: 'tab', value: `${tab.toLocaleString()} DAI`, desc: '슬라이더', color: '#f59e0b' },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={108} width={148} height={66} rx={6}
              fill={p.color} fillOpacity={0.08} stroke={p.color} strokeWidth={0.8} />
            <text x={p.x + 74} y={128} textAnchor="middle" fontSize={11} fontWeight={700} fill={p.color}>
              {p.label}
            </text>
            <text x={p.x + 74} y={149} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
              {p.value}
            </text>
            <text x={p.x + 74} y={165} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{p.desc}</text>
          </g>
        ))}

        {/* 계산 과정 */}
        <text x={260} y={198} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">계산 결과</text>

        <g transform="translate(40, 210)">
          <rect x={0} y={0} width={200} height={42} rx={6}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={18} fontSize={10} fontWeight={700} fill="#3b82f6">flatTip</text>
          <text x={190} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill="#3b82f6">
            {flatTip} DAI
          </text>
          <text x={10} y={34} fontSize={9} fill="var(--muted-foreground)">고정</text>
        </g>

        <g transform="translate(260, 210)">
          <rect x={0} y={0} width={220} height={42} rx={6}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={18} fontSize={10} fontWeight={700} fill="#8b5cf6">chip × tab</text>
          <text x={210} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill="#8b5cf6">
            {chipReward.toFixed(2)} DAI
          </text>
          <text x={10} y={34} fontSize={9} fill="var(--muted-foreground)">
            {chip} × {tab.toLocaleString()}
          </text>
        </g>

        {/* 총 보상 */}
        <rect x={40} y={266} width={440} height={52} rx={8}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1.2} />
        <text x={50} y={290} fontSize={12} fontWeight={700} fill="#10b981">Keeper 총 보상</text>
        <text x={470} y={290} textAnchor="end" fontSize={16} fontWeight={700} fill="#10b981">
          {totalReward.toFixed(2)} DAI
        </text>
        <text x={50} y={308} fontSize={9.5} fill="var(--muted-foreground)">
          bark() + kick() 호출자가 획득 (청산 시작 호출자)
        </text>
      </svg>
    </div>
  );
}
