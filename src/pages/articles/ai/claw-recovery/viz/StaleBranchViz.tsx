export default function StaleBranchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Stale Branch — 3가지 탐지 기준 &amp; 4가지 액션</text>

        {/* 탐지 기준 */}
        <text x={280} y={54} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          탐지 기준
        </text>

        <g transform="translate(30, 64)">
          {[
            { label: 'NoActivity', sub: '> 7일', color: '#f59e0b' },
            { label: 'LargeDrift', sub: '> 100 commits', color: '#8b5cf6' },
            { label: 'TooManyFailures', sub: '>= 5회', color: '#ef4444' },
          ].map((c, i) => (
            <g key={c.label} transform={`translate(${i * 168}, 0)`}>
              <rect x={0} y={0} width={160} height={48} rx={6}
                fill={c.color} fillOpacity={0.1} stroke={c.color} strokeWidth={0.8} />
              <text x={80} y={22} textAnchor="middle" fontSize={10.5} fontWeight={700}
                fill={c.color}>{c.label}</text>
              <text x={80} y={37} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{c.sub}</text>
            </g>
          ))}
        </g>

        {/* 액션 */}
        <text x={280} y={148} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          액션 매핑
        </text>

        {[
          { detect: 'NoActivity (<14일)', action: 'NotifyOwner', color: '#3b82f6' },
          { detect: 'NoActivity (≥14일)', action: 'AbandonLane', color: '#ef4444' },
          { detect: 'LargeDrift', action: 'RefreshBranch (rebase)', color: '#f59e0b' },
          { detect: 'TooManyFailures', action: 'AbandonLane', color: '#ef4444' },
          { detect: 'ExplicitAbandoned', action: 'ArchiveBranch (tag)', color: '#6b7280' },
        ].map((m, i) => {
          const y = 160 + i * 24;
          return (
            <g key={i}>
              <rect x={30} y={y} width={500} height={20} rx={3}
                fill={m.color} fillOpacity={0.05} stroke={m.color} strokeWidth={0.3} />
              <text x={46} y={14 + y} fontSize={9} fontWeight={600} fill={m.color}>
                {m.detect}
              </text>
              <text x={516} y={14 + y} textAnchor="end" fontSize={9} fontFamily="monospace"
                fill="var(--foreground)">→ {m.action}</text>
            </g>
          );
        })}

        <text x={280} y={298} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">1시간 주기 스캔 · 태그 백업 후 삭제 (복구 가능)</text>
      </svg>
    </div>
  );
}
