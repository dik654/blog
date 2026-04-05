import { useState } from 'react';

export default function TokenAmountViz() {
  const pLower = 2500;
  const pUpper = 3500;
  const L = 1000;

  const [currentPrice, setCurrentPrice] = useState(3000);

  // sqrt prices
  const sqrtPA = Math.sqrt(pLower);
  const sqrtPB = Math.sqrt(pUpper);
  const sqrtP = Math.sqrt(currentPrice);

  let x = 0, y = 0, caseNum = 0;

  if (currentPrice < pLower) {
    // Case 1: P < P_a
    x = L * (1 / sqrtPA - 1 / sqrtPB);
    y = 0;
    caseNum = 1;
  } else if (currentPrice <= pUpper) {
    // Case 2: P_a ≤ P ≤ P_b
    x = L * (1 / sqrtP - 1 / sqrtPB);
    y = L * (sqrtP - sqrtPA);
    caseNum = 2;
  } else {
    // Case 3: P > P_b
    x = 0;
    y = L * (sqrtPB - sqrtPA);
    caseNum = 3;
  }

  const totalValue = x * currentPrice + y;
  const xValueUsd = x * currentPrice;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">
          현재 가격
        </label>
        <input
          type="range"
          min={1500}
          max={4500}
          step={50}
          value={currentPrice}
          onChange={(e) => setCurrentPrice(+e.target.value)}
          className="flex-1 accent-purple-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[70px] text-right">
          ${currentPrice.toLocaleString()}
        </span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">L · 구간 · 가격 → 토큰 양 3가지 케이스</text>

        {/* 구간 시각화 */}
        <line x1={40} y1={90} x2={480} y2={90} stroke="var(--foreground)" strokeWidth={1} />
        {/* LP range rect */}
        {(() => {
          const xL = 40 + ((pLower - 1500) / 3000) * 440;
          const xU = 40 + ((pUpper - 1500) / 3000) * 440;
          const xC = 40 + ((currentPrice - 1500) / 3000) * 440;
          return (
            <g>
              <rect x={xL} y={64} width={xU - xL} height={26} fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeWidth={1} />
              <text x={xL} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
                P_a ${pLower}
              </text>
              <text x={xU} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
                P_b ${pUpper}
              </text>
              <line x1={xC} y1={52} x2={xC} y2={96} stroke="#f59e0b" strokeWidth={2} />
              <circle cx={xC} cy={90} r={5} fill="#f59e0b" stroke="var(--card)" strokeWidth={1.5} />
              <text x={xC} y={114} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
                ${currentPrice}
              </text>
            </g>
          );
        })()}

        {/* Case 표시 */}
        <rect x={20} y={132} width={480} height={38} rx={8}
          fill={caseNum === 1 ? '#3b82f6' : caseNum === 2 ? '#10b981' : '#f59e0b'}
          fillOpacity={0.12}
          stroke={caseNum === 1 ? '#3b82f6' : caseNum === 2 ? '#10b981' : '#f59e0b'}
          strokeWidth={1} />
        <text x={260} y={157} textAnchor="middle" fontSize={13} fontWeight={700}
          fill={caseNum === 1 ? '#3b82f6' : caseNum === 2 ? '#10b981' : '#f59e0b'}>
          {caseNum === 1 && 'Case 1: P < P_a → 100% token0 (USDC)'}
          {caseNum === 2 && 'Case 2: P_a ≤ P ≤ P_b → 양쪽 토큰'}
          {caseNum === 3 && 'Case 3: P > P_b → 100% token1 (ETH)'}
        </text>

        {/* 공식 표시 */}
        <rect x={20} y={182} width={235} height={96} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={137} y={202} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          token0 (x · USDC)
        </text>
        <text x={137} y={228} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">
          {x.toFixed(2)}
        </text>
        <text x={137} y={250} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          {caseNum === 1 && 'L × (1/√P_a − 1/√P_b)'}
          {caseNum === 2 && 'L × (1/√P − 1/√P_b)'}
          {caseNum === 3 && '0 (구간 위)'}
        </text>
        <text x={137} y={268} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          ≈ ${xValueUsd.toFixed(0)}
        </text>

        <rect x={265} y={182} width={235} height={96} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={382} y={202} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          token1 (y · ETH)
        </text>
        <text x={382} y={228} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">
          {y.toFixed(3)}
        </text>
        <text x={382} y={250} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          {caseNum === 1 && '0 (구간 아래)'}
          {caseNum === 2 && 'L × (√P − √P_a)'}
          {caseNum === 3 && 'L × (√P_b − √P_a)'}
        </text>
        <text x={382} y={268} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          ≈ ${y.toFixed(0)}
        </text>

        {/* 총 가치 */}
        <rect x={20} y={288} width={480} height={40} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={36} y={312} fontSize={11} fontWeight={700} fill="var(--foreground)">포지션 총 가치 (L=1000)</text>
        <text x={484} y={312} textAnchor="end" fontSize={16} fontWeight={700} fill="var(--foreground)">
          ${Math.round(totalValue).toLocaleString()}
        </text>
      </svg>
    </div>
  );
}
