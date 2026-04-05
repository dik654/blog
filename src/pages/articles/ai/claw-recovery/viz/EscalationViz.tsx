export default function EscalationViz() {
  const levels = [
    { num: 1, label: 'Webhook', target: 'Slack/Discord', color: '#3b82f6' },
    { num: 2, label: 'Create Issue', target: 'GitHub/GitLab', color: '#f59e0b' },
    { num: 3, label: 'PagerDuty', target: '온콜 엔지니어', color: '#ef4444' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">에스컬레이션 — 점진적 Alert</text>

        {/* 계층 피라미드 */}
        {levels.map((level, i) => {
          const width = 450 - i * 90;
          const x = 55 + i * 45;
          const y = 60 + i * 56;
          return (
            <g key={level.num}>
              <rect x={x} y={y} width={width} height={46} rx={6}
                fill={level.color} fillOpacity={0.15} stroke={level.color} strokeWidth={1} />
              <text x={x + 22} y={y + 28} fontSize={14} fontWeight={700} fill={level.color}>
                L{level.num}
              </text>
              <text x={x + width / 2 + 22} y={y + 20} textAnchor="middle" fontSize={10.5}
                fontWeight={700} fill={level.color}>{level.label}</text>
              <text x={x + width / 2 + 22} y={y + 36} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{level.target}</text>
            </g>
          );
        })}

        {/* 트리거 조건 */}
        <text x={40} y={266} fontSize={10} fontWeight={700} fill="var(--foreground)">조건:</text>

        <g transform="translate(45, 275)">
          <text x={0} y={12} fontSize={9} fontWeight={600} fontFamily="monospace" fill="#3b82f6">L1:</text>
          <text x={30} y={12} fontSize={9} fill="var(--muted-foreground)">recipe 3회 실패</text>

          <text x={160} y={12} fontSize={9} fontWeight={600} fontFamily="monospace" fill="#f59e0b">L2:</text>
          <text x={190} y={12} fontSize={9} fill="var(--muted-foreground)">Lane 2시간 stuck</text>

          <text x={335} y={12} fontSize={9} fontWeight={600} fontFamily="monospace" fill="#ef4444">L3:</text>
          <text x={365} y={12} fontSize={9} fill="var(--muted-foreground)">CriticalFailure</text>
        </g>

        <text x={280} y={254} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">1시간 쿨다운 · 중복 알림 방지 · 템플릿 변수 지원</text>
      </svg>
    </div>
  );
}
