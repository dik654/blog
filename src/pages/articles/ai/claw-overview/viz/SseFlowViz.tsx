export default function SseFlowViz() {
  const events = [
    { label: 'message_start', color: '#3b82f6' },
    { label: 'content_block_start', color: '#8b5cf6' },
    { label: 'content_block_delta', color: '#10b981', repeat: true },
    { label: 'content_block_stop', color: '#8b5cf6' },
    { label: 'message_delta', color: '#f59e0b' },
    { label: 'message_stop', color: '#3b82f6' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SSE 프레임 순서 — Anthropic Streaming</text>

        <defs>
          <marker id="sse-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 타임라인 */}
        <line x1={50} y1={70} x2={510} y2={70} stroke="var(--foreground)" strokeWidth={1} />

        {events.map((event, i) => {
          const x = 70 + i * 76;
          return (
            <g key={event.label}>
              <circle cx={x} cy={70} r={5} fill={event.color} />
              {event.repeat && (
                <>
                  <circle cx={x + 14} cy={70} r={3} fill={event.color} opacity={0.5} />
                  <circle cx={x + 24} cy={70} r={2} fill={event.color} opacity={0.3} />
                  <text x={x + 12} y={56} fontSize={8.5} fill={event.color}>× N</text>
                </>
              )}
              <text x={x} y={92} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={event.color} transform={`rotate(30 ${x} 92)`}>{event.label}</text>
            </g>
          );
        })}

        {/* 화살표 (진행 방향) */}
        <line x1={510} y1={70} x2={520} y2={70} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#sse-arr)" />

        {/* 각 이벤트 데이터 예시 */}
        <rect x={40} y={160} width={480} height={95} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={180} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">content_block_delta 예시</text>

        <rect x={55} y={192} width={450} height={54} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={68} y={210} fontSize={9} fontFamily="monospace" fill="#8b5cf6">event: content_block_delta</text>
        <text x={68} y={226} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          data: &#123;"type":"content_block_delta","index":0,
        </text>
        <text x={88} y={240} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          "delta":&#123;"type":"text_delta","text":"hello"&#125;&#125;
        </text>

        <text x={280} y={280} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">
          델타마다 텍스트 1조각 → UI는 즉시 렌더링 (스트리밍 경험)
        </text>
      </svg>
    </div>
  );
}
