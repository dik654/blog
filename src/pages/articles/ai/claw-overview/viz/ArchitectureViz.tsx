export default function ArchitectureViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Claw Code 아키텍처 계층도</text>

        <defs>
          <marker id="arch-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Layer 1: CLI */}
        <rect x={210} y={44} width={140} height={38} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          CLI / REPL
        </text>

        <line x1={280} y1={82} x2={280} y2={98} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arch-arr)" />

        {/* Layer 2: ConversationRuntime */}
        <rect x={170} y={100} width={220} height={40} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={280} y={125} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          ConversationRuntime
        </text>

        <line x1={280} y1={140} x2={280} y2={156} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arch-arr)" />

        {/* Layer 3: Tool Dispatch + Permission Enforcer */}
        <rect x={110} y={158} width={170} height={40} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.8} />
        <text x={195} y={183} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Tool Dispatch
        </text>

        <rect x={300} y={158} width={180} height={40} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.8} />
        <text x={390} y={183} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          Permission Enforcer
        </text>

        <line x1={300} y1={178} x2={280} y2={178} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#arch-arr)" />

        <line x1={195} y1={198} x2={195} y2={216} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#arch-arr)" />

        {/* Layer 4: Tools (4 boxes) */}
        {[
          { x: 30, label: 'Bash', note: 'sandbox', color: '#8b5cf6' },
          { x: 135, label: 'FileOps', note: 'R/W/Edit/Glob', color: '#06b6d4' },
          { x: 240, label: 'MCP', note: 'Bridge', color: '#84cc16' },
          { x: 345, label: 'Hooks', note: 'pre/post-exec', color: '#f97316' },
        ].map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={218} width={95} height={52} rx={5}
              fill={t.color} fillOpacity={0.15} stroke={t.color} strokeWidth={1.3} />
            <text x={t.x + 47} y={240} textAnchor="middle" fontSize={11} fontWeight={700} fill={t.color}>
              {t.label}
            </text>
            <text x={t.x + 47} y={258} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {t.note}
            </text>
          </g>
        ))}

        <line x1={180} y1={270} x2={180} y2={288} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#arch-arr)" />

        {/* Layer 5: API Client */}
        <rect x={70} y={290} width={220} height={40} rx={6}
          fill="#ec4899" fillOpacity={0.15} stroke="#ec4899" strokeWidth={1.8} />
        <text x={180} y={310} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ec4899">
          API Client
        </text>
        <text x={180} y={324} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          streaming · retry · token count
        </text>

        <line x1={290} y1={310} x2={310} y2={310} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#arch-arr)" />
        <text x={400} y={304} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Anthropic</text>
        <text x={400} y={318} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">OpenAI · xAI</text>

        <line x1={180} y1={330} x2={180} y2={346} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#arch-arr)" />

        {/* Layer 6: Session → Compact → Telemetry */}
        <rect x={40} y={348} width={90} height={28} rx={4}
          fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={1.3} />
        <text x={85} y={366} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">Session</text>

        <line x1={130} y1={362} x2={150} y2={362} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#arch-arr)" />

        <rect x={152} y={348} width={90} height={28} rx={4}
          fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={1.3} />
        <text x={197} y={366} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">Compact</text>

        <line x1={242} y1={362} x2={262} y2={362} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#arch-arr)" />

        <rect x={264} y={348} width={100} height={28} rx={4}
          fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={1.3} />
        <text x={314} y={366} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">Telemetry</text>
      </svg>
    </div>
  );
}
