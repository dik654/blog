export default function LifecycleViz() {
  const states = [
    { name: 'Discovered', color: '#6b7280', x: 70, y: 90 },
    { name: 'Loaded', color: '#3b82f6', x: 175, y: 90 },
    { name: 'Validated', color: '#8b5cf6', x: 280, y: 90 },
    { name: 'Enabled', color: '#10b981', x: 385, y: 90 },
    { name: 'Disabled', color: '#f59e0b', x: 490, y: 90 },
    { name: 'Failed', color: '#ef4444', x: 280, y: 190 },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PluginLifecycle — 6단계 상태</text>

        <defs>
          <marker id="lc-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 주요 경로 */}
        <line x1={96} y1={90} x2={149} y2={90} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#lc-arr)" />
        <line x1={201} y1={90} x2={254} y2={90} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#lc-arr)" />
        <line x1={306} y1={90} x2={359} y2={90} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#lc-arr)" />

        {/* Enabled ⇄ Disabled */}
        <path d="M 411 84 Q 448 72 464 84" stroke="#3b82f6" strokeWidth={1}
          fill="none" markerEnd="url(#lc-arr)" />
        <path d="M 464 100 Q 448 108 411 100" stroke="#3b82f6" strokeWidth={1}
          fill="none" markerEnd="url(#lc-arr)" />

        {/* Failed edges */}
        <line x1={175} y1={116} x2={254} y2={170} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" markerEnd="url(#lc-arr)" />
        <line x1={280} y1={116} x2={280} y2={164} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" markerEnd="url(#lc-arr)" />

        {/* 상태 노드 */}
        {states.map(s => (
          <g key={s.name}>
            <circle cx={s.x} cy={s.y} r={26}
              fill={s.color} fillOpacity={0.15}
              stroke={s.color} strokeWidth={1.5} />
            <text x={s.x} y={s.y + 3} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={s.color}>{s.name}</text>
          </g>
        ))}

        {/* 헬스체크 */}
        <rect x={30} y={236} width={500} height={32} rx={6}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.5} />
        <text x={280} y={256} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">
          주기적 헬스체크 (5분) · unhealthy 시 자동 Disabled 전이
        </text>
      </svg>
    </div>
  );
}
