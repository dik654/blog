export default function HeuristicFilterViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SummaryCompressor — 5가지 휴리스틱 필터 (funnel)</text>

        <defs>
          <marker id="hf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input */}
        <rect x={200} y={42} width={160} height={32} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          messages (pre-filter)
        </text>

        <line x1={280} y1={74} x2={280} y2={90} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#hf-arr)" />

        {/* 5 Filters as funnel — centered, narrowing */}
        {[
          { y: 94, w: 460, name: 'F1: drop tool_results > 10KB', desc: '큰 tool 출력 제거', color: '#ef4444' },
          { y: 140, w: 410, name: 'F2: dedupe identical tool_calls', desc: '중복 도구 호출 병합', color: '#f59e0b' },
          { y: 186, w: 360, name: 'F3: truncate image blocks', desc: '이미지 메타데이터만', color: '#10b981' },
          { y: 232, w: 310, name: 'F4: drop failed tool attempts', desc: '실패한 시도 제거', color: '#06b6d4' },
          { y: 278, w: 260, name: 'F5: compact nearby user msgs', desc: '인접 사용자 메시지 결합', color: '#8b5cf6' },
        ].map((f, i) => {
          const x = 280 - f.w / 2;
          return (
            <g key={i}>
              <rect x={x} y={f.y} width={f.w} height={32} rx={5}
                fill={f.color} fillOpacity={0.15} stroke={f.color} strokeWidth={1.4} />
              <text x={x + 12} y={f.y + 20} fontSize={9.5} fontWeight={700} fill={f.color}>
                {f.name}
              </text>
              <text x={x + f.w - 12} y={f.y + 20} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {f.desc}
              </text>
              {i < 4 && (
                <line x1={280} y1={f.y + 32} x2={280} y2={f.y + 40} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#hf-arr)" />
              )}
            </g>
          );
        })}

        {/* Output */}
        <line x1={280} y1={310} x2={280} y2={322} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#hf-arr)" />
        <rect x={210} y={324} width={140} height={26} rx={5}
          fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={1.8} />
        <text x={280} y={342} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          compressed messages
        </text>
      </svg>
    </div>
  );
}
