export default function McpLifecycleViz() {
  const states = [
    'Uninitialized', 'Spawning', 'Spawned',
    'Initializing', 'Initialized', 'CapabilityListing',
    'Ready', 'Degraded', 'Disconnecting', 'Disconnected', 'Failed'
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 350" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">McpLifecycle — 11 상태 (linear progression)</text>

        <defs>
          <marker id="mlc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {states.slice(0, 7).map((state, i) => {
          const y = 58 + i * 32;
          const isReady = state === 'Ready';
          const color = isReady ? '#10b981' : '#3b82f6';
          return (
            <g key={state}>
              <rect x={46} y={y} width={234} height={26} rx={4}
                fill={color} fillOpacity={0.1} stroke={color} strokeWidth={0.6} />
              <rect x={46} y={y} width={3} height={26} fill={color} rx={1} />
              <text x={62} y={y + 18} fontSize={10} fontWeight={700} fill={color}>
                {i + 1}. {state}
              </text>
              {i < 6 && (
                <line x1={163} y1={y + 26} x2={163} y2={y + 32}
                  stroke="#3b82f6" strokeWidth={0.9} markerEnd="url(#mlc-arr)" />
              )}
            </g>
          );
        })}

        {/* Degraded */}
        <rect x={304} y={198} width={210} height={26} rx={4}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.6} />
        <rect x={304} y={198} width={3} height={26} fill="#f59e0b" rx={1} />
        <text x={320} y={216} fontSize={10} fontWeight={700} fill="#f59e0b">
          Degraded (일부 기능 실패)
        </text>
        <line x1={280} y1={211} x2={304} y2={211} stroke="#f59e0b" strokeWidth={0.9} strokeDasharray="3 2" markerEnd="url(#mlc-arr)" />

        {/* Failed */}
        <rect x={304} y={140} width={210} height={26} rx={4}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.6} />
        <rect x={304} y={140} width={3} height={26} fill="#ef4444" rx={1} />
        <text x={320} y={158} fontSize={10} fontWeight={700} fill="#ef4444">
          Failed (복구 불가)
        </text>
        <line x1={280} y1={94} x2={304} y2={153} stroke="#ef4444" strokeWidth={0.9} strokeDasharray="3 2" markerEnd="url(#mlc-arr)" />
        <line x1={280} y1={158} x2={304} y2={153} stroke="#ef4444" strokeWidth={0.9} strokeDasharray="3 2" markerEnd="url(#mlc-arr)" />

        {/* 종료 */}
        <rect x={46} y={284} width={468} height={52} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={306} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          종료 전이: Ready → Disconnecting → Disconnected
        </text>
        <text x={280} y={324} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          graceful shutdown: 대기 요청 완료 → shutdown 메시지 → 프로세스 종료
        </text>
      </svg>
    </div>
  );
}
