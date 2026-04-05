export default function PhaseTransitionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">compact_session() — 4단계 파이프라인</text>

        <defs>
          <marker id="pt-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* 4 phases horizontally */}
        {[
          { x: 30, label: 'Phase 1', title: 'Split', desc: 'old ↔ recent', color: '#3b82f6' },
          { x: 165, y: 0, label: 'Phase 2', title: 'Summarize', desc: 'LLM call', color: '#10b981' },
          { x: 300, label: 'Phase 3', title: 'Build', desc: 'new messages[]', color: '#f59e0b' },
          { x: 435, label: 'Phase 4', title: 'Swap', desc: 'atomic replace', color: '#ef4444' },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={50} width={100} height={90} rx={6}
              fill={p.color} fillOpacity={0.15} stroke={p.color} strokeWidth={1.8} />
            <text x={p.x + 50} y={72} textAnchor="middle" fontSize={10} fontWeight={600} fill={p.color}>
              {p.label}
            </text>
            <text x={p.x + 50} y={94} textAnchor="middle" fontSize={13} fontWeight={700} fill={p.color}>
              {p.title}
            </text>
            <text x={p.x + 50} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {p.desc}
            </text>
            {i < 3 && (
              <line x1={p.x + 100} y1={95} x2={p.x + 125} y2={95} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pt-arr)" />
            )}
          </g>
        ))}

        {/* Phase details */}
        <rect x={30} y={160} width={500} height={140} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={180} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          단계별 세부
        </text>

        <text x={50} y={205} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          <tspan fontWeight={700} fill="#3b82f6">Split:</tspan> messages[..split_idx] = old · messages[split_idx..] = recent (최근 N)
        </text>
        <text x={50} y={228} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          <tspan fontWeight={700} fill="#10b981">Summarize:</tspan> old을 LLM에 보내 scope · tools · timeline · todos 추출
        </text>
        <text x={50} y={251} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          <tspan fontWeight={700} fill="#f59e0b">Build:</tspan> [summary_msg, ...recent] 구성
        </text>
        <text x={50} y={274} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          <tspan fontWeight={700} fill="#ef4444">Swap:</tspan> session.messages = new_list (락 · atomic 교체 · 이벤트 발행)
        </text>
      </svg>
    </div>
  );
}
