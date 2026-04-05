import { useState } from 'react';

export default function LiquidationBonusViz() {
  const [coveredDebt, setCoveredDebt] = useState(5000);
  const [bonusPct, setBonusPct] = useState(5);
  const wethPrice = 3000;

  const bonus = bonusPct / 100;
  const collateralValue = coveredDebt * (1 + bonus);
  const wethReceived = collateralValue / wethPrice;
  const liquidatorProfit = collateralValue - coveredDebt;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">상환 부채</label>
        <input type="range" min={1000} max={30000} step={500} value={coveredDebt}
          onChange={(e) => setCoveredDebt(+e.target.value)} className="flex-1 accent-red-500" />
        <span className="text-sm font-bold text-foreground min-w-[90px] text-right">
          ${coveredDebt.toLocaleString()}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">청산 Bonus</label>
        <input type="range" min={2} max={15} step={0.5} value={bonusPct}
          onChange={(e) => setBonusPct(+e.target.value)} className="flex-1 accent-green-500" />
        <span className="text-sm font-bold text-foreground min-w-[50px] text-right">{bonusPct}%</span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Liquidation Bonus — 청산자 보상 계산</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={46} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          받는 담보 = (debtToCover × (1 + bonus)) / collateralPrice
        </text>
        <text x={260} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          청산자는 부채 상환 → 담보 + bonus 수령 · bonus가 청산 인센티브
        </text>

        {/* 차익거래 플로우 */}
        <defs>
          <marker id="lb-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 청산자 지불 */}
        <rect x={20} y={108} width={155} height={80} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
        <text x={97} y={128} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          청산자 → Pool
        </text>
        <text x={97} y={156} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          ${coveredDebt.toLocaleString()}
        </text>
        <text x={97} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          USDC (부채 상환)
        </text>

        {/* 화살표 */}
        <line x1={180} y1={148} x2={210} y2={148} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#lb-arr)" />

        {/* 청산자 수령 */}
        <rect x={215} y={108} width={155} height={80} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={292} y={128} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          청산자 ← Pool
        </text>
        <text x={292} y={156} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          {wethReceived.toFixed(3)}
        </text>
        <text x={292} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          WETH (${Math.round(collateralValue).toLocaleString()})
        </text>

        {/* 화살표 */}
        <line x1={375} y1={148} x2={405} y2={148} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#lb-arr)" />

        {/* 수익 */}
        <rect x={410} y={108} width={90} height={80} rx={8}
          fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={455} y={128} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          수익
        </text>
        <text x={455} y={156} textAnchor="middle" fontSize={18} fontWeight={700} fill="#f59e0b">
          ${Math.round(liquidatorProfit).toLocaleString()}
        </text>
        <text x={455} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          +{bonusPct}%
        </text>

        {/* 주의 */}
        <rect x={20} y={208} width={480} height={64} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={228} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          제로섬: 청산자 수익 = User 추가 손실
        </text>
        <text x={260} y={248} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          User는 부채 {(coveredDebt).toLocaleString()} 상환됐지만, 담보 {(Math.round(collateralValue)).toLocaleString()} 사용
        </text>
        <text x={260} y={264} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          순 손실: {bonusPct}% (bonus만큼 추가로 담보 빼앗김)
        </text>

        {/* Bonus 균형 */}
        <rect x={20} y={286} width={480} height={44} rx={6}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.6} />
        <text x={36} y={304} fontSize={10} fontWeight={700} fill="#8b5cf6">Bonus 적정선:</text>
        <text x={128} y={304} fontSize={10} fill="var(--foreground)">
          너무 높음 → user 과다 손실 · 너무 낮음 → 청산 지연 (bad debt)
        </text>
        <text x={36} y={320} fontSize={9} fill="var(--muted-foreground)">
          stable 자산 4-5% · 변동성 자산 6-10% (변동 클수록 bonus ↑)
        </text>
      </svg>
    </div>
  );
}
