export default function MockScenariosViz() {
  const scenarios = [
    { name: 'StreamingText',        cat: 'stream',   desc: '단순 텍스트 SSE',         color: '#3b82f6' },
    { name: 'ReadFileRoundtrip',    cat: 'tool',     desc: '파일 읽기 도구 왕복',      color: '#10b981' },
    { name: 'BashPermissionPrompt', cat: 'perm',     desc: 'Bash 권한 프롬프트',       color: '#f59e0b' },
    { name: 'MultiToolParallel',    cat: 'tool',     desc: '병렬 도구 호출 3개',       color: '#10b981' },
    { name: 'McpToolCall',          cat: 'tool',     desc: 'MCP 경유 도구 호출',       color: '#10b981' },
    { name: 'SessionCompact',       cat: 'session',  desc: '세션 컴팩션',              color: '#8b5cf6' },
    { name: 'HookPreExec',          cat: 'perm',     desc: 'pre-exec 훅',             color: '#f59e0b' },
    { name: 'SubAgentSpawn',        cat: 'session',  desc: '서브에이전트 생성',        color: '#8b5cf6' },
    { name: 'ErrorRecovery',        cat: 'error',    desc: 'API 오류 → 복구',          color: '#ef4444' },
    { name: 'TokenLimitExceeded',   cat: 'error',    desc: '토큰 한도 초과',           color: '#ef4444' },
    { name: 'ToolResultTruncation', cat: 'tool',     desc: '도구 결과 절단',           color: '#10b981' },
    { name: 'ConversationFork',     cat: 'session',  desc: '대화 분기 & 되감기',       color: '#8b5cf6' },
  ];

  const catLabels: Record<string, { label: string; color: string }> = {
    stream:  { label: 'Streaming', color: '#3b82f6' },
    tool:    { label: 'Tool Use',  color: '#10b981' },
    perm:    { label: 'Permission/Hook', color: '#f59e0b' },
    session: { label: 'Session',   color: '#8b5cf6' },
    error:   { label: 'Error Path', color: '#ef4444' },
  };

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">mock-anthropic-service — 12 결정론적 시나리오</text>

        {/* 12 scenarios in 4×3 grid */}
        {scenarios.map((s, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 24 + col * 134;
          const y = 50 + row * 78;
          return (
            <g key={i}>
              <rect x={x} y={y} width={126} height={68} rx={6}
                fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1.4} />
              <rect x={x} y={y} width={3} height={68} fill={s.color} rx={1} />
              {/* Index */}
              <circle cx={x + 16} cy={y + 16} r={9} fill={s.color} fillOpacity={0.25} stroke={s.color} strokeWidth={1} />
              <text x={x + 16} y={y + 20} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>
                {i + 1}
              </text>
              {/* Scenario name */}
              <text x={x + 28} y={y + 20} fontSize={8.5} fontWeight={700} fontFamily="monospace" fill={s.color}>
                {s.name.length > 17 ? s.name.slice(0, 16) + '…' : s.name}
              </text>
              {/* Separator */}
              <line x1={x + 8} y1={y + 30} x2={x + 118} y2={y + 30} stroke={s.color} strokeWidth={0.5} opacity={0.4} />
              {/* Description */}
              <text x={x + 10} y={y + 46} fontSize={9} fill="var(--foreground)">
                {s.desc}
              </text>
              {/* Category badge */}
              <rect x={x + 8} y={y + 52} width={72} height={12} rx={6}
                fill={catLabels[s.cat].color} fillOpacity={0.2} stroke={catLabels[s.cat].color} strokeWidth={0.6} />
              <text x={x + 44} y={y + 61} textAnchor="middle" fontSize={8}
                fontWeight={700} fill={catLabels[s.cat].color}>
                {catLabels[s.cat].label}
              </text>
            </g>
          );
        })}

        {/* Category legend */}
        <rect x={24} y={292} width={512} height={72} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={36} y={310} fontSize={10} fontWeight={700} fill="var(--foreground)">
          카테고리별 시나리오 수
        </text>
        {Object.entries(catLabels).map(([key, val], i) => {
          const count = scenarios.filter(s => s.cat === key).length;
          const x = 36 + i * 100;
          return (
            <g key={key} transform={`translate(${x}, 322)`}>
              <rect x={0} y={0} width={92} height={30} rx={4}
                fill={val.color} fillOpacity={0.12} stroke={val.color} strokeWidth={1} />
              <text x={10} y={14} fontSize={9} fontWeight={700} fill={val.color}>
                {val.label}
              </text>
              <text x={10} y={25} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {count}개 시나리오
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
