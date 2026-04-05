export default function LifecycleTransitionsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SessionController — Lifecycle 상태 머신</text>

        <defs>
          <marker id="lt-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* States in hexagonal layout */}
        {[
          { x: 280, y: 80, label: 'Initializing', color: '#3b82f6', desc: 'setup' },
          { x: 450, y: 140, label: 'Active', color: '#10b981', desc: 'running' },
          { x: 450, y: 260, label: 'Idle', color: '#f59e0b', desc: 'no input' },
          { x: 280, y: 320, label: 'Suspended', color: '#8b5cf6', desc: 'saved' },
          { x: 110, y: 260, label: 'Compacting', color: '#06b6d4', desc: 'shrink' },
          { x: 110, y: 140, label: 'Failed', color: '#ef4444', desc: 'error' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={44}
              fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={2} />
            <text x={s.x} y={s.y - 2} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={s.x} y={s.y + 15} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {s.desc}
            </text>
          </g>
        ))}

        {/* Transitions */}
        {/* Init → Active */}
        <line x1={318} y1={100} x2={418} y2={128} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#lt-arr)" />
        <text x={380} y={108} fontSize={9} fontWeight={600} fill="#8b5cf6">start</text>

        {/* Active → Idle */}
        <line x1={450} y1={186} x2={450} y2={214} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#lt-arr)" />
        <text x={470} y={204} fontSize={9} fontWeight={600} fill="#8b5cf6">timeout</text>

        {/* Idle → Active */}
        <line x1={425} y1={216} x2={425} y2={185} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#lt-arr)" />
        <text x={380} y={204} fontSize={9} fontWeight={600} fill="#8b5cf6">input</text>

        {/* Idle → Suspended */}
        <line x1={418} y1={282} x2={320} y2={308} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#lt-arr)" />
        <text x={385} y={310} fontSize={9} fontWeight={600} fill="#8b5cf6">persist</text>

        {/* Suspended → Active (resume) */}
        <line x1={280} y1={276} x2={420} y2={164} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#lt-arr)" strokeDasharray="3 2" />
        <text x={320} y={224} fontSize={9} fontWeight={600} fill="#8b5cf6">resume</text>

        {/* Active → Compacting */}
        <line x1={420} y1={155} x2={145} y2={240} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#lt-arr)" strokeDasharray="3 2" />
        <text x={270} y={210} fontSize={9} fontWeight={600} fill="#8b5cf6">token limit</text>

        {/* Compacting → Active */}
        <line x1={145} y1={235} x2={418} y2={150} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#lt-arr)" />
        <text x={270} y={175} fontSize={9} fontWeight={600} fill="#10b981">done</text>

        {/* Any → Failed (simplified) */}
        <line x1={240} y1={88} x2={150} y2={128} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#lt-arr)" strokeDasharray="3 2" />
        <text x={170} y={80} fontSize={9} fontWeight={600} fill="#ef4444">panic</text>
      </svg>
    </div>
  );
}
