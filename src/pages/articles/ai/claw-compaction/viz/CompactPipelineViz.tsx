import { ActionBox } from '@/components/viz/boxes';

export default function CompactPipelineViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 370" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">compact_session() 6단계 파이프라인</text>

        <defs>
          <marker id="cp-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          { label: '1. preserve_recent 분리', sub: '최근 N=15 메시지 보존', color: '#3b82f6' },
          { label: '2. system 메시지 격리', sub: 'Role::System 제외', color: '#8b5cf6' },
          { label: '3. summarize_messages()', sub: 'scope + tool_usage + timeline', color: '#f59e0b' },
          { label: '4. format_compact_summary()', sub: '<prior-context> XML 래핑', color: '#10b981' },
          { label: '5. 새 Session 조립', sub: 'system + summary + recent', color: '#3b82f6' },
          { label: '6. CompactionResult 반환', sub: 'compacted_session + meta', color: '#10b981' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={70} y={54 + i * 48} width={420} height={40} rx={6}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.8} />
            <rect x={70} y={54 + i * 48} width={4} height={40} fill={step.color} rx={1} />
            <text x={86} y={73 + i * 48} fontSize={11} fontWeight={700}
              fill={step.color}>{step.label}</text>
            <text x={86} y={87 + i * 48} fontSize={9}
              fill="var(--muted-foreground)">{step.sub}</text>
            {i < 5 && (
              <line x1={280} y1={94 + i * 48} x2={280} y2={102 + i * 48}
                stroke="#3b82f6" strokeWidth={1} markerEnd="url(#cp-arr)" />
            )}
          </g>
        ))}

        <text x={280} y={354} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">LLM 호출 없음 · 결정론적 · 수 ms 내 완료</text>
      </svg>
    </div>
  );
}
