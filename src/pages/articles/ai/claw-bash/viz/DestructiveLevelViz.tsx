export default function DestructiveLevelViz() {
  const levels = [
    {
      level: 'Low',
      color: '#10b981',
      example: 'rm file.txt',
      condition: '단일 파일',
      action: '즉시 실행',
    },
    {
      level: 'Medium',
      color: '#f59e0b',
      example: 'rm -r dir',
      condition: '-r flag (no -f)',
      action: '단일 확인',
    },
    {
      level: 'High',
      color: '#f97316',
      example: 'rm -rf dir',
      condition: '-rf + 특정 경로',
      action: '단일 확인 + 경로 강조',
    },
    {
      level: 'Critical',
      color: '#ef4444',
      example: 'rm -rf /path · rm -rf *',
      condition: '-rf + / 또는 *',
      action: '이중 확인 필수',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">DestructiveLevel — rm 명령 4단계 위험도</text>

        {/* Severity bar */}
        <g transform="translate(24, 44)">
          <rect x={0} y={0} width={512} height={6} rx={3}
            fill="url(#sev-grad)" />
          <defs>
            <linearGradient id="sev-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="33%" stopColor="#f59e0b" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <text x={0} y={22} fontSize={9} fill="var(--muted-foreground)">안전</text>
          <text x={512} y={22} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">치명적</text>
        </g>

        {levels.map((l, i) => {
          const y = 84 + i * 50;
          return (
            <g key={i}>
              <rect x={24} y={y} width={512} height={42} rx={6}
                fill={l.color} fillOpacity={0.1} stroke={l.color} strokeWidth={1.4} />
              <rect x={24} y={y} width={4} height={42} fill={l.color} rx={1} />

              {/* Level badge */}
              <rect x={38} y={y + 10} width={76} height={22} rx={11}
                fill={l.color} fillOpacity={0.25} stroke={l.color} strokeWidth={1} />
              <text x={76} y={y + 25} textAnchor="middle" fontSize={11} fontWeight={700} fill={l.color}>
                {l.level}
              </text>

              {/* Condition */}
              <text x={128} y={y + 18} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">
                CONDITION
              </text>
              <text x={128} y={y + 32} fontSize={9.5} fontFamily="monospace" fill="var(--foreground)">
                {l.condition}
              </text>

              {/* Example */}
              <text x={268} y={y + 18} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">
                EXAMPLE
              </text>
              <text x={268} y={y + 32} fontSize={9.5} fontFamily="monospace" fill={l.color}>
                {l.example}
              </text>

              {/* Action */}
              <text x={420} y={y + 18} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">
                ACTION
              </text>
              <text x={420} y={y + 32} fontSize={9.5} fontWeight={700} fill={l.color}>
                {l.action}
              </text>
            </g>
          );
        })}

        {/* Bottom flow */}
        <text x={280} y={292} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          analyze_rm(cmd) → {`-rf`} + {`/ or *`} 조합 탐지 → Critical 단계 → 이중 확인 프롬프트
        </text>
      </svg>
    </div>
  );
}
