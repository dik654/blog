export default function ChunkEnumViz() {
  const chunks = [
    { name: 'MessageStart',       fields: 'id · model',               phase: 'start',   color: '#3b82f6' },
    { name: 'ContentBlockStart',  fields: 'index · block: ContentBlock', phase: 'block',  color: '#8b5cf6' },
    { name: 'ContentBlockDelta',  fields: 'index · delta: Delta',     phase: 'stream',  color: '#10b981' },
    { name: 'ContentBlockStop',   fields: 'index',                    phase: 'block',   color: '#8b5cf6' },
    { name: 'MessageDelta',       fields: 'stop_reason · usage',      phase: 'meta',    color: '#f59e0b' },
    { name: 'MessageStop',        fields: '(unit)',                   phase: 'end',     color: '#ef4444' },
  ];

  const phaseLabels: Record<string, string> = {
    start: '시작',
    block: '블록 생명',
    stream: '스트리밍',
    meta: '메타',
    end: '종료',
  };

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Chunk enum — SSE 통합 6 variants</text>

        <text x={280} y={40} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Anthropic SSE 구조 기반, OpenAI는 변환 레이어가 매핑
        </text>

        <defs>
          <marker id="ce-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Sequence arrow at top */}
        <line x1={30} y1={70} x2={530} y2={70} stroke="var(--border)" strokeWidth={1.5} />
        <polygon points="530,66 538,70 530,74" fill="var(--border)" />
        <text x={30} y={62} fontSize={9} fill="var(--muted-foreground)">time →</text>

        {chunks.map((c, i) => {
          const y = 80 + i * 42;
          return (
            <g key={i}>
              <rect x={24} y={y} width={512} height={34} rx={5}
                fill={c.color} fillOpacity={0.1} stroke={c.color} strokeWidth={1.3} />
              <rect x={24} y={y} width={4} height={34} fill={c.color} rx={1} />

              {/* Index */}
              <circle cx={44} cy={y + 17} r={10} fill={c.color} fillOpacity={0.25} stroke={c.color} strokeWidth={1} />
              <text x={44} y={y + 21} textAnchor="middle" fontSize={10} fontWeight={700} fill={c.color}>
                {i + 1}
              </text>

              {/* Variant name */}
              <text x={62} y={y + 21} fontSize={11} fontWeight={700} fontFamily="monospace" fill={c.color}>
                {c.name}
              </text>

              {/* Fields */}
              <text x={240} y={y + 14} fontSize={8.5} fill="var(--muted-foreground)" fontWeight={700}>
                FIELDS
              </text>
              <text x={240} y={y + 27} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                {c.fields}
              </text>

              {/* Phase badge */}
              <rect x={442} y={y + 8} width={84} height={18} rx={9}
                fill={c.color} fillOpacity={0.25} stroke={c.color} strokeWidth={0.8} />
              <text x={484} y={y + 21} textAnchor="middle" fontSize={9} fontWeight={700} fill={c.color}>
                {phaseLabels[c.phase]}
              </text>
            </g>
          );
        })}

      </svg>
    </div>
  );
}
