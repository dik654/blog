export default function SessionStateViz() {
  const states = [
    { name: 'Initializing', color: '#6b7280' },
    { name: 'Active', color: '#10b981' },
    { name: 'Paused', color: '#f59e0b' },
    { name: 'Compacting', color: '#8b5cf6' },
    { name: 'Terminating', color: '#ef4444' },
    { name: 'Terminated', color: '#6b7280' },
  ];

  const positions = [
    { x: 80, y: 150 },    // Initializing
    { x: 210, y: 150 },   // Active
    { x: 340, y: 80 },    // Paused
    { x: 340, y: 220 },   // Compacting
    { x: 420, y: 150 },   // Terminating
    { x: 500, y: 150 },   // Terminated
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SessionState 상태 머신</text>

        <defs>
          <marker id="ss-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 전이 화살표들 */}
        {[
          [0, 1], // Init → Active
          [1, 2], // Active → Paused
          [2, 1], // Paused → Active
          [1, 3], // Active → Compacting
          [3, 1], // Compacting → Active
          [1, 4], // Active → Terminating
          [2, 4], // Paused → Terminating
          [4, 5], // Terminating → Terminated
        ].map(([from, to], i) => {
          const p1 = positions[from];
          const p2 = positions[to];
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#3b82f6" strokeWidth={1} markerEnd="url(#ss-arr)" opacity={0.6} />
          );
        })}

        {/* 상태 노드 */}
        {states.map((state, i) => {
          const pos = positions[i];
          return (
            <g key={state.name}>
              <circle cx={pos.x} cy={pos.y} r={32}
                fill={state.color} fillOpacity={0.15}
                stroke={state.color} strokeWidth={1.5} />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={9}
                fontWeight={700} fill={state.color}>{state.name}</text>
            </g>
          );
        })}

        <text x={280} y={278} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">8개 허용 전이만 정의 — 불가능한 상태 금지</text>
        <text x={280} y={294} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">Terminated는 최종 상태 (부활 불가)</text>
      </svg>
    </div>
  );
}
