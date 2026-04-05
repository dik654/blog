import { ActionBox } from '@/components/viz/boxes';

export default function JsonRpcViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">McpStdioProcess — JSON-RPC 통신</text>

        <defs>
          <marker id="jr-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* claw-code */}
        <ActionBox x={35} y={66} w={140} h={48}
          label="claw-code"
          sub="reader_task (async)"
          color="#3b82f6" />

        {/* MCP server */}
        <ActionBox x={385} y={66} w={140} h={48}
          label="MCP Server"
          sub="stdio JSON-RPC"
          color="#8b5cf6" />

        {/* Request */}
        <line x1={175} y1={82} x2={385} y2={82} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#jr-arr)" />
        <text x={280} y={74} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#3b82f6">
          stdin (id=1, method, params)
        </text>

        {/* Response */}
        <line x1={385} y1={98} x2={175} y2={98} stroke="#10b981" strokeWidth={1.4} markerEnd="url(#jr-arr)" />
        <text x={280} y={114} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#10b981">
          stdout (id=1, result)
        </text>

        {/* Request example */}
        <rect x={35} y={140} width={212} height={120} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="#3b82f6" strokeWidth={0.6} />
        <text x={141} y={160} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          Request
        </text>
        <g transform="translate(46, 168)">
          <text x={0} y={12} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123;</text>
          <text x={8} y={26} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;jsonrpc&quot;: &quot;2.0&quot;,</text>
          <text x={8} y={40} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;id&quot;: 1,</text>
          <text x={8} y={54} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;method&quot;: &quot;tools/list&quot;,</text>
          <text x={8} y={68} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;params&quot;: &#123;&#125;</text>
          <text x={0} y={82} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#125;</text>
        </g>

        {/* Response example */}
        <rect x={313} y={140} width={212} height={120} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="#10b981" strokeWidth={0.6} />
        <text x={419} y={160} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          Response
        </text>
        <g transform="translate(324, 168)">
          <text x={0} y={12} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123;</text>
          <text x={8} y={26} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;jsonrpc&quot;: &quot;2.0&quot;,</text>
          <text x={8} y={40} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;id&quot;: 1,</text>
          <text x={8} y={54} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;result&quot;: &#123;</text>
          <text x={16} y={68} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;tools&quot;: [...]</text>
          <text x={8} y={82} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#125;&#125;</text>
        </g>

        <text x={280} y={288} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">라인 단위 JSON · id로 요청-응답 매칭 · oneshot 채널 사용</text>
      </svg>
    </div>
  );
}
