export default function AgentScoreChartViz() {
  // Task: "Debug authentication flow" → tags=[debug, auth, code]
  const agents = [
    { name: 'debug-agent',  tags: ['debug', 'code', 'test'],         overlap: 0.67, final: 0.73, top3: true,  selected: true },
    { name: 'security',     tags: ['auth', 'security', 'code'],      overlap: 0.67, final: 0.72, top3: true,  selected: true },
    { name: 'Explore',      tags: ['search', 'code', 'files'],       overlap: 0.33, final: 0.47, top3: true,  selected: true },
    { name: 'code-review',  tags: ['review', 'code', 'quality'],     overlap: 0.33, final: 0.42, top3: false, selected: true },
    { name: 'refactor',     tags: ['refactor', 'code'],              overlap: 0.33, final: 0.38, top3: false, selected: true },
    { name: 'Plan',         tags: ['design', 'architecture'],        overlap: 0.00, final: 0.00, top3: false, selected: false },
    { name: 'claude-guide', tags: ['docs', 'config'],                overlap: 0.00, final: 0.00, top3: false, selected: false },
    { name: 'statusline',   tags: ['statusline', 'config'],          overlap: 0.00, final: 0.00, top3: false, selected: false },
    { name: 'test-runner',  tags: ['test', 'ci'],                    overlap: 0.00, final: 0.00, top3: false, selected: false },
    { name: 'dependency',   tags: ['deps', 'package'],               overlap: 0.00, final: 0.00, top3: false, selected: false },
  ];

  const chartX = 124;
  const chartW = 300;
  const cutoff = 0.3;
  const scale = (v: number) => v * chartW;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 440" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">베스트11 스코어링 — &quot;Debug auth flow&quot; 태스크</text>

        {/* Task context bar */}
        <rect x={24} y={36} width={512} height={26} rx={5}
          fill="#94a3b8" fillOpacity={0.12} stroke="#94a3b8" strokeWidth={1} />
        <text x={34} y={53} fontSize={9.5} fontWeight={700} fill="var(--foreground)">Task tags:</text>
        {['debug', 'auth', 'code'].map((t, i) => (
          <g key={t}>
            <rect x={100 + i * 62} y={41} width={54} height={16} rx={8} fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={1} />
            <text x={127 + i * 62} y={53} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">{t}</text>
          </g>
        ))}
        <text x={300} y={53} fontSize={9} fill="var(--muted-foreground)">
          weights: overlap×0.6 + domain×0.3 + success×0.1
        </text>

        {/* Chart axis */}
        <text x={chartX} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0.0</text>
        <text x={chartX + scale(0.3)} y={80} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={700}>0.3</text>
        <text x={chartX + scale(0.5)} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0.5</text>
        <text x={chartX + scale(0.8)} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0.8</text>
        <text x={chartX + scale(1.0)} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1.0</text>

        {/* Cutoff line */}
        <line x1={chartX + scale(cutoff)} y1={86} x2={chartX + scale(cutoff)} y2={86 + agents.length * 30 + 6}
          stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3" />
        <text x={chartX + scale(cutoff) + 4} y={98} fontSize={9} fontWeight={700} fill="#ef4444">
          threshold
        </text>

        {/* Agent bars */}
        {agents.map((a, i) => {
          const y = 94 + i * 30;
          const overlapW = Math.max(scale(a.overlap), 1);
          const finalW = Math.max(scale(a.final), 1);
          const barColor = a.top3 ? '#10b981' : a.selected ? '#3b82f6' : '#94a3b8';
          const textColor = a.selected ? 'var(--foreground)' : 'var(--muted-foreground)';
          return (
            <g key={a.name}>
              {/* Name */}
              <text x={chartX - 8} y={y + 17} textAnchor="end" fontSize={9.5} fontFamily="monospace"
                fontWeight={a.top3 ? 700 : 400} fill={textColor}>
                {a.name}
              </text>
              {/* Top-3 marker */}
              {a.top3 && (
                <text x={14} y={y + 17} fontSize={11} fontWeight={700} fill="#10b981">★</text>
              )}
              {/* Overlap bar (background lighter) */}
              <rect x={chartX} y={y + 4} width={overlapW} height={10} rx={1}
                fill={barColor} fillOpacity={0.3} />
              {/* Final score bar (solid) */}
              <rect x={chartX} y={y + 14} width={finalW} height={10} rx={1}
                fill={barColor} fillOpacity={0.85} stroke={barColor} strokeWidth={0.5} />
              {/* Value labels */}
              <text x={chartX + Math.max(overlapW, finalW) + 6} y={y + 12} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
                ov={a.overlap.toFixed(2)}
              </text>
              <text x={chartX + Math.max(overlapW, finalW) + 6} y={y + 22} fontSize={8.5} fontFamily="monospace" fontWeight={700} fill={barColor}>
                f={a.final.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x={24} y={400} width={512} height={36} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <g transform="translate(40, 412)">
          <rect x={0} y={0} width={14} height={10} rx={1} fill="#10b981" fillOpacity={0.85} />
          <text x={18} y={9} fontSize={9} fontWeight={700} fill="#10b981">★ Top-3 (LLM 노출)</text>
          <rect x={128} y={0} width={14} height={10} rx={1} fill="#3b82f6" fillOpacity={0.85} />
          <text x={146} y={9} fontSize={9} fill="var(--muted-foreground)">통과 (&gt; 0.3)</text>
          <rect x={232} y={0} width={14} height={10} rx={1} fill="#94a3b8" fillOpacity={0.85} />
          <text x={250} y={9} fontSize={9} fill="var(--muted-foreground)">필터링 (≤ 0.3)</text>
          <text x={348} y={9} fontSize={9} fill="var(--muted-foreground)">ov=tag overlap · f=final score</text>
        </g>
      </svg>
    </div>
  );
}
