import { ModuleBox } from '@/components/viz/boxes';

export default function McpArchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">MCP 모듈 3계층</text>

        <defs>
          <marker id="mcp-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        <ModuleBox x={105} y={56} w={350} h={54}
          label="McpLifecycleValidator"
          sub="11단계 상태 머신"
          color="#3b82f6" />

        <line x1={280} y1={110} x2={280} y2={124} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#mcp-arr)" />

        <ModuleBox x={105} y={128} w={350} h={54}
          label="McpStdioProcess"
          sub="JSON-RPC stdio 프로세스 관리"
          color="#8b5cf6" />

        <line x1={280} y1={182} x2={280} y2={196} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#mcp-arr)" />

        <ModuleBox x={105} y={200} w={350} h={54}
          label="McpToolRegistry"
          sub="MCP 도구 → claw-code 도구 브릿지"
          color="#10b981" />

        <text x={280} y={272} textAnchor="middle" fontSize={9.5}
          fill="var(--muted-foreground)">상위 계층이 하위 계층에 의존 · 프로토콜·연결·통합 분리</text>
      </svg>
    </div>
  );
}
