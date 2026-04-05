import { useState } from 'react';

export default function HopComparisonViz() {
  const [hops, setHops] = useState(3);

  // V3: 2 transfers per hop (in+out) × hops = 2×hops
  const v3Transfers = 2 * hops;
  const v3Gas = v3Transfers * 50; // in K

  // V4: 1 TSTORE per hop + 2 transfers at settle
  const v4Transfers = 2;
  const v4Gas = hops * 0.1 + v4Transfers * 50; // in K

  const savings = ((v3Gas - v4Gas) / v3Gas) * 100;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 슬라이더 */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[80px]">홉 개수</label>
        <input
          type="range"
          min={1}
          max={6}
          step={1}
          value={hops}
          onChange={(e) => setHops(+e.target.value)}
          className="flex-1 accent-green-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[50px] text-right">{hops}홉</span>
      </div>

      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">다중 홉 가스 비교 — 홉 개수에 따른 차이</text>

        {/* V3 */}
        <text x={60} y={72} fontSize={12} fontWeight={700} fill="#ef4444">V3</text>
        <rect x={110} y={58} width={Math.min(360, (v3Gas / 700) * 360)} height={28} rx={4}
          fill="#ef4444" fillOpacity={0.35} stroke="#ef4444" strokeWidth={1} />
        <text x={120 + Math.min(360, (v3Gas / 700) * 360)} y={76} fontSize={12} fontWeight={700} fill="#ef4444">
          ~{Math.round(v3Gas)}K
        </text>

        {/* V4 */}
        <text x={60} y={118} fontSize={12} fontWeight={700} fill="#10b981">V4</text>
        <rect x={110} y={104} width={Math.min(360, (v4Gas / 700) * 360)} height={28} rx={4}
          fill="#10b981" fillOpacity={0.35} stroke="#10b981" strokeWidth={1} />
        <text x={120 + Math.min(360, (v4Gas / 700) * 360)} y={122} fontSize={12} fontWeight={700} fill="#10b981">
          ~{Math.round(v4Gas)}K
        </text>

        {/* 상세 분석 */}
        <rect x={20} y={158} width={235} height={86} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.6} />
        <text x={137} y={178} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          V3 구조
        </text>
        <text x={36} y={200} fontSize={10} fill="var(--muted-foreground)">transfer: </text>
        <text x={242} y={200} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">
          {v3Transfers}회 × 50K = {v3Transfers * 50}K
        </text>
        <text x={36} y={218} fontSize={10} fill="var(--muted-foreground)">매 홉마다</text>
        <text x={242} y={218} textAnchor="end" fontSize={10} fill="var(--foreground)">
          in/out ERC20 transfer
        </text>
        <text x={36} y={235} fontSize={9} fontStyle="italic" fill="#ef4444">
          중간 토큰도 실제 이동
        </text>

        <rect x={265} y={158} width={235} height={86} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={382} y={178} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          V4 구조
        </text>
        <text x={281} y={200} fontSize={10} fill="var(--muted-foreground)">TSTORE: </text>
        <text x={487} y={200} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">
          {hops}회 × 0.1K = {(hops * 0.1).toFixed(1)}K
        </text>
        <text x={281} y={218} fontSize={10} fill="var(--muted-foreground)">transfer: </text>
        <text x={487} y={218} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">
          2회 × 50K = 100K (정산)
        </text>
        <text x={281} y={235} fontSize={9} fontStyle="italic" fill="#10b981">
          중간 토큰 이동 없음
        </text>

        {/* 절감 효과 */}
        <rect x={20} y={258} width={480} height={34} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={260} y={280} textAnchor="middle" fontSize={14} fontWeight={700} fill="#f59e0b">
          V4가 {savings.toFixed(0)}% 가스 절감 ({hops}홉)
        </text>
      </svg>
    </div>
  );
}
