import { useState } from 'react';

export default function CapitalEfficiencyViz() {
  const [rangeWidth, setRangeWidth] = useState(20); // ±% around current price
  const currentPrice = 3000;
  const pLower = currentPrice * (1 - rangeWidth / 100);
  const pUpper = currentPrice * (1 + rangeWidth / 100);

  // Capital efficiency multiplier formula
  // E = 1 / (1 - sqrt(P_lower/P_upper))
  const efficiency = 1 / (1 - Math.sqrt(pLower / pUpper));

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">
          가격 구간 폭
        </label>
        <input
          type="range"
          min={1}
          max={80}
          step={1}
          value={rangeWidth}
          onChange={(e) => setRangeWidth(+e.target.value)}
          className="flex-1 accent-green-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">
          ±{rangeWidth}%
        </span>
      </div>

      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">자본 효율 — 구간 폭 vs 효율 배수</text>

        {/* 가격 구간 시각화 */}
        <line x1={40} y1={90} x2={480} y2={90} stroke="var(--foreground)" strokeWidth={1} />

        {/* 가격 눈금 */}
        {[0.2, 0.5, 1, 1.5, 2].map(r => {
          const x = 40 + ((r - 0.2) / 1.8) * 440;
          return (
            <g key={r}>
              <line x1={x} y1={85} x2={x} y2={95} stroke="var(--foreground)" strokeWidth={0.6} />
              <text x={x} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ${(currentPrice * r).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* LP 구간 박스 */}
        {(() => {
          const xLower = 40 + ((pLower / currentPrice - 0.2) / 1.8) * 440;
          const xUpper = 40 + ((pUpper / currentPrice - 0.2) / 1.8) * 440;
          const xCurrent = 40 + ((1 - 0.2) / 1.8) * 440;
          return (
            <g>
              <rect x={Math.max(40, xLower)} y={56} width={Math.min(440, xUpper - xLower)} height={30}
                fill="#10b981" fillOpacity={0.4} stroke="#10b981" strokeWidth={1.2} />
              <text x={(xLower + xUpper) / 2} y={75} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                LP 구간
              </text>
              <line x1={xCurrent} y1={48} x2={xCurrent} y2={96}
                stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2" />
              <text x={xCurrent} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
                현재 $3000
              </text>
            </g>
          );
        })()}

        {/* 경계값 표시 */}
        <rect x={20} y={136} width={240} height={56} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={32} y={156} fontSize={10} fontWeight={700} fill="var(--foreground)">구간 경계</text>
        <text x={32} y={174} fontSize={10} fill="var(--muted-foreground)">P_lower</text>
        <text x={120} y={174} fontSize={10} fontWeight={700} fill="#10b981">${pLower.toFixed(0)}</text>
        <text x={32} y={188} fontSize={10} fill="var(--muted-foreground)">P_upper</text>
        <text x={120} y={188} fontSize={10} fontWeight={700} fill="#10b981">${pUpper.toFixed(0)}</text>

        {/* 자본 효율 결과 */}
        <rect x={270} y={136} width={230} height={56} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={385} y={156} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          자본 효율 (vs V2)
        </text>
        <text x={385} y={182} textAnchor="middle" fontSize={22} fontWeight={700} fill="#10b981">
          {efficiency.toFixed(1)}×
        </text>

        {/* 공식 */}
        <rect x={20} y={212} width={480} height={46} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.6} />
        <text x={260} y={232} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          E = 1 / (1 − √(P_lower/P_upper))
        </text>
        <text x={260} y={250} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          구간이 좁을수록 효율 ↑ (경계 바깥 가격에서 100% 한 쪽 토큰)
        </text>

        {/* 주의사항 */}
        <rect x={20} y={272} width={480} height={36} rx={6}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={32} y={289} fontSize={10} fontWeight={700} fill="#ef4444">트레이드오프:</text>
        <text x={116} y={289} fontSize={10} fill="var(--foreground)">
          좁을수록 효율↑ 이지만 가격 이탈 시 수수료 수익 중단
        </text>
        <text x={32} y={302} fontSize={9} fill="var(--muted-foreground)">
          → 적극적 재조정 필요 (passive → active LP)
        </text>
      </svg>
    </div>
  );
}
