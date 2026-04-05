export default function SessionTimelineViz() {
  const events = [
    { time: '10:00:00', from: 'Initializing', to: 'Active',      color: '#3b82f6' },
    { time: '10:02:15', from: 'Active',       to: 'Compacting',  color: '#f59e0b' },
    { time: '10:02:16', from: 'Compacting',   to: 'Active',      color: '#3b82f6' },
    { time: '10:15:00', from: 'Active',       to: 'Paused',      color: '#8b5cf6' },
    { time: '10:20:00', from: 'Paused',       to: 'Active',      color: '#3b82f6' },
    { time: '10:45:00', from: 'Active',       to: 'Terminating', color: '#ef4444' },
    { time: '10:45:03', from: 'Terminating',  to: 'Terminated',  color: '#6b7280' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Session 상태 전이 로그 (2026-04-05)</text>

        <defs>
          <marker id="stl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Vertical timeline axis */}
        <line x1={86} y1={52} x2={86} y2={294} stroke="var(--border)" strokeWidth={1.5} />

        {events.map((e, i) => {
          const y = 58 + i * 34;
          return (
            <g key={i}>
              {/* Timestamp */}
              <text x={76} y={y + 5} textAnchor="end" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {e.time}
              </text>
              {/* Timeline dot */}
              <circle cx={86} cy={y} r={4.5} fill={e.color} stroke="var(--card)" strokeWidth={1.5} />
              {/* From state */}
              <rect x={102} y={y - 12} width={124} height={24} rx={4}
                fill="var(--muted)" opacity={0.5} stroke="var(--border)" strokeWidth={0.8} />
              <text x={164} y={y + 4} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
                {e.from}
              </text>
              {/* Arrow */}
              <line x1={228} y1={y} x2={258} y2={y}
                stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#stl-arr)" />
              {/* To state (colored) */}
              <rect x={262} y={y - 12} width={124} height={24} rx={4}
                fill={e.color} fillOpacity={0.18} stroke={e.color} strokeWidth={1.2} />
              <text x={324} y={y + 4} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={e.color}>
                {e.to}
              </text>

              {/* Duration annotation (between steps) */}
              {i < events.length - 1 && (() => {
                const durations = ['2m 15s', '1s', '12m 44s', '5m', '25m', '3s'];
                return (
                  <text x={400} y={y + 23} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
                    ↓ {durations[i]}
                  </text>
                );
              })()}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(460, 56)">
          <text x={0} y={0} fontSize={10} fontWeight={700} fill="var(--foreground)">상태 색상</text>
          {[
            { c: '#3b82f6', l: 'Active' },
            { c: '#f59e0b', l: 'Compacting' },
            { c: '#8b5cf6', l: 'Paused' },
            { c: '#ef4444', l: 'Terminating' },
            { c: '#6b7280', l: 'Terminated' },
          ].map((row, i) => (
            <g key={i} transform={`translate(0, ${14 + i * 18})`}>
              <rect x={0} y={-8} width={14} height={10} rx={2} fill={row.c} fillOpacity={0.5} stroke={row.c} strokeWidth={0.8} />
              <text x={20} y={0} fontSize={9} fill="var(--muted-foreground)">{row.l}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
