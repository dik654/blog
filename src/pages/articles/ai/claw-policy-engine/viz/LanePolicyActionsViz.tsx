export default function LanePolicyActionsViz() {
  const states = [
    { name: 'Initialized',   desc: '초기화 완료',         color: '#6b7280' },
    { name: 'InProgress',    desc: '작업 중',             color: '#3b82f6' },
    { name: 'Blocked',       desc: '+ BlockReason',       color: '#ef4444' },
    { name: 'Testing',       desc: 'CI 실행 중',          color: '#f59e0b' },
    { name: 'ReadyToMerge',  desc: '머지 대기',           color: '#8b5cf6' },
    { name: 'Merged',        desc: '머지 완료',           color: '#10b981' },
    { name: 'Abandoned',     desc: '폐기됨',              color: '#6b7280' },
  ];

  const actions = [
    { name: 'Transition',   arg: '(LaneStatus)',       desc: '상태 변경',        color: '#3b82f6' },
    { name: 'SpawnLane',    arg: '(TaskPacket)',       desc: '새 Lane 생성',     color: '#8b5cf6' },
    { name: 'MergeBranch',  arg: '',                    desc: '브랜치 머지',      color: '#10b981' },
    { name: 'AbandonLane',  arg: '(reason)',           desc: 'Lane 폐기',        color: '#ef4444' },
    { name: 'Notify',       arg: '(target)',           desc: '알림 전송',        color: '#06b6d4' },
    { name: 'RunCommand',   arg: '(cmd)',              desc: '임의 명령',        color: '#f59e0b' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 440" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">LaneStatus (7) → PolicyAction (6)</text>

        {/* Left column header */}
        <rect x={24} y={44} width={220} height={28} rx={5}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={134} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          LaneStatus — 7 states
        </text>

        {/* Right column header */}
        <rect x={316} y={44} width={220} height={28} rx={5}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={426} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          PolicyAction — 6 verbs
        </text>

        {/* State cards (left) */}
        {states.map((s, i) => {
          const y = 86 + i * 44;
          return (
            <g key={i}>
              <rect x={24} y={y} width={220} height={36} rx={5}
                fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1} />
              <rect x={24} y={y} width={3} height={36} fill={s.color} rx={1} />
              {/* Index badge */}
              <circle cx={40} cy={y + 18} r={9} fill={s.color} fillOpacity={0.25} stroke={s.color} strokeWidth={0.8} />
              <text x={40} y={y + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>
                {i + 1}
              </text>
              <text x={54} y={y + 16} fontSize={10} fontWeight={700} fontFamily="monospace" fill={s.color}>
                {s.name}
              </text>
              <text x={54} y={y + 29} fontSize={9} fill="var(--muted-foreground)">
                {s.desc}
              </text>
            </g>
          );
        })}

        {/* Action cards (right) */}
        {actions.map((a, i) => {
          const y = 86 + i * 44;
          return (
            <g key={i}>
              <rect x={316} y={y} width={220} height={36} rx={5}
                fill={a.color} fillOpacity={0.1} stroke={a.color} strokeWidth={1} />
              <rect x={316} y={y} width={3} height={36} fill={a.color} rx={1} />
              {/* Index */}
              <circle cx={332} cy={y + 18} r={9} fill={a.color} fillOpacity={0.25} stroke={a.color} strokeWidth={0.8} />
              <text x={332} y={y + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={a.color}>
                {i + 1}
              </text>
              <text x={346} y={y + 16} fontSize={10} fontWeight={700} fontFamily="monospace" fill={a.color}>
                {a.name}
                <tspan fontSize={8.5} fill="var(--muted-foreground)" fontWeight={400}> {a.arg}</tspan>
              </text>
              <text x={346} y={y + 29} fontSize={9} fill="var(--muted-foreground)">
                {a.desc}
              </text>
            </g>
          );
        })}

        {/* Bottom connector hint */}
        <rect x={24} y={402} width={512} height={26} rx={4}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={36} y={420} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          PolicyRule: condition (state match) → action (Transition | Spawn | Merge ...)
        </text>
      </svg>
    </div>
  );
}
