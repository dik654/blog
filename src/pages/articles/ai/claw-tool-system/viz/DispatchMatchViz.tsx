export default function DispatchMatchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">execute_tool() — 40-way Match Dispatch</text>

        <defs>
          <marker id="dm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input */}
        <rect x={160} y={46} width={240} height={32} rx={5}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          execute_tool(name, input)
        </text>

        <line x1={280} y1={78} x2={280} y2={94} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#dm-arr)" />

        {/* Match statement box */}
        <rect x={60} y={96} width={440} height={225} rx={8}
          fill="var(--muted)" opacity={0.35} stroke="var(--border)" strokeWidth={1} />
        <text x={280} y={115} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          match name {'{'}
        </text>

        {/* Branches (10 visible, 40 total) */}
        {[
          { name: '"bash"', fn: 'execute_bash(BashCommandInput)', color: '#ef4444' },
          { name: '"read_file"', fn: 'read_file(TextFilePayload)', color: '#10b981' },
          { name: '"write_file"', fn: 'write_file(path, content)', color: '#f59e0b' },
          { name: '"edit_file"', fn: 'edit_file(path, old, new, all)', color: '#f59e0b' },
          { name: '"glob_search"', fn: 'glob_search(pattern, path)', color: '#10b981' },
          { name: '"grep_search"', fn: 'grep_search(GrepInput)', color: '#10b981' },
          { name: '"TaskCreate"', fn: 'global_task_registry().create()', color: '#8b5cf6' },
          { name: '"MCP"', fn: 'global_mcp_registry().call_tool()', color: '#ec4899' },
          { name: '"LSP"', fn: 'global_lsp_registry().dispatch()', color: '#06b6d4' },
          { name: '_', fn: 'Err("unknown tool")', color: '#6b7280' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={75} y={128 + i * 18} width={100} height={15} rx={2}
              fill={b.color} fillOpacity={0.2} stroke={b.color} strokeWidth={0.8} />
            <text x={85} y={140 + i * 18} fontSize={9} fontWeight={600} fontFamily="monospace" fill={b.color}>
              {b.name}
            </text>
            <text x={180} y={140 + i * 18} fontSize={9} fill="#8b5cf6" fontWeight={700}>→</text>
            <text x={195} y={140 + i * 18} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
              {b.fn}
            </text>
          </g>
        ))}

        <text x={280} y={312} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          {'}'}
        </text>

        {/* Note below */}
        <rect x={60} y={333} width={440} height={32} rx={5}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={350} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
          입력: serde_json::from_value::&lt;T&gt;(input) → 타입 안전 역직렬화
        </text>
        <text x={280} y={360} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          unknown tool → Err 반환, 세션 유지 (LLM 환각 방어)
        </text>
      </svg>
    </div>
  );
}
