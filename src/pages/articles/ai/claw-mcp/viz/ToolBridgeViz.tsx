import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function ToolBridgeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">McpToolRegistry — 도구 브릿지 (Adapter)</text>

        <defs>
          <marker id="tb-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* LLM */}
        <ActionBox x={35} y={60} w={118} h={42}
          label="LLM"
          sub="tool_use 호출"
          color="#8b5cf6" />

        <line x1={153} y1={80} x2={172} y2={80} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#tb-arr)" />

        {/* Registry */}
        <ModuleBox x={174} y={54} w={214} h={58}
          label="GlobalToolRegistry"
          sub="mcp__postgres__query 매칭"
          color="#3b82f6" />

        <line x1={388} y1={82} x2={407} y2={82} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#tb-arr)" />

        {/* McpToolExecutor */}
        <ActionBox x={409} y={60} w={118} h={42}
          label="McpToolExecutor"
          sub="adapter"
          color="#f59e0b" />

        {/* 네임스페이스 변환 */}
        <rect x={35} y={132} width={490} height={74} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={152} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">네임스페이스 변환</text>

        <text x={104} y={178} textAnchor="middle" fontSize={10.5} fontFamily="monospace" fontWeight={600} fill="#3b82f6">
          mcp__postgres__query_users
        </text>
        <text x={104} y={194} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          claw-code 도구명
        </text>

        <text x={286} y={184} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">→</text>

        <text x={452} y={178} textAnchor="middle" fontSize={10.5} fontFamily="monospace" fontWeight={600} fill="#10b981">
          postgres + query_users
        </text>
        <text x={452} y={194} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          MCP server + tool name
        </text>

        {/* MCP 호출 */}
        <ActionBox x={35} y={228} w={150} h={42}
          label="tools/call"
          sub="JSON-RPC"
          color="#3b82f6" />

        <ModuleBox x={205} y={228} w={164} h={42}
          label="MCP Server"
          sub="postgres"
          color="#8b5cf6" />

        <DataBox x={389} y={230} w={136} h={38}
          label="ToolOutput"
          sub="text/image/resource"
          color="#10b981" />

        <line x1={185} y1={249} x2={205} y2={249} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#tb-arr)" />
        <line x1={369} y1={249} x2={389} y2={249} stroke="#10b981" strokeWidth={1.4} markerEnd="url(#tb-arr)" />

        <text x={280} y={300} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">Adapter 패턴 — LLM은 MCP를 모름, 일반 도구로 인식</text>
      </svg>
    </div>
  );
}
