import { useState } from 'react';

export default function BorrowCapacityViz() {
  const [wethAmount, setWethAmount] = useState(5);
  const [wbtcAmount, setWbtcAmount] = useState(0.1);
  const [linkAmount, setLinkAmount] = useState(1000);

  const prices = { WETH: 3000, WBTC: 60000, LINK: 15 };
  const borrowFactors = { WETH: 0.83, WBTC: 0.70, LINK: 0.67 };

  const wethValue = wethAmount * prices.WETH;
  const wbtcValue = wbtcAmount * prices.WBTC;
  const linkValue = linkAmount * prices.LINK;

  const wethCapacity = wethValue * borrowFactors.WETH;
  const wbtcCapacity = wbtcValue * borrowFactors.WBTC;
  const linkCapacity = linkValue * borrowFactors.LINK;

  const totalCollateral = wethValue + wbtcValue + linkValue;
  const totalCapacity = wethCapacity + wbtcCapacity + linkCapacity;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[60px]">WETH</label>
        <input type="range" min={0} max={20} step={0.5} value={wethAmount}
          onChange={(e) => setWethAmount(+e.target.value)} className="flex-1 accent-blue-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{wethAmount}</span>
      </div>
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[60px]">WBTC</label>
        <input type="range" min={0} max={2} step={0.01} value={wbtcAmount}
          onChange={(e) => setWbtcAmount(+e.target.value)} className="flex-1 accent-orange-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{wbtcAmount}</span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[60px]">LINK</label>
        <input type="range" min={0} max={5000} step={100} value={linkAmount}
          onChange={(e) => setLinkAmount(+e.target.value)} className="flex-1 accent-purple-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{linkAmount}</span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">다중 담보 — USDC 차입 가능 한도</text>

        {/* 자산별 계산 */}
        {[
          { y: 44, label: 'WETH', amount: wethAmount, price: prices.WETH, value: wethValue, factor: borrowFactors.WETH, capacity: wethCapacity, color: '#3b82f6' },
          { y: 108, label: 'WBTC', amount: wbtcAmount, price: prices.WBTC, value: wbtcValue, factor: borrowFactors.WBTC, capacity: wbtcCapacity, color: '#f59e0b' },
          { y: 172, label: 'LINK', amount: linkAmount, price: prices.LINK, value: linkValue, factor: borrowFactors.LINK, capacity: linkCapacity, color: '#8b5cf6' },
        ].map((a, i) => (
          <g key={i}>
            <rect x={20} y={a.y} width={480} height={56} rx={6}
              fill={a.color} fillOpacity={0.08} stroke={a.color} strokeWidth={0.6} />
            <text x={34} y={a.y + 20} fontSize={12} fontWeight={700} fill={a.color}>{a.label}</text>
            <text x={34} y={a.y + 38} fontSize={10} fill="var(--muted-foreground)">
              {a.amount} × ${a.price.toLocaleString()} = ${a.value.toLocaleString()}
            </text>
            <text x={34} y={a.y + 50} fontSize={9} fill="var(--muted-foreground)">
              × factor {(a.factor * 100).toFixed(0)}%
            </text>
            <text x={486} y={a.y + 32} textAnchor="end" fontSize={16} fontWeight={700} fill={a.color}>
              ${Math.round(a.capacity).toLocaleString()}
            </text>
          </g>
        ))}

        {/* 총합 */}
        <rect x={20} y={238} width={480} height={92} rx={8}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1.5} />
        <text x={36} y={258} fontSize={11} fontWeight={700} fill="var(--foreground)">담보 총 가치:</text>
        <text x={486} y={258} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--foreground)">
          ${Math.round(totalCollateral).toLocaleString()}
        </text>
        <line x1={36} y1={266} x2={486} y2={266} stroke="var(--border)" strokeWidth={0.4} opacity={0.5} />
        <text x={36} y={284} fontSize={11} fontWeight={700} fill="#10b981">USDC 차입 한도:</text>
        <text x={486} y={288} textAnchor="end" fontSize={22} fontWeight={700} fill="#10b981">
          ${Math.round(totalCapacity).toLocaleString()}
        </text>
        <text x={36} y={318} fontSize={9} fill="var(--muted-foreground)">
          평균 LTV: {((totalCapacity / totalCollateral) * 100).toFixed(1)}%
        </text>
        <text x={486} y={318} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
          (자산별 borrow factor 가중평균)
        </text>
      </svg>
    </div>
  );
}
