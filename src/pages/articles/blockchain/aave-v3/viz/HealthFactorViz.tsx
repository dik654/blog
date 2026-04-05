import { useState } from 'react';

export default function HealthFactorViz() {
  const [collateralValue, setCollateralValue] = useState(10000);
  const [debtValue, setDebtValue] = useState(6000);
  const liquidationThreshold = 0.825; // 82.5% for USDC

  const healthFactor = (collateralValue * liquidationThreshold) / debtValue;
  const isSafe = healthFactor >= 1.5;
  const isWarning = healthFactor >= 1 && healthFactor < 1.5;
  const isLiquidatable = healthFactor < 1;

  const color = isSafe ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444';
  const status = isSafe ? 'Safe' : isWarning ? 'Warning' : 'Liquidatable';

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">담보 가치</label>
        <input type="range" min={5000} max={30000} step={500} value={collateralValue}
          onChange={(e) => setCollateralValue(+e.target.value)} className="flex-1 accent-green-500" />
        <span className="text-sm font-bold text-foreground min-w-[80px] text-right">
          ${collateralValue.toLocaleString()}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">부채 가치</label>
        <input type="range" min={1000} max={25000} step={500} value={debtValue}
          onChange={(e) => setDebtValue(+e.target.value)} className="flex-1 accent-red-500" />
        <span className="text-sm font-bold text-foreground min-w-[80px] text-right">
          ${debtValue.toLocaleString()}
        </span>
      </div>

      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Health Factor — 청산 안전도 계산기</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={44} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={64} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">
          HF = (담보 × LiquidationThreshold) / 부채
        </text>
        <text x={260} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          LT = 82.5% (USDC) · HF ＜ 1이면 청산 가능
        </text>

        {/* HF 결과 */}
        <rect x={20} y={102} width={480} height={84} rx={8}
          fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.5} />
        <text x={260} y={130} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
          Health Factor — {status}
        </text>
        <text x={260} y={170} textAnchor="middle" fontSize={38} fontWeight={700} fill={color}>
          {healthFactor.toFixed(2)}
        </text>

        {/* HF 시각화 바 */}
        <text x={260} y={208} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">HF 구간</text>

        <defs>
          <linearGradient id="hf-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
            <stop offset="25%" stopColor="#ef4444" stopOpacity={0.4} />
            <stop offset="25%" stopColor="#f59e0b" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <rect x={20} y={218} width={480} height={20} rx={4}
          fill="url(#hf-grad)" stroke="var(--border)" strokeWidth={0.5} />

        {/* 눈금 */}
        <line x1={260} y1={214} x2={260} y2={244} stroke="#6b7280" strokeWidth={1.5} strokeDasharray="2 2" />
        <text x={260} y={254} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6b7280">1.0</text>
        <line x1={380} y1={214} x2={380} y2={244} stroke="#6b7280" strokeWidth={1.5} strokeDasharray="2 2" />
        <text x={380} y={254} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6b7280">1.5</text>

        {/* 현재 위치 마커 */}
        {(() => {
          const x = Math.min(500, Math.max(20, 20 + (healthFactor / 2) * 480));
          return (
            <g>
              <circle cx={x} cy={228} r={7} fill={color} stroke="var(--card)" strokeWidth={2} />
              <text x={x} y={274} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
                현재 {healthFactor.toFixed(2)}
              </text>
            </g>
          );
        })()}

        <text x={80} y={292} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">청산</text>
        <text x={320} y={292} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">주의</text>
        <text x={440} y={292} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">안전</text>
      </svg>
    </div>
  );
}
