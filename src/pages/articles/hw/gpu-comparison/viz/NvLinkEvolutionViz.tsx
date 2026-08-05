/**
 * NVLink 진화 — V100 → A100 → H100 → B200 의 GPU-to-GPU 대역폭.
 */
export default function NvLinkEvolutionViz() {
  const W = 720;
  const H = 360;

  const versions = [
    { gen: 'NVLink 2.0', gpu: 'V100', bw: 300, year: '2017', color: '#94a3b8' },
    { gen: 'NVLink 3.0', gpu: 'A100', bw: 600, year: '2020', color: '#3b82f6' },
    { gen: 'NVLink 4.0', gpu: 'H100', bw: 900, year: '2022', color: '#10b981' },
    { gen: 'NVLink 5.0', gpu: 'B200', bw: 1800, year: '2024', color: '#f59e0b' },
  ];

  const maxBw = 2000;
  const barW = 130;
  const gap = 30;
  const startX = (W - versions.length * barW - (versions.length - 1) * gap) / 2;
  const baseY = 290;
  const maxBarH = 200;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">NVLink 진화 — GPU-to-GPU 직접 대역폭 (CPU·PCIe 우회)</text>

        {/* Y axis grid */}
        {[0, 500, 1000, 1500, 2000].map((v) => {
          const y = baseY - (v / maxBw) * maxBarH;
          return (
            <g key={v}>
              <line x1={50} y1={y} x2={W - 20} y2={y} stroke="#94a3b8" strokeWidth={0.3} opacity={0.4} />
              <text x={45} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{v}</text>
            </g>
          );
        })}
        <text x={20} y={70} fontSize={9} fill="var(--muted-foreground)">GB/s</text>

        {versions.map((v, i) => {
          const x = startX + i * (barW + gap);
          const barH = (v.bw / maxBw) * maxBarH;
          return (
            <g key={v.gen}>
              {/* bar */}
              <rect x={x} y={baseY - barH} width={barW} height={barH} rx={3}
                fill={v.color} fillOpacity={0.55} stroke={v.color} strokeWidth={1} />

              {/* value 위 */}
              <text x={x + barW / 2} y={baseY - barH - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={v.color}>
                {v.bw} GB/s
              </text>

              {/* GPU label */}
              <text x={x + barW / 2} y={baseY + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={v.color}>
                {v.gpu}
              </text>
              <text x={x + barW / 2} y={baseY + 30} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {v.gen}
              </text>
              <text x={x + barW / 2} y={baseY + 42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {v.year}
              </text>
            </g>
          );
        })}

        <text x={W / 2} y={H - 5} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          7 년 만에 6 배 — multi-GPU 학습 / LLM tensor parallelism 의 결정적 차이
        </text>
      </svg>
    </div>
  );
}
