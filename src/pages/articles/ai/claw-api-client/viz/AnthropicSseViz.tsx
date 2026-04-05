export default function AnthropicSseViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Anthropic SSE 파싱 파이프라인</text>

        <defs>
          <marker id="as-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          { label: 'reqwest::Response', sub: 'bytes_stream()', color: '#8b5cf6' },
          { label: 'BytesMut buffer', sub: '바이트 누적', color: '#3b82f6' },
          { label: 'find_double_newline', sub: '이벤트 경계 탐색', color: '#f59e0b' },
          { label: 'parse_sse_event', sub: 'event + data 추출', color: '#10b981' },
          { label: 'convert_anthropic_event', sub: 'Chunk enum으로 변환', color: '#ef4444' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={45} y={54 + i * 40} width={470} height={34} rx={4}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.7} />
            <rect x={45} y={54 + i * 40} width={3} height={34} fill={step.color} rx={1} />
            <text x={62} y={75 + i * 40} fontSize={11} fontWeight={700} fill={step.color}>
              {step.label}
            </text>
            <text x={502} y={75 + i * 40} textAnchor="end" fontSize={9} fontFamily="monospace"
              fill="var(--muted-foreground)">{step.sub}</text>
            {i < 4 && (
              <line x1={280} y1={88 + i * 40} x2={280} y2={94 + i * 40}
                stroke="#3b82f6" strokeWidth={1.1} markerEnd="url(#as-arr)" />
            )}
          </g>
        ))}

        <text x={280} y={268} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">부분 수신 시 버퍼에 유지 · 완전한 이벤트만 추출</text>
      </svg>
    </div>
  );
}
