export default function BootTimingViz() {
  const phases = [
    { name: 'LoadingConfig',        min: 5,    max: 5,    color: '#3b82f6' },
    { name: 'ValidatingConfig',     min: 1,    max: 1,    color: '#3b82f6' },
    { name: 'InitializingLogger',   min: 2,    max: 2,    color: '#3b82f6' },
    { name: 'ResolvingWorkspace',   min: 3,    max: 3,    color: '#3b82f6' },
    { name: 'ComputingTrust',       min: 50,   max: 200,  color: '#8b5cf6' },
    { name: 'DiscoveringPlugins',   min: 20,   max: 100,  color: '#8b5cf6' },
    { name: 'EnablingPlugins',      min: 10,   max: 50,   color: '#8b5cf6' },
    { name: 'StartingMcpServers',   min: 500,  max: 2000, color: '#ef4444' },
    { name: 'CreatingClient',       min: 5,    max: 5,    color: '#3b82f6' },
    { name: 'AuthenticatingApi',    min: 200,  max: 500,  color: '#f59e0b' },
    { name: 'InitializingHooks',    min: 10,   max: 10,   color: '#3b82f6' },
  ];

  // Scale up to 2800ms (total max) so TOTAL bar fits in viewBox
  const maxMs = 2800;
  const barX = 180;
  const barWidth = 300;
  const scale = (ms: number) => (ms / maxMs) * barWidth;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 400" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">부트 타이밍 프로파일 (ms, 병목 식별)</text>

        {/* X-axis labels — use 700ms increments to fit 0-2800 */}
        <text x={barX} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0</text>
        <text x={barX + scale(700)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">700</text>
        <text x={barX + scale(1400)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1400</text>
        <text x={barX + scale(2100)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">2100</text>
        <text x={barX + scale(2800)} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">2800ms</text>

        {/* Grid lines */}
        {[700, 1400, 2100, 2800].map((g) => (
          <line key={g} x1={barX + scale(g)} y1={50} x2={barX + scale(g)} y2={50 + phases.length * 26}
            stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 3" />
        ))}

        {/* Phases as horizontal bars */}
        {phases.map((p, i) => {
          const y = 62 + i * 26;
          const minW = Math.max(scale(p.min), 2);
          const rangeW = scale(p.max - p.min);
          const isRange = p.max > p.min;
          return (
            <g key={p.name}>
              {/* Label */}
              <text x={barX - 8} y={y + 15} textAnchor="end" fontSize={9.5} fontFamily="monospace" fill="var(--foreground)">
                {p.name}
              </text>
              {/* Fixed part (min) */}
              <rect x={barX} y={y + 4} width={minW} height={16} rx={2}
                fill={p.color} fillOpacity={0.7} stroke={p.color} strokeWidth={0.8} />
              {/* Variance range (if any) */}
              {isRange && (
                <rect x={barX + minW} y={y + 4} width={rangeW} height={16} rx={2}
                  fill={p.color} fillOpacity={0.25} stroke={p.color} strokeWidth={0.8} strokeDasharray="3 2" />
              )}
              {/* Value annotation */}
              <text x={barX + minW + rangeW + 6} y={y + 15} fontSize={9} fontFamily="monospace" fill={p.color} fontWeight={700}>
                {isRange ? `${p.min}-${p.max}` : `${p.min}`}
              </text>
            </g>
          );
        })}

        {/* Total line */}
        <line x1={barX - 110} y1={350} x2={barX + barWidth + 60} y2={350} stroke="var(--border)" strokeWidth={1} />
        <text x={barX - 8} y={366} textAnchor="end" fontSize={10} fontWeight={700} fill="var(--foreground)">TOTAL</text>
        <rect x={barX} y={356} width={scale(800)} height={18} rx={2}
          fill="#6366f1" fillOpacity={0.7} stroke="#6366f1" strokeWidth={0.8} />
        <rect x={barX + scale(800)} y={356} width={scale(2000)} height={18} rx={2}
          fill="#6366f1" fillOpacity={0.25} stroke="#6366f1" strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={barX + scale(2800) + 6} y={368} fontSize={10} fontFamily="monospace" fontWeight={700} fill="#6366f1">
          800-2800 ms
        </text>

        {/* Legend */}
        <g transform="translate(40, 388)">
          <rect x={0} y={-8} width={12} height={8} fill="#3b82f6" fillOpacity={0.7} />
          <text x={16} y={0} fontSize={9} fill="var(--muted-foreground)">고정</text>
          <rect x={60} y={-8} width={12} height={8} fill="#8b5cf6" fillOpacity={0.25} stroke="#8b5cf6" strokeDasharray="3 2" strokeWidth={0.8} />
          <text x={76} y={0} fontSize={9} fill="var(--muted-foreground)">변동 범위</text>
          <rect x={146} y={-8} width={12} height={8} fill="#ef4444" fillOpacity={0.7} />
          <text x={162} y={0} fontSize={9} fill="var(--muted-foreground)">병목 (MCP)</text>
          <rect x={228} y={-8} width={12} height={8} fill="#f59e0b" fillOpacity={0.7} />
          <text x={244} y={0} fontSize={9} fill="var(--muted-foreground)">네트워크 의존</text>
        </g>
      </svg>
    </div>
  );
}
