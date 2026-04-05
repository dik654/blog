export default function OrchestrationOverviewViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Multi-Agent Orchestration 구조</text>

        <defs>
          <marker id="oo-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* User / Main Conversation */}
        <rect x={200} y={50} width={160} height={46} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Main Conversation
        </text>
        <text x={280} y={88} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          user 대화 + coordinator
        </text>

        <line x1={280} y1={96} x2={280} y2={112} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#oo-arr)" />

        {/* Team Lead */}
        <rect x={180} y={114} width={200} height={60} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={2} />
        <text x={280} y={135} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          Team Lead (Coordinator)
        </text>
        <text x={280} y={151} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          task decomposition · routing
        </text>
        <text x={280} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Agent tool (spawn subagents)
        </text>

        {/* Spawn lines to workers */}
        <line x1={210} y1={174} x2={80} y2={215} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#oo-arr)" />
        <line x1={240} y1={174} x2={165} y2={215} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#oo-arr)" />
        <line x1={280} y1={174} x2={280} y2={215} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#oo-arr)" />
        <line x1={320} y1={174} x2={395} y2={215} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#oo-arr)" />
        <line x1={350} y1={174} x2={480} y2={215} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#oo-arr)" />

        {/* Workers (Sub-agents) — wider boxes */}
        {[
          { x: 30, name: 'Explore', desc: 'search codebase' },
          { x: 130, name: 'Plan', desc: 'design impl' },
          { x: 230, name: 'general', desc: 'multi-step' },
          { x: 330, name: 'Code-guide', desc: 'docs lookup' },
          { x: 430, name: 'statusline', desc: 'config util' },
        ].map((w, i) => (
          <g key={i}>
            <rect x={w.x} y={218} width={100} height={56} rx={6}
              fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.3} />
            <text x={w.x + 50} y={240} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
              {w.name}
            </text>
            <text x={w.x + 50} y={260} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {w.desc}
            </text>
          </g>
        ))}

        {/* Legend */}
        <rect x={30} y={290} width={500} height={58} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={310} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          Claude Code가 실제로 사용하는 5개 sub-agent types
        </text>
        <text x={280} y={330} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          사용자 요청 → Main → Team Lead 분석 → worker 선택 → 결과 취합 → 사용자 응답
        </text>
      </svg>
    </div>
  );
}
