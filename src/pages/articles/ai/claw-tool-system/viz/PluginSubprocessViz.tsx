export default function PluginSubprocessViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Plugin Tool Subprocess Execution</text>

        <defs>
          <marker id="ps-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Parent: Claw Code Runtime */}
        <rect x={30} y={54} width={220} height={88} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={140} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Claw Code Runtime
        </text>
        <text x={140} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">parent process</text>
        <text x={140} y={112} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">GlobalToolRegistry</text>
        <text x={140} y={128} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">PluginRegistry</text>

        {/* Plugin Subprocess */}
        <rect x={310} y={54} width={220} height={88} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.8} />
        <text x={420} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          Plugin Subprocess
        </text>
        <text x={420} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">isolated child</text>
        <text x={420} y={112} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">custom binary</text>
        <text x={420} y={128} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">user-provided tools</text>

        {/* Communication arrows */}
        <line x1={250} y1={88} x2={310} y2={88} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#ps-arr)" />
        <text x={280} y={80} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#8b5cf6">JSON-RPC / stdio</text>

        <line x1={310} y1={118} x2={250} y2={118} stroke="#6b7280" strokeWidth={1.3} markerEnd="url(#ps-arr)" strokeDasharray="4 3" />
        <text x={280} y={112} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">result/error</text>

        {/* Call flow box */}
        <rect x={30} y={160} width={500} height={160} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={180} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          Tool Call Flow
        </text>

        {[
          { y: 200, text: '1. LLM → tool_use("my_plugin_tool", args)', color: '#3b82f6' },
          { y: 220, text: '2. Runtime: registry.lookup("my_plugin_tool")', color: '#3b82f6' },
          { y: 240, text: '3. Found in plugin registry → spawn subprocess', color: '#f59e0b' },
          { y: 260, text: '4. Send JSON: {method:"execute", args}', color: '#10b981' },
          { y: 280, text: '5. Subprocess writes result to stdout', color: '#10b981' },
          { y: 300, text: '6. Parent parses JSON → ToolOutput', color: '#3b82f6' },
        ].map((step, i) => (
          <text key={i} x={50} y={step.y} fontSize={10} fontFamily="monospace" fill={step.color}>
            {step.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
