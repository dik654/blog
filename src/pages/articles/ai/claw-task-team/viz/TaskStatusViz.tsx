export default function TaskStatusViz() {
  const states = [
    { name: 'Pending', color: '#6b7280', x: 80, y: 130 },
    { name: 'Assigned', color: '#3b82f6', x: 195, y: 130 },
    { name: 'InProgress', color: '#f59e0b', x: 310, y: 130 },
    { name: 'Review', color: '#8b5cf6', x: 425, y: 130 },
    { name: 'Completed', color: '#10b981', x: 510, y: 80 },
    { name: 'Rejected', color: '#ef4444', x: 510, y: 180 },
    { name: 'Cancelled', color: '#ef4444', x: 80, y: 220 },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 290" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">TaskStatus — 7 상태 머신</text>

        <defs>
          <marker id="ts-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 전이 */}
        <line x1={106} y1={130} x2={169} y2={130} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#ts-arr)" />
        <line x1={221} y1={130} x2={284} y2={130} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#ts-arr)" />
        <line x1={336} y1={130} x2={399} y2={130} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#ts-arr)" />
        <line x1={447} y1={113} x2={485} y2={95} stroke="#10b981" strokeWidth={1} markerEnd="url(#ts-arr)" />
        <line x1={447} y1={147} x2={485} y2={165} stroke="#ef4444" strokeWidth={1} markerEnd="url(#ts-arr)" />

        {/* Rejected → InProgress (재작업) */}
        <path d="M 498 185 Q 420 210 320 152" stroke="#ef4444" strokeWidth={0.8}
          fill="none" strokeDasharray="3 2" markerEnd="url(#ts-arr)" />

        {/* Pending → Cancelled */}
        <line x1={80} y1={156} x2={80} y2={194} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" markerEnd="url(#ts-arr)" />

        {/* 상태 노드 */}
        {states.map(s => (
          <g key={s.name}>
            <circle cx={s.x} cy={s.y} r={26}
              fill={s.color} fillOpacity={0.15}
              stroke={s.color} strokeWidth={1.5} />
            <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={s.color}>{s.name}</text>
          </g>
        ))}

        <text x={280} y={275} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">Rejected → InProgress 재작업 루프 · 자동 검증 통과 시 Review → Completed</text>
      </svg>
    </div>
  );
}
