export default function AgentSelectionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Agent Selection — 태스크별 &quot;베스트11&quot;</text>

        <defs>
          <marker id="as-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Task input */}
        <rect x={160} y={46} width={240} height={38} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={65} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          &quot;Find auth bugs&quot;
        </text>
        <text x={280} y={78} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          User task
        </text>

        <line x1={280} y1={86} x2={280} y2={100} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#as-arr)" />

        {/* Selection process */}
        <rect x={80} y={102} width={400} height={48} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={280} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          1. Task Analysis → Tag extraction
        </text>
        <text x={280} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          tags: [search, code, auth, bug-find]
        </text>

        <line x1={280} y1={152} x2={280} y2={168} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#as-arr)" />

        {/* Matching */}
        <rect x={80} y={170} width={400} height={48} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={280} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          2. Match against available agents
        </text>
        <text x={280} y={208} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          agents.filter(a =&gt; a.tags.contains_any(task.tags))
        </text>

        <line x1={280} y1={220} x2={280} y2={236} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#as-arr)" />

        {/* Candidates */}
        <rect x={80} y={238} width={400} height={58} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={280} y={260} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          3. Rank + select top N (&quot;Best 7~11&quot;)
        </text>
        <text x={280} y={276} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          score = tag_match × 0.6 + domain_fit × 0.3 + recent_success × 0.1
        </text>
        <text x={280} y={290} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          [Explore(0.92), code-guide(0.81), Plan(0.74), ...]
        </text>

        {/* Footer - concept */}
        <rect x={80} y={304} width={400} height={28} rx={5}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={322} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          수백개 agents 중 태스크에 맞는 소수만 활성화 (축구 &quot;베스트11&quot; 개념)
        </text>
      </svg>
    </div>
  );
}
