import { useState } from 'react';

export default function CollateralRatioViz() {
  // 고정값
  const ink = 10;           // 10 ETH 담보
  const art = 15000;        // 15,000 DAI 정규화 부채
  const rate = 1.05;        // 5% 이자 누적
  const liquidationRatio = 150;

  // 인터랙티브: ETH 시장가
  const [ethPrice, setEthPrice] = useState(3000);

  const spot = ethPrice / (liquidationRatio / 100);      // spot = market / LR
  const collateralValue = ink * spot;                    // ink × spot
  const debt = art * rate;                               // art × rate
  const ratio = (collateralValue / debt) * 100;          // 담보비율 %
  const isSafe = ratio >= liquidationRatio;

  const barMin = 80;
  const barMax = 280;
  const indicatorX = 20 + Math.max(0, Math.min(1, (ratio - barMin) / (barMax - barMin))) * 480;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">
          ETH 시장가
        </label>
        <input
          type="range"
          min={1500}
          max={5000}
          step={50}
          value={ethPrice}
          onChange={(e) => setEthPrice(+e.target.value)}
          className="flex-1 accent-blue-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[75px] text-right">
          ${ethPrice.toLocaleString()}
        </span>
      </div>

      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">담보비율 — 슬라이더로 ETH 가격 조정</text>

        {/* 상단: 계산 공식 */}
        <rect x={20} y={38} width={480} height={78} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={58} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Vat safe 조건 (frob 내부 require)</text>
        <text x={260} y={82} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="#3b82f6">urn.art × ilk.rate  ≤  urn.ink × ilk.spot</text>
        <text x={260} y={102} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">부채 총액 (정규화 × rate) ≤ 담보 가치 (수량 × spot)</text>

        {/* 담보 측 */}
        <rect x={20} y={128} width={235} height={120} rx={8}
          fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={137} y={148} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#3b82f6">담보 측 (ETH-A, LR=150%)</text>

        <text x={32} y={172} fontSize={10} fill="var(--muted-foreground)">urn.ink</text>
        <text x={242} y={172} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">{ink} ETH</text>
        <line x1={32} y1={178} x2={242} y2={178} stroke="var(--border)" strokeWidth={0.4} opacity={0.5} />

        <text x={32} y={194} fontSize={10} fill="var(--muted-foreground)">ETH 시장가 (슬라이더)</text>
        <text x={242} y={194} textAnchor="end" fontSize={10} fontWeight={700} fill="#3b82f6">${ethPrice.toLocaleString()}</text>
        <line x1={32} y1={200} x2={242} y2={200} stroke="var(--border)" strokeWidth={0.4} opacity={0.5} />

        <text x={32} y={216} fontSize={10} fill="var(--muted-foreground)">spot = market / 1.5</text>
        <text x={242} y={216} textAnchor="end" fontSize={10} fontWeight={600} fill="#f59e0b">${Math.round(spot).toLocaleString()}</text>
        <line x1={32} y1={222} x2={242} y2={222} stroke="var(--border)" strokeWidth={0.4} opacity={0.5} />

        <text x={32} y={238} fontSize={10} fill="var(--muted-foreground)">ink × spot</text>
        <text x={242} y={238} textAnchor="end" fontSize={11} fontWeight={700} fill={isSafe ? "#10b981" : "#ef4444"}>
          ${Math.round(collateralValue).toLocaleString()}
        </text>

        {/* 부채 측 */}
        <rect x={265} y={128} width={235} height={120} rx={8}
          fill="#f59e0b" fillOpacity={0.05} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={382} y={148} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#f59e0b">부채 측 (고정)</text>

        <text x={277} y={172} fontSize={10} fill="var(--muted-foreground)">urn.art</text>
        <text x={487} y={172} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">{art.toLocaleString()}</text>
        <line x1={277} y1={178} x2={487} y2={178} stroke="var(--border)" strokeWidth={0.4} opacity={0.5} />

        <text x={277} y={194} fontSize={10} fill="var(--muted-foreground)">ilk.rate</text>
        <text x={487} y={194} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">{rate}</text>
        <line x1={277} y1={200} x2={487} y2={200} stroke="var(--border)" strokeWidth={0.4} opacity={0.5} />

        <text x={277} y={216} fontSize={10} fill="var(--muted-foreground)">art × rate</text>
        <text x={487} y={216} textAnchor="end" fontSize={10} fontWeight={700} fill="#ef4444">${debt.toLocaleString()}</text>
        <line x1={277} y1={222} x2={487} y2={222} stroke="var(--border)" strokeWidth={0.4} opacity={0.5} />

        <text x={277} y={238} fontSize={10} fill="var(--muted-foreground)">담보비율</text>
        <text x={487} y={238} textAnchor="end" fontSize={12} fontWeight={700} fill={isSafe ? "#10b981" : "#ef4444"}>
          {ratio.toFixed(1)}%
        </text>

        {/* 결론 — 동적 */}
        <rect x={20} y={262} width={480} height={32} rx={6}
          fill={isSafe ? "#10b981" : "#ef4444"} fillOpacity={0.12} stroke={isSafe ? "#10b981" : "#ef4444"} strokeWidth={0.8} />
        <text x={260} y={282} textAnchor="middle" fontSize={12} fontWeight={700} fill={isSafe ? "#10b981" : "#ef4444"}>
          {isSafe
            ? `${ratio.toFixed(1)}% ≥ 150% → SAFE (정상)`
            : `${ratio.toFixed(1)}% ＜ 150% → 청산 대상 (not-safe)`}
        </text>

        {/* 담보비율 스펙트럼 바 */}
        <text x={260} y={314} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">담보비율 구간 — 현재 위치 표시</text>

        <defs>
          <linearGradient id="ratio-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
            <stop offset="35%" stopColor="#f59e0b" stopOpacity={0.35} />
            <stop offset="40%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.35} />
          </linearGradient>
        </defs>
        <rect x={20} y={324} width={480} height={22} rx={4}
          fill="url(#ratio-grad)" stroke="var(--border)" strokeWidth={0.5} />

        {/* 청산선 표시 (150%) */}
        <line x1={20 + ((liquidationRatio - barMin) / (barMax - barMin)) * 480} y1={320}
          x2={20 + ((liquidationRatio - barMin) / (barMax - barMin)) * 480} y2={350}
          stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={20 + ((liquidationRatio - barMin) / (barMax - barMin)) * 480} y={360} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">150%</text>

        {/* 현재 위치 인디케이터 */}
        <g>
          <line x1={indicatorX} y1={316} x2={indicatorX} y2={354}
            stroke={isSafe ? "#10b981" : "#ef4444"} strokeWidth={2} />
          <circle cx={indicatorX} cy={335} r={6} fill={isSafe ? "#10b981" : "#ef4444"} stroke="var(--card)" strokeWidth={2} />
          <text x={indicatorX} y={374} textAnchor="middle" fontSize={10} fontWeight={700} fill={isSafe ? "#10b981" : "#ef4444"}>
            {ratio.toFixed(0)}%
          </text>
        </g>

        {/* 눈금 */}
        <text x={20} y={360} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">80%</text>
        <text x={500} y={360} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">280%</text>
      </svg>
    </div>
  );
}
