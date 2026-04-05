import { useState } from 'react';

export default function GasCostViz() {
  const [crossings, setCrossings] = useState(3);
  const baseGas = 100000;
  const perCrossing = 18000;
  const totalGas = baseGas + crossings * perCrossing;

  const v2Gas = 90000;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[100px]">
          tick crossings
        </label>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={crossings}
          onChange={(e) => setCrossings(+e.target.value)}
          className="flex-1 accent-red-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[50px] text-right">
          {crossings}회
        </span>
      </div>

      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Swap 가스 비용 — crossing 횟수에 비례</text>

        {/* 가스 비교 바 차트 */}
        {/* V2 */}
        <text x={40} y={72} fontSize={11} fontWeight={700} fill="#3b82f6">V2 swap</text>
        <rect x={110} y={60} width={(v2Gas / 400000) * 380} height={22} rx={4}
          fill="#3b82f6" fillOpacity={0.35} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={114 + (v2Gas / 400000) * 380} y={76} fontSize={10} fontWeight={700} fill="#3b82f6">
          {(v2Gas / 1000).toFixed(0)}K gas
        </text>

        {/* V3 base */}
        <text x={40} y={112} fontSize={11} fontWeight={700} fill="#10b981">V3 (0 crossing)</text>
        <rect x={110} y={100} width={(baseGas / 400000) * 380} height={22} rx={4}
          fill="#10b981" fillOpacity={0.35} stroke="#10b981" strokeWidth={0.8} />
        <text x={114 + (baseGas / 400000) * 380} y={116} fontSize={10} fontWeight={700} fill="#10b981">
          {(baseGas / 1000).toFixed(0)}K gas
        </text>

        {/* V3 current */}
        <text x={40} y={152} fontSize={11} fontWeight={700} fill="#ef4444">V3 ({crossings} crossing)</text>
        <rect x={110} y={140} width={Math.min(380, (totalGas / 400000) * 380)} height={22} rx={4}
          fill="#ef4444" fillOpacity={0.35} stroke="#ef4444" strokeWidth={0.8} />
        <text x={114 + Math.min(380, (totalGas / 400000) * 380)} y={156} fontSize={10} fontWeight={700} fill="#ef4444">
          {(totalGas / 1000).toFixed(0)}K gas
        </text>

        {/* 공식 */}
        <rect x={20} y={182} width={480} height={50} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={202} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          gas ≈ base + crossings × perCrossing
        </text>
        <text x={260} y={220} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          base 100K + 각 crossing 18K (tick bitmap 조회 + L 재계산)
        </text>

        {/* 영향 */}
        <rect x={20} y={242} width={235} height={52} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.6} />
        <text x={137} y={260} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          crossing 많음 ↑
        </text>
        <text x={137} y={276} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          유동성 분산 · 변동성 큰 자산
        </text>
        <text x={137} y={288} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          Stable 풀은 0.01% tier 최적화
        </text>

        <rect x={265} y={242} width={235} height={52} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={382} y={260} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          trade-off 정당화 조건
        </text>
        <text x={382} y={276} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          거래 규모 충분히 큼
        </text>
        <text x={382} y={288} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          자본 효율 수익 ≥ gas 증가분
        </text>
      </svg>
    </div>
  );
}
