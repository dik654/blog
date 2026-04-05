export default function CrateMapViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 400" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">9개 Cargo Workspace Crates (~55K LOC)</text>

        {/* runtime - largest, center top */}
        <rect x={180} y={46} width={200} height={76} rx={8}
          fill="#ef4444" fillOpacity={0.18} stroke="#ef4444" strokeWidth={2} />
        <text x={280} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">runtime/</text>
        <text x={280} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">37 modules · ~24K LOC</text>
        <text x={280} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">conversation · tool_dispatch</text>
        <text x={280} y={115} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">permission · session_control</text>

        {/* tools - below runtime */}
        <rect x={30} y={142} width={155} height={60} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={107} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">tools/</text>
        <text x={107} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">~7K LOC</text>
        <text x={107} y={194} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">bash · file_ops · mcp</text>

        {/* api */}
        <rect x={200} y={142} width={160} height={60} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={280} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">api/</text>
        <text x={280} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">multi-provider</text>
        <text x={280} y={194} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">anthropic · openai · xai</text>

        {/* commands */}
        <rect x={375} y={142} width={155} height={60} rx={6}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={452} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">commands/</text>
        <text x={452} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">~4.3K LOC</text>
        <text x={452} y={194} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">slash command registry</text>

        {/* plugins */}
        <rect x={30} y={220} width={155} height={60} rx={6}
          fill="#06b6d4" fillOpacity={0.15} stroke="#06b6d4" strokeWidth={1.5} />
        <text x={107} y={242} textAnchor="middle" fontSize={12} fontWeight={700} fill="#06b6d4">plugins/</text>
        <text x={107} y={258} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">~3.4K LOC</text>
        <text x={107} y={272} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">subprocess isolation</text>

        {/* rusty-claude-cli */}
        <rect x={200} y={220} width={160} height={60} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={280} y={242} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">rusty-claude-cli/</text>
        <text x={280} y={258} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">~10K LOC</text>
        <text x={280} y={272} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">REPL · entry point</text>

        {/* compat-harness */}
        <rect x={375} y={220} width={155} height={60} rx={6}
          fill="#84cc16" fillOpacity={0.15} stroke="#84cc16" strokeWidth={1.5} />
        <text x={452} y={242} textAnchor="middle" fontSize={12} fontWeight={700} fill="#84cc16">compat-harness/</text>
        <text x={452} y={258} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">upstream extract</text>
        <text x={452} y={272} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">manifest parser</text>

        {/* telemetry */}
        <rect x={90} y={298} width={180} height={60} rx={6}
          fill="#f97316" fillOpacity={0.15} stroke="#f97316" strokeWidth={1.5} />
        <text x={180} y={320} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f97316">telemetry/</text>
        <text x={180} y={336} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">session trace</text>
        <text x={180} y={350} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">usage · SSE parser</text>

        {/* mock-anthropic-service */}
        <rect x={290} y={298} width={230} height={60} rx={6}
          fill="#ec4899" fillOpacity={0.15} stroke="#ec4899" strokeWidth={1.5} />
        <text x={405} y={320} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ec4899">mock-anthropic-service/</text>
        <text x={405} y={336} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">deterministic API</text>
        <text x={405} y={350} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">12 test scenarios</text>

        {/* Legend */}
        <text x={280} y={380} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">
          runtime = 40% LOC · tools = 13% · cli = 18% · plugins/api/commands = 20% · 기타 9%
        </text>
      </svg>
    </div>
  );
}
