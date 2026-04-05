export default function ToolCategoriesViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 500" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">40개 빌트인 도구 — 10 카테고리 × 권한</text>

        {/* Legend */}
        <g transform="translate(40, 40)">
          <rect x={0} y={0} width={14} height={14} rx={2} fill="#10b981" fillOpacity={0.5} stroke="#10b981" strokeWidth={1} />
          <text x={18} y={11} fontSize={10} fill="var(--muted-foreground)">R (ReadOnly)</text>
          <rect x={130} y={0} width={14} height={14} rx={2} fill="#f59e0b" fillOpacity={0.5} stroke="#f59e0b" strokeWidth={1} />
          <text x={148} y={11} fontSize={10} fill="var(--muted-foreground)">W (WorkspaceWrite)</text>
          <rect x={300} y={0} width={14} height={14} rx={2} fill="#ef4444" fillOpacity={0.5} stroke="#ef4444" strokeWidth={1} />
          <text x={318} y={11} fontSize={10} fill="var(--muted-foreground)">D (DangerFullAccess)</text>
        </g>

        {/* Categories: 10 rows with spacing */}
        {[
          { name: '파일 I/O', tools: 'read_file, write_file, edit_file', perms: ['R','W','W'] },
          { name: '검색', tools: 'glob_search, grep_search', perms: ['R','R'] },
          { name: '실행', tools: 'bash, PowerShell, REPL, Sleep', perms: ['D','D','D','D'] },
          { name: 'UI', tools: 'SendUserMsg, Config, EnterPlanMode, Exit', perms: ['R','R','R','R'] },
          { name: '태스크', tools: 'TaskCreate/Get/List/Stop/Update/Output', perms: ['R','R','R','R','R','R'] },
          { name: '팀', tools: 'TeamCreate, TeamList, TeamDelete', perms: ['R','R','R'] },
          { name: '크론', tools: 'CronList, CronCreate, CronDelete', perms: ['R','R','R'] },
          { name: '원격', tools: 'RemoteTrigger', perms: ['D'] },
          { name: 'Agent', tools: 'Agent, Skill, ToolSearch', perms: ['D','R','R'] },
          { name: '노트북', tools: 'NotebookEdit', perms: ['W'] },
        ].map((cat, i) => {
          const y = 74 + i * 38;
          return (
            <g key={i}>
              <rect x={30} y={y} width={90} height={28} rx={4}
                fill="var(--muted)" opacity={0.5} stroke="var(--border)" strokeWidth={0.5} />
              <text x={75} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                {cat.name}
              </text>
              <text x={128} y={y + 18} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
                {cat.tools}
              </text>
              {cat.perms.map((p, pi) => (
                <g key={pi}>
                  <rect x={470 + pi * 12} y={y + 6} width={10} height={16} rx={2}
                    fill={p === 'R' ? '#10b981' : p === 'W' ? '#f59e0b' : '#ef4444'}
                    fillOpacity={0.5}
                    stroke={p === 'R' ? '#10b981' : p === 'W' ? '#f59e0b' : '#ef4444'}
                    strokeWidth={0.7} />
                  <text x={475 + pi * 12} y={y + 18} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={p === 'R' ? '#10b981' : p === 'W' ? '#f59e0b' : '#ef4444'}>
                    {p}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
