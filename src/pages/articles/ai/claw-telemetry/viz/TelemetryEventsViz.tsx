export default function TelemetryEventsViz() {
  const events = [
    { name: 'SessionStart',     cat: 'session', fields: 'session_id · workspace',               color: '#3b82f6' },
    { name: 'SessionEnd',       cat: 'session', fields: 'session_id · duration · stats',        color: '#3b82f6' },
    { name: 'ToolCall',         cat: 'tool',    fields: 'name · success · duration_ms',         color: '#10b981' },
    { name: 'ToolError',        cat: 'tool',    fields: 'name · error',                         color: '#10b981' },
    { name: 'LlmRequest',       cat: 'llm',     fields: 'model · input_tokens · output_tokens', color: '#8b5cf6' },
    { name: 'LlmError',         cat: 'llm',     fields: 'model · error · status_code',          color: '#8b5cf6' },
    { name: 'PermissionCheck',  cat: 'gate',    fields: 'tool · result',                        color: '#f59e0b' },
    { name: 'HookExecution',    cat: 'gate',    fields: 'hook · success · duration_ms',         color: '#f59e0b' },
    { name: 'CompactionEvent',  cat: 'mem',     fields: 'removed · token_savings',              color: '#ec4899' },
    { name: 'Custom',           cat: 'ext',     fields: 'name · payload: Value',                color: '#6b7280' },
  ];

  const catLabels: Record<string, string> = {
    session: 'Session',
    tool: 'Tool',
    llm: 'LLM',
    gate: 'Permission/Hook',
    mem: 'Memory',
    ext: 'Extension',
  };

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 430" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">TelemetryEvent — 10종 표준 이벤트</text>

        {/* Event cards — 2 columns × 5 rows */}
        {events.map((e, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 24 + col * 264;
          const y = 44 + row * 72;
          return (
            <g key={i}>
              <rect x={x} y={y} width={256} height={62} rx={6}
                fill={e.color} fillOpacity={0.1} stroke={e.color} strokeWidth={1.4} />
              <rect x={x} y={y} width={4} height={62} fill={e.color} rx={1} />

              {/* Event name (monospace) */}
              <text x={x + 14} y={y + 20} fontSize={11} fontWeight={700} fontFamily="monospace" fill={e.color}>
                {e.name}
              </text>

              {/* Category badge */}
              <rect x={x + 174} y={y + 8} width={74} height={16} rx={8}
                fill={e.color} fillOpacity={0.25} stroke={e.color} strokeWidth={0.8} />
              <text x={x + 211} y={y + 19} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={e.color}>
                {catLabels[e.cat]}
              </text>

              {/* Payload fields */}
              <text x={x + 14} y={y + 38} fontSize={9} fill="var(--muted-foreground)">
                payload:
              </text>
              <text x={x + 14} y={y + 52} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                {e.fields.length > 36 ? e.fields.slice(0, 34) + '…' : e.fields}
              </text>
            </g>
          );
        })}

        {/* Bottom insight */}
        <rect x={24} y={412} width={512} height={12} rx={3}
          fill="var(--muted)" opacity={0.4} />
        <text x={36} y={422} fontSize={9} fill="var(--muted-foreground)">
          enum variant별 타입 안전 payload — 추가 시 컴파일러가 match 누락 경고
        </text>
      </svg>
    </div>
  );
}
