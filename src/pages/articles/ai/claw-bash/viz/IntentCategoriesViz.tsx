export default function IntentCategoriesViz() {
  const categories = [
    { name: 'Read', cmds: 'ls, cat, grep, find', color: '#10b981' },
    { name: 'Write', cmds: 'mv, cp, mkdir, touch', color: '#3b82f6' },
    { name: 'Destructive', cmds: 'rm, shred, dd, mkfs', color: '#ef4444' },
    { name: 'Network', cmds: 'curl, wget, ssh, nc', color: '#8b5cf6' },
    { name: 'Execute', cmds: 'python, node, bash', color: '#f59e0b' },
    { name: 'Package', cmds: 'apt, npm, cargo', color: '#06b6d4' },
    { name: 'System', cmds: 'sudo, systemctl', color: '#ec4899' },
    { name: 'Unknown', cmds: '(분류 불가)', color: '#6b7280' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">CommandIntent — 8가지 명령 분류</text>

        {categories.map((cat, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 30 + col * 130;
          const y = 60 + row * 120;
          return (
            <g key={cat.name}>
              <rect x={x} y={y} width={120} height={100} rx={8}
                fill={cat.color} fillOpacity={0.1}
                stroke={cat.color} strokeWidth={1} />
              <text x={x + 60} y={y + 26} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={cat.color}>{cat.name}</text>
              <line x1={x + 12} y1={y + 34} x2={x + 108} y2={y + 34}
                stroke={cat.color} strokeWidth={0.5} opacity={0.3} />
              <foreignObject x={x + 10} y={y + 42} width={100} height={52}>
                <div style={{ fontSize: 9, color: 'var(--muted-foreground)', textAlign: 'center', lineHeight: '1.35' }}>
                  {cat.cmds}
                </div>
              </foreignObject>
            </g>
          );
        })}

        <text x={280} y={322} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">첫 단어 매칭 · 50+ 명령어 인식 · Destructive는 이중 확인</text>
      </svg>
    </div>
  );
}
