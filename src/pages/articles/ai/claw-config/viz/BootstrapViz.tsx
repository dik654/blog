export default function BootstrapViz() {
  const phases = [
    'LoadingConfig', 'ValidatingConfig', 'InitializingLogger',
    'ResolvingWorkspace', 'ComputingTrust', 'DiscoveringPlugins',
    'EnablingPlugins', 'StartingMcpServers', 'CreatingClient',
    'AuthenticatingApi', 'InitializingHooks', 'Ready',
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 440" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">BootstrapPhase — 12단계 시작 시퀀스</text>

        {phases.map((phase, i) => {
          const y = 46 + i * 30;
          const color = phase === 'Ready' ? '#10b981' : '#3b82f6';
          return (
            <g key={phase}>
              <circle cx={58} cy={y + 13} r={11}
                fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1} />
              <text x={58} y={y + 17} textAnchor="middle" fontSize={9} fontWeight={700}
                fill={color}>{i + 1}</text>

              <rect x={82} y={y} width={444} height={26} rx={4}
                fill={color} fillOpacity={0.05} stroke={color} strokeWidth={0.6} />
              <text x={98} y={y + 17} fontSize={10} fontWeight={600} fill={color}>
                {phase}
              </text>

              {i < phases.length - 1 && (
                <line x1={58} y1={y + 24} x2={58} y2={y + 30} stroke="#3b82f6" strokeWidth={0.9} />
              )}
            </g>
          );
        })}

        <text x={280} y={428} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">일반 환경: 800-2800ms · MCP가 주 병목</text>
      </svg>
    </div>
  );
}
