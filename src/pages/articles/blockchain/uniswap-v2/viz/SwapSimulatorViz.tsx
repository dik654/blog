import { useState } from 'react';

export default function SwapSimulatorViz() {
  const initialX = 3000000; // USDC
  const initialY = 1000;    // ETH
  const k = initialX * initialY;

  const [deltaX, setDeltaX] = useState(30000); // USDC 입력량

  // 수수료 제외
  const deltaXFee = deltaX * 0.997;
  const newX = initialX + deltaX;
  const newY = k / (initialX + deltaXFee);
  const deltaY = initialY - newY;

  const priceInitial = initialX / initialY;
  const priceMarginal = newX / newY;
  const priceEffective = deltaX / deltaY;
  const slippagePct = ((priceEffective - priceInitial) / priceInitial) * 100;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 입력 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">
          USDC 입력
        </label>
        <input
          type="range"
          min={1000}
          max={500000}
          step={1000}
          value={deltaX}
          onChange={(e) => setDeltaX(+e.target.value)}
          className="flex-1 accent-blue-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[90px] text-right">
          ${deltaX.toLocaleString()}
        </span>
      </div>

      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Swap 시뮬레이터 — 입력량에 따른 슬리피지</text>

        {/* Before state */}
        <rect x={20} y={42} width={235} height={100} rx={8}
          fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={137} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Before — USDC/ETH 풀
        </text>
        <text x={34} y={84} fontSize={10} fill="var(--muted-foreground)">reserve0 (USDC)</text>
        <text x={242} y={84} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">
          {(initialX / 1000000).toFixed(1)}M
        </text>
        <line x1={34} y1={90} x2={242} y2={90} stroke="var(--border)" strokeWidth={0.3} opacity={0.5} />
        <text x={34} y={104} fontSize={10} fill="var(--muted-foreground)">reserve1 (ETH)</text>
        <text x={242} y={104} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">
          {initialY.toLocaleString()}
        </text>
        <line x1={34} y1={110} x2={242} y2={110} stroke="var(--border)" strokeWidth={0.3} opacity={0.5} />
        <text x={34} y={124} fontSize={10} fill="var(--muted-foreground)">가격 (USDC/ETH)</text>
        <text x={242} y={124} textAnchor="end" fontSize={10} fontWeight={700} fill="#3b82f6">
          ${priceInitial.toFixed(0)}
        </text>

        {/* After state */}
        <rect x={265} y={42} width={235} height={100} rx={8}
          fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={0.8} />
        <text x={382} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          After — 스왑 후
        </text>
        <text x={279} y={84} fontSize={10} fill="var(--muted-foreground)">reserve0 (USDC)</text>
        <text x={487} y={84} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">
          {(newX / 1000000).toFixed(2)}M
        </text>
        <line x1={279} y1={90} x2={487} y2={90} stroke="var(--border)" strokeWidth={0.3} opacity={0.5} />
        <text x={279} y={104} fontSize={10} fill="var(--muted-foreground)">reserve1 (ETH)</text>
        <text x={487} y={104} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">
          {newY.toFixed(2)}
        </text>
        <line x1={279} y1={110} x2={487} y2={110} stroke="var(--border)" strokeWidth={0.3} opacity={0.5} />
        <text x={279} y={124} fontSize={10} fill="var(--muted-foreground)">새 marginal 가격</text>
        <text x={487} y={124} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">
          ${priceMarginal.toFixed(0)}
        </text>

        {/* 수식 */}
        <rect x={20} y={160} width={480} height={50} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={180} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#f59e0b">Δy = y × Δx·0.997 / (x + Δx·0.997)</text>
        <text x={260} y={198} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">0.3% 수수료 반영한 실제 출력 공식</text>

        {/* 결과 */}
        <rect x={20} y={224} width={155} height={80} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={97} y={244} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          ETH 출력
        </text>
        <text x={97} y={270} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          {deltaY.toFixed(4)}
        </text>
        <text x={97} y={290} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ETH 수령
        </text>

        <rect x={185} y={224} width={155} height={80} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={262} y={244} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          유효 가격
        </text>
        <text x={262} y={270} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          ${priceEffective.toFixed(0)}
        </text>
        <text x={262} y={290} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Δx / Δy
        </text>

        <rect x={350} y={224} width={150} height={80} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.8} />
        <text x={425} y={244} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          슬리피지
        </text>
        <text x={425} y={270} textAnchor="middle" fontSize={18} fontWeight={700} fill="#ef4444">
          {slippagePct.toFixed(2)}%
        </text>
        <text x={425} y={290} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          marginal 대비
        </text>
      </svg>
    </div>
  );
}
