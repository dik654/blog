export default function PluginKindViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 260" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PluginKind — 3종 플러그인 유형</text>

        {/* ToolProvider */}
        <rect x={30} y={56} width={160} height={160} rx={10}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={110} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          ToolProvider
        </text>
        <text x={110} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          도구 제공
        </text>
        <g transform="translate(42, 108)">
          <text x={0} y={12} fontSize={9} fill="var(--foreground)">• 커스텀 도구 추가</text>
          <text x={0} y={28} fontSize={9} fill="var(--foreground)">• 호출당 subprocess</text>
          <text x={0} y={44} fontSize={9} fill="var(--foreground)">• 권한 모델 따름</text>
        </g>
        <text x={110} y={202} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#3b82f6">
          예: my-linter
        </text>

        {/* HookProvider */}
        <rect x={200} y={56} width={160} height={160} rx={10}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={280} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          HookProvider
        </text>
        <text x={280} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Pre/Post 훅
        </text>
        <g transform="translate(212, 108)">
          <text x={0} y={12} fontSize={9} fill="var(--foreground)">• 검증 로직 추가</text>
          <text x={0} y={28} fontSize={9} fill="var(--foreground)">• HookRunner 통합</text>
          <text x={0} y={44} fontSize={9} fill="var(--foreground)">• JSON 프로토콜</text>
        </g>
        <text x={280} y={202} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#f59e0b">
          예: audit-log
        </text>

        {/* ContextProvider */}
        <rect x={370} y={56} width={160} height={160} rx={10}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2} />
        <text x={450} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          ContextProvider
        </text>
        <text x={450} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          컨텍스트 주입
        </text>
        <g transform="translate(382, 108)">
          <text x={0} y={12} fontSize={9} fill="var(--foreground)">• 시스템 프롬프트</text>
          <text x={0} y={28} fontSize={9} fill="var(--foreground)">• session_start</text>
          <text x={0} y={44} fontSize={9} fill="var(--foreground)">• every_turn</text>
        </g>
        <text x={450} y={202} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">
          예: project-ctx
        </text>

        <text x={280} y={244} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">매니페스트 plugin-manifest.json의 kind 필드로 지정</text>
      </svg>
    </div>
  );
}
