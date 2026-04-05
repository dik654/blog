export default function RiskSignalsFlagsViz() {
  const signals = [
    { name: 'has_suspicious_hooks', desc: '훅에 위험 명령' },
    { name: 'has_external_mcp',     desc: '원격 MCP 서버' },
    { name: 'has_env_exfil',        desc: '.env 읽는 훅' },
    { name: 'has_unusual_perms',    desc: '실행 권한 이상' },
    { name: 'has_recent_changes',   desc: 'CLAUDE.md 최근 수정' },
  ];

  const flags = [
    { name: 'NoHooks',       desc: '훅 실행 금지' },
    { name: 'NoSlashCmds',   desc: '슬래시 명령 금지' },
    { name: 'NoMcpServers',  desc: 'MCP 서버 금지' },
    { name: 'NoAutoRun',     desc: '자동 실행 금지' },
    { name: 'ReadOnlyFs',    desc: 'FS 읽기 전용' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">RiskSignals → TrustFlag — 5 탐지 → 5 제한</text>

        <defs>
          <marker id="rsf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Left column header — RiskSignals */}
        <rect x={24} y={44} width={220} height={28} rx={5}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.5} />
        <text x={134} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          ⚠ RiskSignals (탐지)
        </text>

        {/* Right column header — TrustFlag */}
        <rect x={316} y={44} width={220} height={28} rx={5}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={426} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          🔒 TrustFlag (제한)
        </text>

        {/* Signal cards (left) */}
        {signals.map((s, i) => {
          const y = 86 + i * 50;
          return (
            <g key={i}>
              <rect x={24} y={y} width={220} height={42} rx={5}
                fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} />
              <rect x={24} y={y} width={3} height={42} fill="#ef4444" rx={1} />
              <text x={36} y={y + 17} fontSize={9.5} fontWeight={700} fontFamily="monospace" fill="#ef4444">
                {s.name}
              </text>
              <text x={36} y={y + 32} fontSize={9} fill="var(--muted-foreground)">
                {s.desc}
              </text>
            </g>
          );
        })}

        {/* Flag cards (right) */}
        {flags.map((f, i) => {
          const y = 86 + i * 50;
          return (
            <g key={i}>
              <rect x={316} y={y} width={220} height={42} rx={5}
                fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
              <rect x={316} y={y} width={3} height={42} fill="#f59e0b" rx={1} />
              <text x={328} y={y + 17} fontSize={9.5} fontWeight={700} fontFamily="monospace" fill="#f59e0b">
                {f.name}
              </text>
              <text x={328} y={y + 32} fontSize={9} fill="var(--muted-foreground)">
                {f.desc}
              </text>
            </g>
          );
        })}

        {/* Connecting arrows 1:1 */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 107 + i * 50;
          return (
            <line key={i} x1={244} y1={y} x2={316} y2={y}
              stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#rsf-arr)" />
          );
        })}

        {/* Bottom note */}
        <text x={280} y={348} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          탐지된 RiskSignal당 대응되는 TrustFlag 활성화 → 최소 권한 원칙
        </text>
      </svg>
    </div>
  );
}
