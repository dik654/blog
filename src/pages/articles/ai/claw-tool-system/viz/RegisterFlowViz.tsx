export default function RegisterFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 220" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PluginRegistry::register() — 3단계 검증</text>

        <defs>
          <marker id="rf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input */}
        <rect x={20} y={48} width={130} height={48} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={85} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">PluginManifest</text>
        <text x={85} y={84} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">manifest.json</text>

        <line x1={150} y1={72} x2={170} y2={72} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#rf-arr)" />

        {/* Step 1: name collision */}
        <rect x={170} y={48} width={120} height={48} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={230} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">① 이름 충돌</text>
        <text x={230} y={81} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">has_tool(name)?</text>
        <text x={230} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">빌트인+플러그인 비교</text>

        <line x1={290} y1={72} x2={310} y2={72} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#rf-arr)" />

        {/* Step 2: file exists */}
        <rect x={310} y={48} width={120} height={48} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={370} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">② 파일 존재</text>
        <text x={370} y={81} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">entrypoint.is_file()</text>
        <text x={370} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실행 파일 경로 확인</text>

        <line x1={430} y1={72} x2={450} y2={72} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#rf-arr)" />

        {/* Step 3: executable */}
        <rect x={450} y={48} width={95} height={48} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={497} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">③ 실행 권한</text>
        <text x={497} y={81} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">mode &amp; 0o111</text>
        <text x={497} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Unix 전용</text>

        {/* Success path */}
        <line x1={280} y1={110} x2={280} y2={130} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#rf-arr)" />
        <rect x={180} y={130} width={200} height={40} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={280} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">모든 검증 통과</text>
        <text x={280} y={164} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">self.plugins.push(Plugin::new(manifest))</text>

        {/* Failure branches */}
        <text x={230} y={112} textAnchor="middle" fontSize={9} fill="#ef4444">✗ Err</text>
        <text x={370} y={112} textAnchor="middle" fontSize={9} fill="#ef4444">✗ Err</text>
        <text x={497} y={112} textAnchor="middle" fontSize={9} fill="#ef4444">✗ Err</text>

        <text x={280} y={200} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">하나라도 실패 시 register() → Err(anyhow!(...)) — 플러그인 등록 거부</text>
      </svg>
    </div>
  );
}
