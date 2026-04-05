export default function EscalationTemplateVarsViz() {
  const groups = [
    {
      name: 'Identity',
      color: '#3b82f6',
      vars: [
        { name: 'lane',   desc: 'Lane ID' },
        { name: 'branch', desc: '브랜치 이름' },
      ],
    },
    {
      name: 'Failure',
      color: '#ef4444',
      vars: [
        { name: 'failure',  desc: '실패 분류' },
        { name: 'recipe',   desc: '마지막 레시피' },
        { name: 'attempts', desc: '재시도 횟수' },
      ],
    },
    {
      name: 'Output',
      color: '#f59e0b',
      vars: [
        { name: 'stdout', desc: 'stdout (trunc)' },
        { name: 'stderr', desc: 'stderr' },
      ],
    },
    {
      name: 'Links',
      color: '#8b5cf6',
      vars: [
        { name: 'url.ci', desc: 'CI 실행 URL' },
        { name: 'url.pr', desc: 'PR URL' },
      ],
    },
    {
      name: 'Metrics',
      color: '#10b981',
      vars: [
        { name: 'coverage',   desc: '테스트 커버리지' },
        { name: 'time_since', desc: '상태 경과 시간' },
      ],
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">에스컬레이션 템플릿 변수 — 11개 {`{{var}}`}</text>

        {/* 5 group columns */}
        {groups.map((g, gi) => {
          const x = 16 + gi * 108;
          const width = 104;
          return (
            <g key={gi}>
              {/* Group header */}
              <rect x={x} y={44} width={width} height={26} rx={5}
                fill={g.color} fillOpacity={0.18} stroke={g.color} strokeWidth={1.5} />
              <text x={x + width / 2} y={61} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={g.color}>
                {g.name}
              </text>

              {/* Variable cards in this group */}
              {g.vars.map((v, vi) => {
                const y = 80 + vi * 66;
                return (
                  <g key={vi}>
                    <rect x={x} y={y} width={width} height={56} rx={5}
                      fill={g.color} fillOpacity={0.08} stroke={g.color} strokeWidth={1} />
                    <rect x={x} y={y} width={3} height={56} fill={g.color} rx={1} />

                    {/* Variable name (monospace, braces style) */}
                    <rect x={x + 8} y={y + 8} width={width - 16} height={18} rx={3}
                      fill="var(--muted)" opacity={0.6} />
                    <text x={x + width / 2} y={y + 21} textAnchor="middle" fontSize={9}
                      fontWeight={700} fontFamily="monospace" fill={g.color}>
                      {`{{${v.name}}}`}
                    </text>

                    {/* Description */}
                    <text x={x + 8} y={y + 40} fontSize={8.5} fill="var(--foreground)">
                      {v.desc}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Bottom example */}
        <rect x={16} y={280} width={528} height={46} rx={6}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={26} y={297} fontSize={9.5} fontWeight={700} fill="var(--foreground)">
          템플릿 예시:
        </text>
        <text x={26} y={312} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          {`"⚠️ Lane {{lane}} stuck: {{failure}} after {{attempts}} retries.`}
        </text>
        <text x={26} y={324} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          {` See {{url.ci}} for logs."`}
        </text>
      </svg>
    </div>
  );
}
