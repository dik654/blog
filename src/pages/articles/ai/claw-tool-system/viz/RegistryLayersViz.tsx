import { ModuleBox } from '@/components/viz/boxes';

export default function RegistryLayersViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 345" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">GlobalToolRegistry — 3계층 합성</text>

        {/* Layer 1: Builtin */}
        <ModuleBox x={40} y={42} w={480} h={42}
          label="Layer 1: Builtin (40개)"
          sub="mvp_tool_specs() · 컴파일 타임 고정"
          color="#3b82f6" />

        <g transform="translate(55, 94)">
          {['read_file', 'bash', 'grep', 'edit_file', 'glob', 'MCP'].map((t, i) => (
            <g key={t} transform={`translate(${i * 76}, 0)`}>
              <rect x={0} y={0} width={68} height={22} rx={3}
                fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={0.5} />
              <text x={34} y={15} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="#3b82f6">{t}</text>
            </g>
          ))}
        </g>

        {/* Layer 2: Plugins */}
        <ModuleBox x={40} y={134} w={480} h={42}
          label="Layer 2: Plugins (정적 확장)"
          sub="settings.json 파싱 시점에 고정"
          color="#10b981" />

        <g transform="translate(55, 186)">
          {['my-linter', 'project-ctx'].map((t, i) => (
            <g key={t} transform={`translate(${i * 98}, 0)`}>
              <rect x={0} y={0} width={90} height={22} rx={3}
                fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={0.5} />
              <text x={45} y={15} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="#10b981">{t}</text>
            </g>
          ))}
        </g>

        {/* Layer 3: Runtime MCP */}
        <ModuleBox x={40} y={226} w={480} h={42}
          label="Layer 3: Runtime (MCP, 동적 확장)"
          sub="세션 중 서버 추가/제거 가능"
          color="#f59e0b" />

        <g transform="translate(55, 278)">
          {['mcp__pg__query', 'mcp__github__pr', 'mcp__fs__read'].map((t, i) => (
            <g key={t} transform={`translate(${i * 140}, 0)`}>
              <rect x={0} y={0} width={130} height={22} rx={3}
                fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={0.5} />
              <text x={65} y={15} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="#f59e0b">{t}</text>
            </g>
          ))}
        </g>

        <text x={280} y={330} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">이름 충돌 시 등록 거부 · 수명: 빌트인 ≥ 플러그인 ≥ MCP</text>
      </svg>
    </div>
  );
}
