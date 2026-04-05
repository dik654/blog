export default function SlashCommandViz() {
  const cmds = [
    { label: '/help', desc: '도움말', color: '#3b82f6' },
    { label: '/exit', desc: '종료', color: '#ef4444' },
    { label: '/clear', desc: '화면 지우기', color: '#8b5cf6' },
    { label: '/compact', desc: '컴팩션', color: '#f59e0b' },
    { label: '/fork', desc: '세션 포크', color: '#10b981' },
    { label: '/status', desc: '세션 상태', color: '#3b82f6' },
    { label: '/mode', desc: '권한 모드', color: '#f59e0b' },
    { label: '/plan', desc: 'Plan 모드', color: '#8b5cf6' },
    { label: '/mcp', desc: 'MCP 관리', color: '#10b981' },
    { label: '/plugin', desc: '플러그인', color: '#10b981' },
    { label: '/config', desc: '설정', color: '#6b7280' },
    { label: '/cost', desc: '비용', color: '#f59e0b' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">12 슬래시 명령</text>

        {cmds.map((c, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 35 + col * 164;
          const y = 56 + row * 62;
          return (
            <g key={c.label}>
              <rect x={x} y={y} width={152} height={52} rx={6}
                fill={c.color} fillOpacity={0.1} stroke={c.color} strokeWidth={1} />
              <text x={x + 76} y={y + 22} textAnchor="middle" fontSize={11} fontWeight={700}
                fontFamily="monospace" fill={c.color}>{c.label}</text>
              <text x={x + 76} y={y + 40} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{c.desc}</text>
            </g>
          );
        })}

        <text x={280} y={308} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">.claw/slash-commands/ 디렉토리에 커스텀 명령 추가 가능</text>
      </svg>
    </div>
  );
}
