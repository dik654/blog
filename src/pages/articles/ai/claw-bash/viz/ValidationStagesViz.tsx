export default function ValidationStagesViz() {
  const stages = [
    { num: 1, label: 'check_empty', cost: 'O(n)', speed: '빠름', color: '#10b981' },
    { num: 2, label: 'check_length', cost: 'O(1)', speed: '즉시', color: '#10b981' },
    { num: 3, label: 'check_banned_patterns', cost: 'O(n)', speed: '빠름', color: '#3b82f6' },
    { num: 4, label: 'classify_intent', cost: 'O(n)', speed: '빠름', color: '#8b5cf6' },
    { num: 5, label: 'check_working_dir', cost: 'fs 호출', speed: '느림', color: '#f59e0b' },
    { num: 6, label: 'check_resource_limits', cost: 'O(1)', speed: '즉시', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">BashValidator — 6단계 (빠른 것 먼저)</text>

        {/* 헤더 */}
        <rect x={20} y={48} width={520} height={28} fill="var(--muted)" rx={4} />
        <text x={70} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">단계</text>
        <text x={230} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">검증</text>
        <text x={400} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">비용</text>
        <text x={490} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">속도</text>

        {stages.map((s, i) => {
          const y = 84 + i * 36;
          return (
            <g key={s.num}>
              <rect x={20} y={y} width={520} height={30} rx={4}
                fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
              <rect x={20} y={y} width={3} height={30} fill={s.color} rx={1} />

              <circle cx={70} cy={y + 15} r={12}
                fill={s.color} fillOpacity={0.2} stroke={s.color} strokeWidth={1} />
              <text x={70} y={y + 19} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={s.color}>{s.num}</text>

              <text x={230} y={y + 19} textAnchor="middle" fontSize={10} fontFamily="monospace"
                fontWeight={600} fill="var(--foreground)">{s.label}</text>

              <text x={400} y={y + 19} textAnchor="middle" fontSize={9} fontFamily="monospace"
                fill="var(--muted-foreground)">{s.cost}</text>

              <text x={490} y={y + 19} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={s.color}>{s.speed}</text>
            </g>
          );
        })}

        <text x={280} y={318} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">전체 실행 ~0.1ms (fs 호출 있을 때 ~1ms)</text>
      </svg>
    </div>
  );
}
