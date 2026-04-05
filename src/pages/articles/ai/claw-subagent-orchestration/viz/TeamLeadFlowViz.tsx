export default function TeamLeadFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Team Lead — Task Decomposition Flow</text>

        <defs>
          <marker id="tl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* User request */}
        <rect x={170} y={46} width={220} height={36} rx={5}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          "Refactor auth module"
        </text>

        <line x1={280} y1={82} x2={280} y2={96} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#tl-arr)" />

        {/* Team Lead analyses */}
        <rect x={110} y={98} width={340} height={68} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={280} y={120} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          Team Lead Analysis
        </text>
        <text x={280} y={138} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          1. Identify sub-tasks
        </text>
        <text x={280} y={154} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          2. Estimate parallelism
        </text>

        {/* Spawn 3 parallel workers */}
        <line x1={180} y1={166} x2={90} y2={196} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#tl-arr)" />
        <line x1={280} y1={166} x2={280} y2={196} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#tl-arr)" />
        <line x1={380} y1={166} x2={470} y2={196} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#tl-arr)" />

        {/* Worker A */}
        <rect x={20} y={198} width={160} height={66} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={100} y={220} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Worker 1: Explore</text>
        <text x={100} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">auth/ 파일 찾기</text>
        <text x={100} y={253} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">의존성 파악</text>

        {/* Worker B */}
        <rect x={200} y={198} width={160} height={66} rx={6}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={280} y={220} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">Worker 2: Plan</text>
        <text x={280} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">리팩토링 설계</text>
        <text x={280} y={253} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">단계별 계획</text>

        {/* Worker C */}
        <rect x={380} y={198} width={160} height={66} rx={6}
          fill="#ec4899" fillOpacity={0.15} stroke="#ec4899" strokeWidth={1.5} />
        <text x={460} y={220} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ec4899">Worker 3: Explore</text>
        <text x={460} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기존 tests 조사</text>
        <text x={460} y={253} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">영향 범위</text>

        {/* Convergence */}
        <line x1={100} y1={264} x2={230} y2={294} stroke="#6b7280" strokeWidth={1.3} markerEnd="url(#tl-arr)" strokeDasharray="4 3" />
        <line x1={280} y1={264} x2={280} y2={294} stroke="#6b7280" strokeWidth={1.3} markerEnd="url(#tl-arr)" strokeDasharray="4 3" />
        <line x1={460} y1={264} x2={330} y2={294} stroke="#6b7280" strokeWidth={1.3} markerEnd="url(#tl-arr)" strokeDasharray="4 3" />

        {/* Aggregated result */}
        <rect x={140} y={298} width={280} height={46} rx={6}
          fill="#06b6d4" fillOpacity={0.15} stroke="#06b6d4" strokeWidth={1.8} />
        <text x={280} y={320} textAnchor="middle" fontSize={12} fontWeight={700} fill="#06b6d4">
          Team Lead: Synthesize
        </text>
        <text x={280} y={336} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          3 reports → final plan → execute with Edit
        </text>
      </svg>
    </div>
  );
}
