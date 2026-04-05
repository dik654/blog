export default function V4GasComparisonViz() {
  const comparisons = [
    { op: '단일 swap', v3: 140, v4: 100, savings: 28 },
    { op: '2홉 swap', v3: 260, v4: 150, savings: 42 },
    { op: 'LP mint', v3: 400, v4: 250, savings: 38 },
    { op: '새 풀 생성', v3: 5200, v4: 180, savings: 97 },
  ];

  const maxGas = 5200;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">V3 vs V4 가스 비용 — 연산별 절감</text>

        {/* 범례 */}
        <rect x={30} y={40} width={14} height={14} rx={2} fill="#ef4444" fillOpacity={0.4} />
        <text x={50} y={52} fontSize={10} fontWeight={600} fill="#ef4444">V3</text>
        <rect x={90} y={40} width={14} height={14} rx={2} fill="#10b981" fillOpacity={0.4} />
        <text x={110} y={52} fontSize={10} fontWeight={600} fill="#10b981">V4</text>

        {comparisons.map((c, i) => {
          const y = 72 + i * 66;
          const v3Width = (c.v3 / maxGas) * 330;
          const v4Width = (c.v4 / maxGas) * 330;
          return (
            <g key={i}>
              {/* 연산 이름 */}
              <text x={20} y={y + 16} fontSize={11} fontWeight={700} fill="var(--foreground)">
                {c.op}
              </text>

              {/* V3 막대 */}
              <rect x={110} y={y + 4} width={v3Width} height={20} rx={3}
                fill="#ef4444" fillOpacity={0.4} stroke="#ef4444" strokeWidth={0.8} />
              <text x={114 + v3Width} y={y + 18} fontSize={10} fontWeight={700} fill="#ef4444">
                {(c.v3 / 1000).toFixed(c.v3 >= 1000 ? 1 : 0)}
                {c.v3 >= 1000 ? 'M' : 'K'}
              </text>

              {/* V4 막대 */}
              <rect x={110} y={y + 28} width={v4Width} height={20} rx={3}
                fill="#10b981" fillOpacity={0.4} stroke="#10b981" strokeWidth={0.8} />
              <text x={114 + v4Width} y={y + 42} fontSize={10} fontWeight={700} fill="#10b981">
                {(c.v4 / 1000).toFixed(c.v4 >= 1000 ? 1 : 0)}
                {c.v4 >= 1000 ? 'M' : 'K'}
              </text>

              {/* 절감율 */}
              <rect x={446} y={y + 14} width={54} height={24} rx={4}
                fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={0.6} />
              <text x={473} y={y + 30} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
                -{c.savings}%
              </text>
            </g>
          );
        })}

        {/* 원인 분석 */}
        <rect x={20} y={330} width={480} height={0} />
        <rect x={20} y={338} width={480} height={0} />
        <text x={260} y={336} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">
          Singleton(배포 제거) · Flash Accounting(transfer 제거) · ERC-6909(NFT 제거) · Transient Storage
        </text>
      </svg>
    </div>
  );
}
