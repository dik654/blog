import { useState } from 'react';

type Year = 2020 | 2021 | 2022 | 2023 | 2024;

const composition: Record<Year, { eth: number; usdc: number; rwa: number; other: number; event: string }> = {
  2020: { eth: 90, usdc: 0, rwa: 0, other: 10, event: 'PSM 이전 · ETH 담보만' },
  2021: { eth: 40, usdc: 50, rwa: 0, other: 10, event: 'PSM 대규모 사용 · USDC 절반' },
  2022: { eth: 30, usdc: 60, rwa: 0, other: 10, event: 'FTX 붕괴 · "USDC 래퍼" 비판' },
  2023: { eth: 35, usdc: 40, rwa: 15, other: 10, event: 'SVB 사태 · USDC 디페그 · RWA 도입' },
  2024: { eth: 30, usdc: 30, rwa: 25, other: 15, event: 'Endgame 시작 · RWA 확대 · 다각화' },
};

const colors = {
  eth: '#3b82f6',
  usdc: '#06b6d4',
  rwa: '#f59e0b',
  other: '#6b7280',
};

export default function CollateralMixViz() {
  const [year, setYear] = useState<Year>(2024);
  const d = composition[year];
  const years: Year[] = [2020, 2021, 2022, 2023, 2024];

  // 누적 막대 위치
  let offset = 0;
  const segments = [
    { key: 'eth', name: 'ETH / stETH', value: d.eth, color: colors.eth, desc: '탈중앙 담보' },
    { key: 'usdc', name: 'USDC', value: d.usdc, color: colors.usdc, desc: '중앙화 자산' },
    { key: 'rwa', name: 'RWA', value: d.rwa, color: colors.rwa, desc: '국채·민간대출' },
    { key: 'other', name: '기타', value: d.other, color: colors.other, desc: 'BAT·WBTC 등' },
  ].map(s => {
    const start = offset;
    offset += s.value;
    return { ...s, start, end: offset };
  });

  const decentralizedPct = d.eth + d.other;
  const centralizedPct = d.usdc + d.rwa;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 연도 선택 */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-xs font-semibold text-muted-foreground min-w-[60px]">연도</label>
        <div className="flex gap-1 flex-1">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                year === y
                  ? 'bg-blue-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">DAI 담보 구성 — 시간에 따른 변화</text>

        {/* 이벤트 */}
        <rect x={20} y={38} width={480} height={32} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={35} y={58} fontSize={11} fontWeight={700} fill="#3b82f6">{year}년</text>
        <text x={85} y={58} fontSize={11} fill="var(--foreground)">{d.event}</text>

        {/* 누적 막대 */}
        <g transform="translate(20, 90)">
          {segments.map(s => {
            if (s.value === 0) return null;
            const x = (s.start / 100) * 480;
            const w = (s.value / 100) * 480;
            return (
              <g key={s.key}>
                <rect x={x} y={0} width={w} height={60} fill={s.color} fillOpacity={0.9} />
                {s.value >= 8 && (
                  <>
                    <text x={x + w / 2} y={28} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">
                      {s.value}%
                    </text>
                    <text x={x + w / 2} y={45} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#fff">
                      {s.name}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          <rect x={0} y={0} width={480} height={60} rx={4} fill="transparent" stroke="var(--border)" strokeWidth={1} />
        </g>

        {/* 범례 + 비율 */}
        <text x={260} y={176} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">담보 상세</text>

        {segments.map((s, i) => {
          const x = 20 + i * 120;
          return (
            <g key={s.key}>
              <rect x={x} y={188} width={116} height={68} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
              <rect x={x} y={188} width={6} height={68} fill={s.color} rx={3} />
              <text x={x + 14} y={208} fontSize={11} fontWeight={700} fill={s.color}>{s.name}</text>
              <text x={x + 14} y={224} fontSize={14} fontWeight={700} fill="var(--foreground)">{s.value}%</text>
              <text x={x + 14} y={240} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>
            </g>
          );
        })}

        {/* 중앙화 vs 탈중앙 */}
        <rect x={20} y={272} width={234} height={42} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={32} y={290} fontSize={10} fontWeight={700} fill="#10b981">탈중앙 담보 (ETH + 기타)</text>
        <text x={244} y={290} textAnchor="end" fontSize={14} fontWeight={700} fill="#10b981">{decentralizedPct}%</text>
        <text x={32} y={305} fontSize={9} fill="var(--muted-foreground)">암호자산 기반</text>

        <rect x={266} y={272} width={234} height={42} rx={6}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
        <text x={278} y={290} fontSize={10} fontWeight={700} fill="#ef4444">중앙화 자산 (USDC + RWA)</text>
        <text x={490} y={290} textAnchor="end" fontSize={14} fontWeight={700} fill="#ef4444">{centralizedPct}%</text>
        <text x={278} y={305} fontSize={9} fill="var(--muted-foreground)">제3자 의존</text>

        <text x={260} y={336} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">2021년 이후 USDC 의존 급증 → SVB 사태 후 RWA 다각화 시작</text>
        <text x={260} y={352} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">Endgame 목표: USDC 0% · ETH+RWA+암호자산 담보만</text>
      </svg>
    </div>
  );
}
