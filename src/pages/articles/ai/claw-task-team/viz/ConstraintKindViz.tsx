export default function ConstraintKindViz() {
  const constraints = [
    {
      name: 'NoTouchFiles',
      arg: 'Vec<String>',
      example: '["auth/*", "config.toml"]',
      purpose: '건드리지 않을 파일',
      color: '#ef4444',
    },
    {
      name: 'MaxChanges',
      arg: 'usize',
      example: '50',
      purpose: '최대 변경 줄수',
      color: '#f59e0b',
    },
    {
      name: 'OnlyLanguages',
      arg: 'Vec<String>',
      example: '["rust", "toml"]',
      purpose: '특정 언어만',
      color: '#3b82f6',
    },
    {
      name: 'PreservePublicApi',
      arg: '(unit)',
      example: '—',
      purpose: 'public API 유지',
      color: '#8b5cf6',
    },
    {
      name: 'NoDependencyChanges',
      arg: '(unit)',
      example: '—',
      purpose: '의존성 추가/제거 금지',
      color: '#ec4899',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 350" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">ConstraintKind — 5종 작업 제한</text>

        <text x={280} y={40} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          LLM이 넘지 말아야 할 선 — Goal과 쌍
        </text>

        {constraints.map((c, i) => {
          const y = 56 + i * 56;
          return (
            <g key={i}>
              <rect x={24} y={y} width={512} height={48} rx={6}
                fill={c.color} fillOpacity={0.1} stroke={c.color} strokeWidth={1.4} />
              <rect x={24} y={y} width={4} height={48} fill={c.color} rx={1} />

              {/* Name + type */}
              <text x={38} y={y + 20} fontSize={11} fontWeight={700} fontFamily="monospace" fill={c.color}>
                {c.name}
              </text>
              <text x={38 + c.name.length * 6.8} y={y + 20} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
                {c.arg}
              </text>

              {/* Purpose */}
              <text x={38} y={y + 37} fontSize={9.5} fill="var(--foreground)">
                {c.purpose}
              </text>

              {/* Example */}
              <rect x={340} y={y + 12} width={184} height={24} rx={4}
                fill="var(--muted)" opacity={0.6} stroke="var(--border)" strokeWidth={0.5} />
              <text x={348} y={y + 22} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">
                EXAMPLE
              </text>
              <text x={348} y={y + 32} fontSize={9} fontFamily="monospace" fill={c.color}>
                {c.example.length > 26 ? c.example.slice(0, 25) + '…' : c.example}
              </text>
            </g>
          );
        })}

        {/* Bottom pattern */}
        <rect x={24} y={336} width={512} height={10} rx={3}
          fill="var(--muted)" opacity={0.4} />
      </svg>
    </div>
  );
}
