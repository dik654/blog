export default function FileOpsToolsViz() {
  const tools = [
    { name: 'read_file', perm: 'ReadOnly', color: '#10b981' },
    { name: 'write_file', perm: 'WorkspaceWrite', color: '#3b82f6' },
    { name: 'edit_file', perm: 'WorkspaceWrite', color: '#3b82f6' },
    { name: 'glob_search', perm: 'ReadOnly', color: '#10b981' },
    { name: 'grep_search', perm: 'ReadOnly', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">파일 I/O 5개 도구 + 4단계 방어</text>

        {/* 도구들 */}
        {tools.map((t, i) => {
          const x = 30 + i * 104;
          return (
            <g key={t.name}>
              <rect x={x} y={54} width={94} height={58} rx={6}
                fill={t.color} fillOpacity={0.1} stroke={t.color} strokeWidth={0.8} />
              <text x={x + 47} y={74} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={t.color}>{t.name}</text>
              <line x1={x + 10} y1={82} x2={x + 84} y2={82}
                stroke={t.color} strokeWidth={0.3} opacity={0.4} />
              <text x={x + 47} y={98} textAnchor="middle" fontSize={8.5}
                fill="var(--muted-foreground)">{t.perm}</text>
            </g>
          );
        })}

        {/* 방어 레이어 */}
        <text x={280} y={142} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">4단계 방어 레이어 (순차 검증)</text>

        {[
          { label: '1. 권한 모드 체크', sub: 'ReadOnly: write 거부', color: '#3b82f6' },
          { label: '2. 워크스페이스 경계', sub: 'path.starts_with(root)', color: '#8b5cf6' },
          { label: '3. 블랙리스트', sub: '.env, .git/, *.pem', color: '#f59e0b' },
          { label: '4. 심링크 이스케이프', sub: 'canonicalize() 재검증', color: '#ef4444' },
        ].map((layer, i) => (
          <g key={i}>
            <rect x={30} y={160 + i * 28} width={500} height={24} rx={3}
              fill={layer.color} fillOpacity={0.1} stroke={layer.color} strokeWidth={0.5} />
            <rect x={30} y={160 + i * 28} width={3} height={24} fill={layer.color} rx={1} />
            <text x={48} y={176 + i * 28} fontSize={10} fontWeight={700} fill={layer.color}>
              {layer.label}
            </text>
            <text x={515} y={176 + i * 28} textAnchor="end" fontSize={9} fontFamily="monospace"
              fill="var(--muted-foreground)">{layer.sub}</text>
          </g>
        ))}

        <text x={280} y={288} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">각 단계 실패 시 즉시 종료 — defense in depth</text>
      </svg>
    </div>
  );
}
