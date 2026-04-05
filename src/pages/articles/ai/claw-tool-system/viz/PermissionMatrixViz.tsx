export default function PermissionMatrixViz() {
  const tools = [
    { name: 'read_file', readOnly: 'Allow', write: 'Allow', full: 'Allow' },
    { name: 'write_file', readOnly: 'Deny', write: 'Allow', full: 'Allow' },
    { name: 'bash', readOnly: 'Deny', write: 'Prompt', full: 'Allow' },
    { name: 'PowerShell', readOnly: 'Deny', write: 'Prompt', full: 'Allow' },
    { name: 'WebFetch', readOnly: 'Allow', write: 'Allow', full: 'Allow' },
    { name: 'MCP', readOnly: 'Prompt', write: 'Prompt', full: 'Allow' },
  ];

  const colorFor = (v: string) => v === 'Allow' ? '#10b981' : v === 'Deny' ? '#ef4444' : '#f59e0b';

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">도구 × 모드 권한 매트릭스</text>

        {/* 헤더 */}
        <rect x={20} y={48} width={520} height={30} fill="var(--muted)" rx={4} />
        <text x={90} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">도구</text>
        <text x={220} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">ReadOnly</text>
        <text x={350} y={67} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">WorkspaceWrite</text>
        <text x={480} y={67} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">DangerFullAccess</text>

        {/* 행들 */}
        {tools.map((t, i) => {
          const y = 86 + i * 36;
          return (
            <g key={t.name}>
              <rect x={20} y={y} width={520} height={32} rx={4}
                fill={i % 2 === 0 ? 'transparent' : 'var(--muted)'} opacity={0.3} />
              <text x={90} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">{t.name}</text>

              {[['readOnly', 220], ['write', 350], ['full', 480]].map(([key, x]) => {
                const val = t[key as keyof typeof t] as string;
                return (
                  <g key={key}>
                    <rect x={(x as number) - 40} y={y + 6} width={80} height={22} rx={3}
                      fill={colorFor(val)} fillOpacity={0.15} stroke={colorFor(val)} strokeWidth={0.5} />
                    <text x={x} y={y + 20} textAnchor="middle" fontSize={9} fontWeight={600}
                      fill={colorFor(val)}>{val}</text>
                  </g>
                );
              })}
            </g>
          );
        })}

        <text x={280} y={318} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">Allow (실행) · Deny (거부) · Prompt (사용자 확인)</text>
      </svg>
    </div>
  );
}
