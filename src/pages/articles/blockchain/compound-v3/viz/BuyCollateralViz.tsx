import { useState } from 'react';

export default function BuyCollateralViz() {
  const [discountBps, setDiscountBps] = useState(300); // 3% discount
  const marketPrice = 3000;
  const discount = discountBps / 10000;
  const discountedPrice = marketPrice * (1 - discount);
  const savingPerEth = marketPrice - discountedPrice;

  const baseAmount = 10000; // user provides 10,000 USDC
  const ethReceived = baseAmount / discountedPrice;
  const marketValue = ethReceived * marketPrice;
  const profit = marketValue - baseAmount;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">할인율 (bps)</label>
        <input
          type="range"
          min={0}
          max={1000}
          step={50}
          value={discountBps}
          onChange={(e) => setDiscountBps(+e.target.value)}
          className="flex-1 accent-green-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[80px] text-right">
          {(discount * 100).toFixed(1)}%
        </span>
      </div>

      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">buyCollateral() — Storefront 할인 판매</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={66} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          quoteCollateral 공식
        </text>
        <text x={260} y={82} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          discountedPrice = marketPrice × storeFrontPriceFactor
        </text>
        <text x={260} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          collateralAmount = baseAmount / discountedPrice
        </text>

        {/* 가격 비교 */}
        <rect x={20} y={124} width={235} height={72} rx={8}
          fill="#6b7280" fillOpacity={0.08} stroke="#6b7280" strokeWidth={0.8} />
        <text x={137} y={144} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6b7280">
          시장 가격
        </text>
        <text x={137} y={172} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--foreground)">
          ${marketPrice.toLocaleString()}
        </text>
        <text x={137} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          WETH / ETH (Oracle)
        </text>

        <rect x={265} y={124} width={235} height={72} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={382} y={144} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          할인 가격 (Storefront)
        </text>
        <text x={382} y={172} textAnchor="middle" fontSize={22} fontWeight={700} fill="#10b981">
          ${Math.round(discountedPrice).toLocaleString()}
        </text>
        <text x={382} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          -${savingPerEth.toFixed(0)} per WETH
        </text>

        {/* 차익거래 시나리오 */}
        <text x={260} y={220} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">차익거래 시나리오 — ${baseAmount.toLocaleString()} USDC 투입</text>

        <defs>
          <marker id="bc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          { x: 20, label: `${baseAmount.toLocaleString()} USDC`, sub: 'Protocol 입금', color: '#3b82f6' },
          { x: 180, label: `${ethReceived.toFixed(3)} WETH`, sub: '할인가 수령', color: '#10b981' },
          { x: 340, label: `$${Math.round(marketValue).toLocaleString()}`, sub: '시장 가치', color: '#f59e0b' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={236} width={140} height={52} rx={6}
              fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={0.8} />
            <text x={s.x + 70} y={258} textAnchor="middle" fontSize={13} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={s.x + 70} y={276} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {s.sub}
            </text>
            {i < 2 && (
              <line x1={s.x + 140} y1={262} x2={s.x + 160} y2={262}
                stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#bc-arr)" />
            )}
          </g>
        ))}

        {/* 이익 */}
        <rect x={20} y={304} width={480} height={66} rx={8}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1.2} />
        <text x={260} y={324} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          차익거래 수익
        </text>
        <text x={260} y={352} textAnchor="middle" fontSize={22} fontWeight={700} fill="#10b981">
          +${Math.round(profit).toLocaleString()}
        </text>
        <text x={260} y={366} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          시장 가치 − USDC 비용 = {(((profit) / baseAmount) * 100).toFixed(2)}% 수익
        </text>
      </svg>
    </div>
  );
}
