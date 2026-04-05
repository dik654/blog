export default function GlobalRegistry3LayerViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">GlobalToolRegistry — 3계층 합성</text>

        {/* Layer 1: Built-in */}
        <rect x={30} y={50} width={500} height={70} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2} />
        <text x={50} y={75} fontSize={12} fontWeight={700} fill="#10b981">
          Layer 1 · 빌트인 (Static, compile-time)
        </text>
        <text x={50} y={95} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          mvp_tool_specs() → Vec&lt;ToolSpec&gt;
        </text>
        <text x={50} y={110} fontSize={10} fill="var(--muted-foreground)">
          40개 고정 도구 · 프로세스 종료까지 불변
        </text>

        {/* Layer 2: Plugin */}
        <rect x={30} y={135} width={500} height={70} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={2} />
        <text x={50} y={160} fontSize={12} fontWeight={700} fill="#f59e0b">
          Layer 2 · 플러그인 (Static, boot-time)
        </text>
        <text x={50} y={180} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          plugin_tools: Vec&lt;PluginTool&gt;
        </text>
        <text x={50} y={195} fontSize={10} fill="var(--muted-foreground)">
          settings.json 파싱 시점 고정 · 재시작 전까지 불변
        </text>

        {/* Layer 3: Runtime (MCP) */}
        <rect x={30} y={220} width={500} height={70} rx={8}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={2} />
        <text x={50} y={245} fontSize={12} fontWeight={700} fill="#ef4444">
          Layer 3 · 런타임/MCP (Dynamic)
        </text>
        <text x={50} y={265} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          runtime_tools: Vec&lt;RuntimeToolDefinition&gt;
        </text>
        <text x={50} y={280} fontSize={10} fill="var(--muted-foreground)">
          MCP 서버 연결·해제 이벤트마다 변경
        </text>

        {/* Collision check note */}
        <rect x={30} y={305} width={500} height={25} rx={5}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={322} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          이름 충돌 시 Err(&quot;duplicate tool name&quot;) — LLM이 어느 쪽 호출할지 결정 불가 방지
        </text>
      </svg>
    </div>
  );
}
