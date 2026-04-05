export default function PathAttackVectorsViz() {
  const attacks = [
    {
      n: 1,
      title: '상위 디렉토리 이동',
      input: '../../etc/passwd',
      defense: '절대 경로 정규화',
      detection: 'canonicalize() → workspace prefix 불일치',
      stage: 'clean() + canonicalize()',
    },
    {
      n: 2,
      title: '심링크 이스케이프',
      input: 'link → /etc/passwd',
      defense: 'canonicalize로 심링크 해제',
      detection: '실제 경로가 workspace 밖',
      stage: 'canonicalize() 5단계',
    },
    {
      n: 3,
      title: '절대 경로 직접 지정',
      input: '/etc/shadow',
      defense: '절대 경로 자체 차단',
      detection: 'is_absolute() && !in_workspace',
      stage: '3단계 is_absolute check',
    },
    {
      n: 4,
      title: 'Windows 특수 경로',
      input: '\\\\?\\C:\\Windows\\System32',
      defense: 'UNC prefix 탐지',
      detection: 'path.starts_with("\\\\?\\")',
      stage: '1단계 clean()',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 400" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">경계 위반 공격 4종 — input → defense</text>

        <defs>
          <marker id="pav-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {attacks.map((a, i) => {
          const y = 50 + i * 86;
          return (
            <g key={a.n}>
              {/* Number badge */}
              <circle cx={40} cy={y + 34} r={16} fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" strokeWidth={1.8} />
              <text x={40} y={y + 39} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
                {a.n}
              </text>

              {/* Title */}
              <text x={64} y={y + 14} fontSize={11} fontWeight={700} fill="var(--foreground)">
                {a.title}
              </text>

              {/* Malicious input card */}
              <rect x={64} y={y + 20} width={196} height={36} rx={5}
                fill="#ef4444" fillOpacity={0.12} stroke="#ef4444" strokeWidth={1.4} />
              <rect x={64} y={y + 20} width={3} height={36} fill="#ef4444" rx={1} />
              <text x={72} y={y + 33} fontSize={8.5} fontWeight={700} fill="#ef4444">
                MALICIOUS INPUT
              </text>
              <text x={72} y={y + 48} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                {a.input.length > 28 ? a.input.slice(0, 26) + '…' : a.input}
              </text>

              {/* Arrow */}
              <line x1={262} y1={y + 38} x2={290} y2={y + 38}
                stroke="#8b5cf6" strokeWidth={1.6} markerEnd="url(#pav-arr)" />
              <text x={276} y={y + 33} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="#8b5cf6">
                {a.stage.length > 18 ? a.stage.slice(0, 17) + '…' : a.stage}
              </text>

              {/* Defense card */}
              <rect x={294} y={y + 20} width={242} height={36} rx={5}
                fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1.4} />
              <rect x={294} y={y + 20} width={3} height={36} fill="#10b981" rx={1} />
              <text x={302} y={y + 33} fontSize={8.5} fontWeight={700} fill="#10b981">
                DEFENSE
              </text>
              <text x={302} y={y + 48} fontSize={9} fill="var(--foreground)">
                {a.detection.length > 40 ? a.detection.slice(0, 38) + '…' : a.detection}
              </text>

              {/* Separator line */}
              {i < attacks.length - 1 && (
                <line x1={24} y1={y + 72} x2={536} y2={y + 72} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 3" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
