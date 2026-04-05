export default function SummaryFanInViz() {
  const extractors = [
    {
      name: 'extract_file_candidates',
      input: 'msgs',
      desc: '파일 경로 추출 (정규식)',
      example: '/src/auth.rs, /tests/…',
      color: '#3b82f6',
    },
    {
      name: 'infer_current_work',
      input: 'recent_msgs',
      desc: '현재 진행 작업 추론',
      example: '"auth.rs 디버깅 중"',
      color: '#8b5cf6',
    },
    {
      name: 'infer_pending_work',
      input: 'all_msgs',
      desc: 'TODO/FIXME 탐지',
      example: '"테스트 추가 예정"',
      color: '#f59e0b',
    },
    {
      name: 'tool_counts',
      input: 'msgs',
      desc: '도구별 호출 집계',
      example: 'Read:45 · Edit:12 · Bash:8',
      color: '#10b981',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">summarize_messages() — 4-branch fan-in</text>

        <defs>
          <marker id="sfi-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input */}
        <rect x={200} y={48} width={160} height={40} rx={6}
          fill="#94a3b8" fillOpacity={0.15} stroke="#94a3b8" strokeWidth={1.5} />
        <text x={280} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          old_messages
        </text>
        <text x={280} y={80} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          Vec&lt;Message&gt;
        </text>

        {/* Fan-out arrows to 4 extractors (targeting card centers) */}
        {[88, 224, 360, 496].map((x, i) => (
          <line key={i} x1={280} y1={88} x2={x} y2={112}
            stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#sfi-arr)" />
        ))}

        {/* 4 extractors in horizontal row */}
        {extractors.map((e, i) => {
          const x = 24 + i * 136;
          return (
            <g key={e.name}>
              <rect x={x} y={116} width={128} height={96} rx={6}
                fill={e.color} fillOpacity={0.12} stroke={e.color} strokeWidth={1.5} />
              {/* Left stripe */}
              <rect x={x} y={116} width={4} height={96} fill={e.color} rx={1} />
              {/* Function name */}
              <text x={x + 10} y={134} fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={e.color}>
                {e.name.length > 20 ? e.name.slice(0, 19) + '…' : e.name}
              </text>
              {/* Input param */}
              <text x={x + 10} y={148} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
                ({e.input})
              </text>
              {/* Description */}
              <text x={x + 10} y={168} fontSize={9} fill="var(--foreground)">
                {e.desc}
              </text>
              {/* Example value */}
              <rect x={x + 8} y={178} width={112} height={24} rx={3}
                fill="var(--muted)" opacity={0.5} />
              <text x={x + 14} y={194} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
                {e.example.length > 18 ? e.example.slice(0, 17) + '…' : e.example}
              </text>
            </g>
          );
        })}

        {/* Fan-in arrows from 4 extractors to Summary */}
        {[88, 224, 360, 496].map((x, i) => (
          <line key={i} x1={x} y1={212} x2={280} y2={256}
            stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#sfi-arr)" />
        ))}

        {/* Summary output */}
        <rect x={180} y={260} width={200} height={58} rx={6}
          fill="#ec4899" fillOpacity={0.15} stroke="#ec4899" strokeWidth={1.8} />
        <text x={280} y={280} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ec4899">
          Summary
        </text>
        <text x={280} y={295} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          {`{ scope, tools, timeline,`}
        </text>
        <text x={280} y={307} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          {`  file_candidates, ... }`}
        </text>

        {/* Bottom note */}
        <text x={280} y={342} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          4개 순수 함수가 병렬 추출 → Summary 구조체로 합류 (전역 상태 없음)
        </text>
      </svg>
    </div>
  );
}
