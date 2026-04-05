import { useState } from 'react';

export default function IsLiquidatableViz() {
  const [wethBalance, setWethBalance] = useState(5);
  const [wbtcBalance, setWbtcBalance] = useState(0.1);
  const [debt, setDebt] = useState(12000);

  const wethPrice = 3000;
  const wbtcPrice = 60000;
  const borrowFactors = { WETH: 0.83, WBTC: 0.70 };
  const liquidateFactors = { WETH: 0.90, WBTC: 0.77 };

  const wethBorrowCap = wethBalance * wethPrice * borrowFactors.WETH;
  const wbtcBorrowCap = wbtcBalance * wbtcPrice * borrowFactors.WBTC;
  const borrowThreshold = wethBorrowCap + wbtcBorrowCap;

  const wethLiqCap = wethBalance * wethPrice * liquidateFactors.WETH;
  const wbtcLiqCap = wbtcBalance * wbtcPrice * liquidateFactors.WBTC;
  const liqThreshold = wethLiqCap + wbtcLiqCap;

  const isLiquidatable = debt > liqThreshold;
  const isOverBorrow = debt > borrowThreshold;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[70px]">WETH</label>
        <input type="range" min={0} max={10} step={0.1} value={wethBalance}
          onChange={(e) => setWethBalance(+e.target.value)} className="flex-1 accent-blue-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{wethBalance}</span>
      </div>
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[70px]">WBTC</label>
        <input type="range" min={0} max={1} step={0.01} value={wbtcBalance}
          onChange={(e) => setWbtcBalance(+e.target.value)} className="flex-1 accent-orange-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{wbtcBalance}</span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[70px]">USDC 부채</label>
        <input type="range" min={0} max={40000} step={500} value={debt}
          onChange={(e) => setDebt(+e.target.value)} className="flex-1 accent-red-500" />
        <span className="text-sm font-bold text-foreground min-w-[80px] text-right">
          ${debt.toLocaleString()}
        </span>
      </div>

      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">isLiquidatable() — 2가지 임계치 계산</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={46} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          liquidationThreshold = Σ(balance × price × liquidateCollateralFactor)
        </text>
        <text x={260} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          debt &gt; liquidationThreshold → 청산 가능
        </text>

        {/* 담보별 계산 */}
        <text x={260} y={108} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">담보별 임계치 계산</text>

        {/* WETH */}
        <rect x={20} y={122} width={480} height={46} rx={6}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.6} />
        <text x={32} y={140} fontSize={11} fontWeight={700} fill="#3b82f6">WETH</text>
        <text x={80} y={140} fontSize={10} fill="var(--muted-foreground)">
          {wethBalance} × ${wethPrice.toLocaleString()}
        </text>
        <text x={250} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          × borrow 83% = ${Math.round(wethBorrowCap).toLocaleString()}
        </text>
        <text x={488} y={140} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
          × liquidate 90% = ${Math.round(wethLiqCap).toLocaleString()}
        </text>
        <text x={32} y={158} fontSize={9} fill="var(--muted-foreground)">
          = ${(wethBalance * wethPrice).toLocaleString()}
        </text>

        {/* WBTC */}
        <rect x={20} y={174} width={480} height={46} rx={6}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.6} />
        <text x={32} y={192} fontSize={11} fontWeight={700} fill="#f59e0b">WBTC</text>
        <text x={80} y={192} fontSize={10} fill="var(--muted-foreground)">
          {wbtcBalance} × ${wbtcPrice.toLocaleString()}
        </text>
        <text x={250} y={192} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          × borrow 70% = ${Math.round(wbtcBorrowCap).toLocaleString()}
        </text>
        <text x={488} y={192} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
          × liquidate 77% = ${Math.round(wbtcLiqCap).toLocaleString()}
        </text>
        <text x={32} y={210} fontSize={9} fill="var(--muted-foreground)">
          = ${(wbtcBalance * wbtcPrice).toLocaleString()}
        </text>

        {/* 2가지 임계치 비교 */}
        <text x={260} y={242} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">2가지 임계치 vs 현재 부채</text>

        <rect x={20} y={256} width={155} height={74} rx={8}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={97} y={274} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          Borrow 한도 (LTV)
        </text>
        <text x={97} y={296} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">
          ${Math.round(borrowThreshold).toLocaleString()}
        </text>
        <text x={97} y={316} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          {isOverBorrow ? '✗ 초과 차입' : '✓ 차입 가능'}
        </text>

        <rect x={185} y={256} width={150} height={74} rx={8}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={260} y={274} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          Liquidate 임계 (LT)
        </text>
        <text x={260} y={296} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">
          ${Math.round(liqThreshold).toLocaleString()}
        </text>
        <text x={260} y={316} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          청산 기준선
        </text>

        <rect x={345} y={256} width={155} height={74} rx={8}
          fill={isLiquidatable ? '#ef4444' : '#10b981'} fillOpacity={0.12}
          stroke={isLiquidatable ? '#ef4444' : '#10b981'} strokeWidth={1.2} />
        <text x={422} y={274} textAnchor="middle" fontSize={10} fontWeight={700}
          fill={isLiquidatable ? '#ef4444' : '#10b981'}>
          현재 부채
        </text>
        <text x={422} y={296} textAnchor="middle" fontSize={14} fontWeight={700}
          fill={isLiquidatable ? '#ef4444' : '#10b981'}>
          ${debt.toLocaleString()}
        </text>
        <text x={422} y={316} textAnchor="middle" fontSize={8.5} fontWeight={700}
          fill={isLiquidatable ? '#ef4444' : '#10b981'}>
          {isLiquidatable ? '⚠ LIQUIDATABLE' : '✓ Safe'}
        </text>

        {/* 결과 */}
        <rect x={20} y={346} width={480} height={46} rx={8}
          fill={isLiquidatable ? '#ef4444' : '#10b981'} fillOpacity={0.08}
          stroke={isLiquidatable ? '#ef4444' : '#10b981'} strokeWidth={0.8} strokeDasharray={isLiquidatable ? '3 2' : undefined} />
        <text x={260} y={366} textAnchor="middle" fontSize={12} fontWeight={700}
          fill={isLiquidatable ? '#ef4444' : '#10b981'}>
          {isLiquidatable
            ? `debt $${debt.toLocaleString()} > LT $${Math.round(liqThreshold).toLocaleString()} → absorb() 호출 가능`
            : `debt $${debt.toLocaleString()} ≤ LT $${Math.round(liqThreshold).toLocaleString()} → 청산 불가`}
        </text>
        <text x={260} y={382} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          borrow factor &lt; liquidate factor → 안전 마진 (83% vs 90%, 7% 버퍼)
        </text>
      </svg>
    </div>
  );
}
