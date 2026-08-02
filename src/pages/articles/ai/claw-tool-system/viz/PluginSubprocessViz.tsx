export default function PluginSubprocessViz() {
  const C = {
    parent: '#3b82f6',
    sub: '#10b981',
    request: '#8b5cf6',
    response: '#6b7280',
    spawn: '#f59e0b',
  };
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720, width: '100%' }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Plugin Tool Subprocess Execution</text>

        <defs>
          <marker id="ps-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={C.request} />
          </marker>
          <marker id="ps-arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={C.response} />
          </marker>
          <marker id="ps-arr-flow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={C.spawn} />
          </marker>
        </defs>

        {/* Parent: Claw Code Runtime */}
        <rect x={30} y={54} width={220} height={88} rx={8}
          fill={C.parent} fillOpacity={0.15} stroke={C.parent} strokeWidth={1.8} />
        <text x={140} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.parent}>
          Claw Code Runtime
        </text>
        <text x={140} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">parent process</text>
        <text x={140} y={112} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">GlobalToolRegistry</text>
        <text x={140} y={128} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">PluginRegistry</text>

        {/* Plugin Subprocess */}
        <rect x={310} y={54} width={220} height={88} rx={8}
          fill={C.sub} fillOpacity={0.15} stroke={C.sub} strokeWidth={1.8} />
        <text x={420} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.sub}>
          Plugin Subprocess
        </text>
        <text x={420} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">isolated child</text>
        <text x={420} y={112} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">custom binary</text>
        <text x={420} y={128} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">user-provided tools</text>

        {/* Communication arrows */}
        <line x1={250} y1={88} x2={310} y2={88} stroke={C.request} strokeWidth={1.5} markerEnd="url(#ps-arr)" />
        <text x={280} y={80} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.request}>JSON-RPC / stdio</text>

        <line x1={310} y1={118} x2={250} y2={118} stroke={C.response} strokeWidth={1.3} markerEnd="url(#ps-arr-r)" strokeDasharray="4 3" />
        <text x={280} y={112} textAnchor="middle" fontSize={9} fill={C.response}>result/error</text>

        {/* Tool Call Flow — visual sequence diagram */}
        <text x={280} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          Tool Call Flow
        </text>

        {/* 6 step boxes in 2 columns × 3 rows */}
        {([
          { id: 1, x: 40, y: 188, w: 220, label: 'LLM → tool_use', sub: '"my_plugin_tool" + args', color: C.parent },
          { id: 2, x: 40, y: 228, w: 220, label: 'registry.lookup', sub: '"my_plugin_tool"', color: C.parent },
          { id: 3, x: 40, y: 268, w: 220, label: 'spawn subprocess', sub: 'plugin registry hit', color: C.spawn },
          { id: 4, x: 300, y: 188, w: 220, label: 'send JSON', sub: '{method:"execute", args}', color: C.sub },
          { id: 5, x: 300, y: 228, w: 220, label: 'subprocess writes', sub: 'result → stdout', color: C.sub },
          { id: 6, x: 300, y: 268, w: 220, label: 'parent parses JSON', sub: '→ ToolOutput', color: C.parent },
        ] as const).map((s) => (
          <g key={s.id}>
            <rect x={s.x} y={s.y} width={s.w} height={32} rx={5}
              fill={`${s.color}15`} stroke={s.color} strokeWidth={0.9} />
            <circle cx={s.x + 14} cy={s.y + 16} r={9} fill={s.color} />
            <text x={s.x + 14} y={s.y + 19} textAnchor="middle" fontSize={9} fontWeight={700} fill="white">
              {s.id}
            </text>
            <text x={s.x + 30} y={s.y + 14} fontSize={10} fontWeight={600} fill={s.color}>
              {s.label}
            </text>
            <text x={s.x + 30} y={s.y + 26} fontSize={8.5} fill="var(--muted-foreground)">
              {s.sub}
            </text>
          </g>
        ))}

        {/* Flow arrows between steps */}
        <line x1={150} y1={220} x2={150} y2={228} stroke={C.spawn} strokeWidth={1} markerEnd="url(#ps-arr-flow)" />
        <line x1={150} y1={260} x2={150} y2={268} stroke={C.spawn} strokeWidth={1} markerEnd="url(#ps-arr-flow)" />
        <line x1={260} y1={284} x2={300} y2={204} stroke={C.spawn} strokeWidth={1} strokeDasharray="3 3" />
        <line x1={410} y1={220} x2={410} y2={228} stroke={C.spawn} strokeWidth={1} markerEnd="url(#ps-arr-flow)" />
        <line x1={410} y1={260} x2={410} y2={268} stroke={C.spawn} strokeWidth={1} markerEnd="url(#ps-arr-flow)" />

        <text x={280} y={325} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          subprocess 격리 → 충돌·메모리 누출 격리 + custom binary 자유도
        </text>
      </svg>
    </div>
  );
}
