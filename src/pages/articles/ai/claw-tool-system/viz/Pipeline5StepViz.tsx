export default function Pipeline5StepViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">handle_tool_use() — 5단계 파이프라인</text>

        <defs>
          <marker id="p5-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input: tool_use block */}
        <rect x={180} y={46} width={200} height={36} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={280} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          ToolUseBlock {'{id, name, input}'}
        </text>

        {/* Step 1 */}
        <line x1={280} y1={82} x2={280} y2={98} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#p5-arr)" />
        <rect x={40} y={100} width={480} height={44} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.8} />
        <text x={55} y={121} fontSize={11} fontWeight={700} fill="#ef4444">1. Permission Gate</text>
        <text x={55} y={136} fontSize={9} fill="var(--muted-foreground)">
          enforcer.check() → Allow | Deny(reason) | Prompt(msg)
        </text>
        <text x={505} y={127} textAnchor="end" fontSize={9.5} fontFamily="monospace" fontWeight={600} fill="#ef4444">
          Deny → error
        </text>

        {/* Step 2 */}
        <line x1={280} y1={144} x2={280} y2={158} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#p5-arr)" />
        <rect x={40} y={160} width={480} height={44} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={55} y={181} fontSize={11} fontWeight={700} fill="#f59e0b">2. Pre-hook (abort-able)</text>
        <text x={55} y={196} fontSize={9} fill="var(--muted-foreground)">
          hooks.pre_tool() → Option&lt;Abort&gt;
        </text>
        <text x={505} y={187} textAnchor="end" fontSize={9.5} fontFamily="monospace" fontWeight={600} fill="#f59e0b">
          abort → error
        </text>

        {/* Step 3 */}
        <line x1={280} y1={204} x2={280} y2={218} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#p5-arr)" />
        <rect x={40} y={220} width={480} height={44} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2.2} />
        <text x={55} y={241} fontSize={11} fontWeight={700} fill="#10b981">3. Dispatch (40-way match)</text>
        <text x={55} y={256} fontSize={9} fill="var(--muted-foreground)">
          execute_tool(name, input) → ToolOutput
        </text>
        <text x={505} y={247} textAnchor="end" fontSize={9.5} fontFamily="monospace" fontWeight={600} fill="#10b981">
          core path
        </text>

        {/* Step 4 */}
        <line x1={280} y1={264} x2={280} y2={278} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#p5-arr)" />
        <rect x={40} y={280} width={480} height={44} rx={6}
          fill="#06b6d4" fillOpacity={0.15} stroke="#06b6d4" strokeWidth={1.3} strokeDasharray="4 3" />
        <text x={55} y={301} fontSize={11} fontWeight={700} fill="#06b6d4">4. Post-hook + Session log</text>
        <text x={55} y={316} fontSize={9} fill="var(--muted-foreground)">
          hooks.post_tool() · log_tool_call() → session
        </text>
        <text x={505} y={307} textAnchor="end" fontSize={9.5} fontFamily="monospace" fontWeight={600} fill="#06b6d4">
          always runs
        </text>

        {/* Output */}
        <line x1={280} y1={324} x2={280} y2={338} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#p5-arr)" />
      </svg>
    </div>
  );
}
