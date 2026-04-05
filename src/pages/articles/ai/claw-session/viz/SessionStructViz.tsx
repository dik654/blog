import { DataBox } from '@/components/viz/boxes';

export default function SessionStructViz() {
  const fields = [
    { label: 'id', type: 'SessionId', color: '#3b82f6' },
    { label: 'parent', type: 'Option<SessionId>', color: '#8b5cf6' },
    { label: 'messages', type: 'Vec<Message>', color: '#10b981' },
    { label: 'tool_calls', type: 'Vec<ToolCallLog>', color: '#10b981' },
    { label: 'permission_log', type: 'Vec<PermDecision>', color: '#ef4444' },
    { label: 'token_usage', type: 'TokenUsage', color: '#f59e0b' },
    { label: 'workspace_root', type: 'PathBuf', color: '#6b7280' },
    { label: 'started_at', type: 'DateTime<Utc>', color: '#6b7280' },
    { label: 'metadata', type: 'SessionMeta', color: '#6b7280' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 400" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Session 구조체 — 대화 상태의 단일 소스</text>

        {/* Session 박스 */}
        <rect x={90} y={54} width={380} height={330} rx={10}
          fill="var(--card)" stroke="#3b82f6" strokeWidth={1.5} />
        <rect x={90} y={54} width={380} height={34} rx={10}
          fill="#3b82f6" fillOpacity={0.15} />
        <text x={280} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          pub struct Session
        </text>

        {/* 필드들 */}
        {fields.map((field, i) => {
          const y = 104 + i * 30;
          return (
            <g key={field.label}>
              <rect x={104} y={y} width={352} height={26} rx={3}
                fill={field.color} fillOpacity={0.08} stroke={field.color} strokeWidth={0.5} />
              <rect x={104} y={y} width={4} height={26} fill={field.color} rx={1} />
              <text x={124} y={y + 17} fontSize={10.5} fontWeight={600} fill={field.color}>
                {field.label}
              </text>
              <text x={444} y={y + 17} textAnchor="end" fontSize={9.5} fontFamily="monospace"
                fill="var(--muted-foreground)">{field.type}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
