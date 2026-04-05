export default function AgentLoopDetailViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Agent Loop — 1 turn breakdown</text>

        <defs>
          <marker id="al-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Turn start */}
        <circle cx={280} cy={56} r={14} fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={61} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">▶</text>

        <line x1={280} y1={72} x2={280} y2={88} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#al-arr)" />

        {/* Step 1: Build request */}
        <rect x={30} y={90} width={500} height={40} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={45} y={108} fontSize={11} fontWeight={700} fill="#f59e0b">1. build_request()</text>
        <text x={165} y={115} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          prompt_builder · system · messages · tools · metadata
        </text>

        <line x1={280} y1={130} x2={280} y2={148} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#al-arr)" />

        {/* Step 2: API call */}
        <rect x={30} y={150} width={500} height={40} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={45} y={168} fontSize={11} fontWeight={700} fill="#10b981">2. api_client.stream()</text>
        <text x={200} y={175} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          SSE: content_block_start · delta · stop
        </text>

        <line x1={280} y1={190} x2={280} y2={208} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#al-arr)" />

        {/* Step 3: Parse response */}
        <rect x={30} y={210} width={500} height={40} rx={6}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={45} y={228} fontSize={11} fontWeight={700} fill="#8b5cf6">3. parse_content_blocks()</text>
        <text x={225} y={235} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          Text · ToolUse · Thinking 추출
        </text>

        <line x1={280} y1={250} x2={280} y2={268} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#al-arr)" />

        {/* Step 4: Execute tools (conditional) */}
        <rect x={30} y={270} width={500} height={40} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.3} strokeDasharray="4 3" />
        <text x={45} y={288} fontSize={11} fontWeight={700} fill="#ef4444">4. if tool_use: execute_tool() × N</text>
        <text x={275} y={295} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          parallel · permission · hooks
        </text>

        <line x1={280} y1={310} x2={280} y2={328} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#al-arr)" />

        {/* Step 5: Append tool_result */}
        <rect x={30} y={330} width={500} height={40} rx={6}
          fill="#06b6d4" fillOpacity={0.15} stroke="#06b6d4" strokeWidth={1.5} />
        <text x={45} y={348} fontSize={11} fontWeight={700} fill="#06b6d4">5. append tool_result & continue</text>
        <text x={275} y={355} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          → loop until stop_reason == "end_turn"
        </text>
      </svg>
    </div>
  );
}
