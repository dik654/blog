export default function HookProtocolViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Hook JSON 프로토콜 — stdin/stdout</text>

        <defs>
          <marker id="hp-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* claw-code */}
        <rect x={30} y={56} width={120} height={58} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1} />
        <text x={90} y={80} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          claw-code
        </text>
        <text x={90} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          메인 프로세스
        </text>

        {/* hook process */}
        <rect x={410} y={56} width={120} height={58} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1} />
        <text x={470} y={80} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          hook.sh
        </text>
        <text x={470} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          서브프로세스
        </text>

        {/* stdin 화살표 */}
        <line x1={150} y1={74} x2={410} y2={74} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#hp-arr)" />
        <text x={280} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">stdin (JSON)</text>

        <line x1={410} y1={96} x2={150} y2={96} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#hp-arr)" />
        <text x={280} y={110} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">stdout (JSON)</text>

        {/* Input JSON */}
        <rect x={30} y={134} width={240} height={144} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="#3b82f6" strokeWidth={0.5} />
        <text x={150} y={154} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Input (stdin)
        </text>

        <g transform="translate(48, 164)">
          <text x={0} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123;</text>
          <text x={10} y={28} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;event&quot;: &quot;PreToolUse&quot;,</text>
          <text x={10} y={42} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;tool_name&quot;: &quot;bash&quot;,</text>
          <text x={10} y={56} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;tool_input&quot;: &#123;...&#125;,</text>
          <text x={10} y={70} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;session_id&quot;: &quot;...&quot;,</text>
          <text x={10} y={84} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;workspace_root&quot;: &quot;...&quot;</text>
          <text x={0} y={98} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#125;</text>
        </g>

        {/* Output JSON */}
        <rect x={290} y={134} width={240} height={144} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="#10b981" strokeWidth={0.5} />
        <text x={410} y={154} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Output (stdout)
        </text>

        <g transform="translate(308, 164)">
          <text x={0} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123;</text>
          <text x={10} y={28} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;permission&quot;:</text>
          <text x={10} y={42} fontSize={9} fontFamily="monospace" fill="#10b981">  &quot;allow&quot; |</text>
          <text x={10} y={56} fontSize={9} fontFamily="monospace" fill="#ef4444">  &quot;deny&quot; |</text>
          <text x={10} y={70} fontSize={9} fontFamily="monospace" fill="#f59e0b">  &quot;prompt&quot; |</text>
          <text x={10} y={84} fontSize={9} fontFamily="monospace" fill="#6b7280">  &quot;skip&quot;,</text>
          <text x={0} y={98} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#125;</text>
        </g>

        <text x={280} y={304} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">언어 무관 (bash, python, ruby, go 등) · 2초 타임아웃</text>
      </svg>
    </div>
  );
}
