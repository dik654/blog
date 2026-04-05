export default function ForkRewindFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Session Fork / Rewind — 분기·되감기</text>

        <defs>
          <marker id="fr-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        <text x={30} y={64} fontSize={11} fontWeight={700} fill="#3b82f6">Main Timeline</text>

        {/* Main session timeline (horizontal) */}
        <line x1={40} y1={100} x2={530} y2={100} stroke="#3b82f6" strokeWidth={2.5} />

        {/* Turn points */}
        {[
          { x: 60, label: 'T0', desc: 'start' },
          { x: 150, label: 'T1', desc: 'user msg' },
          { x: 240, label: 'T2', desc: 'tool_use' },
          { x: 330, label: 'T3', desc: 'fork pt' },
          { x: 420, label: 'T4', desc: 'continue' },
          { x: 510, label: 'T5', desc: 'end' },
        ].map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={100} r={7} fill="#3b82f6" stroke="#fff" strokeWidth={1.5} />
            <text x={t.x} y={84} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
              {t.label}
            </text>
            <text x={t.x} y={124} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {t.desc}
            </text>
          </g>
        ))}

        {/* Fork point highlight */}
        <circle cx={330} cy={100} r={12} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="3 2" />

        {/* Fork A - branches down */}
        <line x1={330} y1={107} x2={330} y2={160} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#fr-arr)" />
        <line x1={330} y1={162} x2={120} y2={162} stroke="#10b981" strokeWidth={2.5} />
        <line x1={120} y1={162} x2={320} y2={162} stroke="#10b981" strokeWidth={2.5} />

        <text x={120} y={148} fontSize={10} fontWeight={700} fill="#10b981">Fork A</text>
        {[
          { x: 130, label: 'T3a' },
          { x: 220, label: 'T3b' },
          { x: 310, label: 'T3c' },
        ].map((t, i) => (
          <g key={`a${i}`}>
            <circle cx={t.x} cy={162} r={5} fill="#10b981" stroke="#fff" strokeWidth={1.2} />
            <text x={t.x} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {t.label}
            </text>
          </g>
        ))}

        {/* Fork B - branches further down */}
        <line x1={330} y1={164} x2={330} y2={212} stroke="#8b5cf6" strokeWidth={1.3} strokeDasharray="3 2" markerEnd="url(#fr-arr)" />
        <line x1={330} y1={214} x2={510} y2={214} stroke="#ef4444" strokeWidth={2.5} />

        <text x={510} y={202} textAnchor="end" fontSize={10} fontWeight={700} fill="#ef4444">Fork B</text>
        {[
          { x: 370, label: 'T3x' },
          { x: 460, label: 'T3y' },
        ].map((t, i) => (
          <g key={`b${i}`}>
            <circle cx={t.x} cy={214} r={5} fill="#ef4444" stroke="#fff" strokeWidth={1.2} />
            <text x={t.x} y={234} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {t.label}
            </text>
          </g>
        ))}

        {/* Key operations */}
        <rect x={30} y={256} width={500} height={62} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={42} y={275} fontSize={10} fontWeight={700} fill="var(--foreground)">Operations:</text>
        <text x={42} y={292} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          session.fork(T3) → copy messages[0..T3] → new session_id
        </text>
        <text x={42} y={308} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          session.rewind(T3) → truncate messages after T3 · discard tool_results
        </text>
      </svg>
    </div>
  );
}
