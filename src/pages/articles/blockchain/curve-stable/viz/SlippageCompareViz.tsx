import { useState } from 'react';

export default function SlippageCompareViz() {
  const [tradeSize, setTradeSize] = useState(100); // in thousands of dollars
  const poolSize = 10000; // $10M pool, $5M each side

  // Uniswap V2 (CP): Δy = y × Δx / (x + Δx)
  const xInit = poolSize / 2;
  const deltaX = tradeSize;
  const v2Out = (xInit * deltaX) / (xInit + deltaX);
  const v2Slippage = ((deltaX - v2Out) / deltaX) * 100;

  // Curve A=100 approximation
  const A = 100;
  const n = 2;
  // Simplified StableSwap slippage model (close to pegged pools)
  const D = poolSize;
  const imbalance = deltaX / xInit;
  const curveSlippageBase = Math.pow(imbalance, 3) / (A * n);
  const curveOut = deltaX * (1 - curveSlippageBase);
  const curveSlippage = ((deltaX - curveOut) / deltaX) * 100;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">거래 크기</label>
        <input
          type="range"
          min={10}
          max={5000}
          step={10}
          value={tradeSize}
          onChange={(e) => setTradeSize(+e.target.value)}
          className="flex-1 accent-green-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[80px] text-right">
          ${tradeSize.toLocaleString()}K
        </span>
      </div>

      <svg viewBox="0 0 520 280" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">슬리피지 비교 — $10M USDC/USDT 풀 (A=100)</text>

        {/* Uniswap V2 */}
        <rect x={20} y={56} width={235} height={100} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={137} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Uniswap V2 (x·y=k)
        </text>
        <text x={137} y={108} textAnchor="middle" fontSize={26} fontWeight={700} fill="var(--foreground)">
          {v2Slippage.toFixed(2)}%
        </text>
        <text x={137} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          출력: ${Math.round(v2Out).toLocaleString()}K
        </text>
        <text x={137} y={146} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Constant Product
        </text>

        {/* Curve */}
        <rect x={265} y={56} width={235} height={100} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={382} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          Curve (StableSwap)
        </text>
        <text x={382} y={108} textAnchor="middle" fontSize={26} fontWeight={700} fill="var(--foreground)">
          {curveSlippage.toFixed(3)}%
        </text>
        <text x={382} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          출력: ${Math.round(curveOut).toLocaleString()}K
        </text>
        <text x={382} y={146} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          A=100, n=2
        </text>

        {/* 효율 비교 */}
        <rect x={20} y={172} width={480} height={46} rx={8}
          fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={1} />
        <text x={260} y={192} textAnchor="middle" fontSize={13} fontWeight={700} fill="#f59e0b">
          Curve가 {(v2Slippage / curveSlippage).toFixed(0)}배 효율
        </text>
        <text x={260} y={210} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          같은 유동성에서 슬리피지 {((1 - curveSlippage / v2Slippage) * 100).toFixed(1)}% 감소
        </text>

        {/* 경고 */}
        {tradeSize >= 4000 && (
          <rect x={20} y={230} width={480} height={36} rx={6}
            fill="#ef4444" fillOpacity={0.12} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
        )}
        {tradeSize >= 4000 && (
          <text x={260} y={254} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
            ⚠ 거래 크기 {((tradeSize / poolSize) * 100).toFixed(0)}% → Curve도 CP 영역 진입
          </text>
        )}
        {tradeSize < 4000 && (
          <text x={260} y={248} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">
            페그 근처 구간 → StableSwap이 압도적 효율
          </text>
        )}
      </svg>
    </div>
  );
}
