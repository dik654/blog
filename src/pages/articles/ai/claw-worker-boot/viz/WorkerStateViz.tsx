export default function WorkerStateViz() {
  const states = [
    { name: 'Idle', x: 70, y: 120, color: '#6b7280' },
    { name: 'Launching', x: 163, y: 120, color: '#3b82f6' },
    { name: 'TrustResolving', x: 256, y: 120, color: '#8b5cf6' },
    { name: 'Ready', x: 350, y: 120, color: '#10b981' },
    { name: 'Working', x: 443, y: 120, color: '#f59e0b' },
    { name: 'WaitingInput', x: 443, y: 60, color: '#f59e0b' },
    { name: 'Completed', x: 513, y: 188, color: '#10b981' },
    { name: 'Failed', x: 350, y: 234, color: '#ef4444' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">WorkerStatus — 8단계 상태 머신</text>

        <defs>
          <marker id="ws-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 전이 */}
        {[
          [0, 1], [1, 2], [2, 3], [3, 4],
          [4, 5], [5, 4],
          [4, 6], [1, 7], [2, 7], [4, 7]
        ].map(([from, to], i) => {
          const s1 = states[from];
          const s2 = states[to];
          return (
            <line key={i} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
              stroke="#3b82f6" strokeWidth={0.8} opacity={0.5} markerEnd="url(#ws-arr)" />
          );
        })}

        {/* 상태 노드 */}
        {states.map(s => (
          <g key={s.name}>
            <circle cx={s.x} cy={s.y} r={28}
              fill={s.color} fillOpacity={0.15}
              stroke={s.color} strokeWidth={1.5} />
            <text x={s.x} y={s.y + 3} textAnchor="middle" fontSize={8.5} fontWeight={700}
              fill={s.color}>{s.name}</text>
          </g>
        ))}

        <text x={280} y={280} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">Ready 도달까지 ~100-500ms · 10개 허용 전이만 정의</text>
      </svg>
    </div>
  );
}
