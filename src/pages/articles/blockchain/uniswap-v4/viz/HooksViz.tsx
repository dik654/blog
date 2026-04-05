export default function HooksViz() {
  const events = [
    { name: 'initialize', color: '#8b5cf6' },
    { name: 'addLiquidity', color: '#10b981' },
    { name: 'removeLiquidity', color: '#f59e0b' },
    { name: 'swap', color: '#3b82f6' },
    { name: 'donate', color: '#ec4899' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">10개 Hook 포인트 — 5 이벤트 × Pre/Post</text>

        {/* 헤더 */}
        <rect x={40} y={42} width={120} height={24} rx={4}
          fill="var(--muted)" opacity={0.5} />
        <text x={100} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          Event
        </text>
        <rect x={170} y={42} width={160} height={24} rx={4}
          fill="#3b82f6" fillOpacity={0.15} />
        <text x={250} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          Pre (before) — 차단 가능
        </text>
        <rect x={340} y={42} width={160} height={24} rx={4}
          fill="#10b981" fillOpacity={0.15} />
        <text x={420} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          Post (after) — 후처리
        </text>

        {/* 이벤트 행 */}
        {events.map((e, i) => {
          const y = 78 + i * 44;
          return (
            <g key={i}>
              <rect x={40} y={y} width={120} height={36} rx={4}
                fill={e.color} fillOpacity={0.1} stroke={e.color} strokeWidth={0.6} />
              <text x={100} y={y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={e.color}>
                {e.name}
              </text>

              <rect x={170} y={y} width={160} height={36} rx={4}
                fill="var(--card)" stroke="#3b82f6" strokeWidth={0.6} />
              <text x={250} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">
                before{e.name.charAt(0).toUpperCase() + e.name.slice(1)}
              </text>

              <rect x={340} y={y} width={160} height={36} rx={4}
                fill="var(--card)" stroke="#10b981" strokeWidth={0.6} />
              <text x={420} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
                after{e.name.charAt(0).toUpperCase() + e.name.slice(1)}
              </text>
            </g>
          );
        })}

        {/* 하단 설명 */}
        <rect x={20} y={306} width={480} height={28} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={325} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          5 이벤트 × 2 훅 = 총 10개 hook 포인트
        </text>
      </svg>
    </div>
  );
}
