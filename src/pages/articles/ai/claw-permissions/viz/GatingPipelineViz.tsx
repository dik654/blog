export default function GatingPipelineViz() {
  const stages = [
    { n: 1, label: 'Context\nOverride', kind: 'gate', color: '#8b5cf6' },
    { n: 2, label: 'Permission\nMode', kind: 'gate', color: '#3b82f6' },
    { n: 3, label: 'Permission\nPolicy', kind: 'gate', color: '#3b82f6' },
    { n: 4, label: 'Path\nCheck', kind: 'gate', color: '#3b82f6' },
    { n: 5, label: 'Pre-hook', kind: 'gate', color: '#f59e0b' },
    { n: 6, label: 'execute\ntool', kind: 'exec', color: '#10b981' },
    { n: 7, label: 'Post-hook', kind: 'audit', color: '#06b6d4' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">권한 게이팅 — 7단계 조기 종료 파이프라인</text>

        <defs>
          <marker id="gp-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
          <marker id="gp-deny" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        {/* Input */}
        <rect x={24} y={68} width={68} height={44} rx={6}
          fill="#94a3b8" fillOpacity={0.15} stroke="#94a3b8" strokeWidth={1.4} />
        <text x={58} y={86} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          tool call
        </text>
        <text x={58} y={100} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          (name, args)
        </text>

        {/* 7 stages */}
        {stages.map((s, i) => {
          const x = 100 + i * 64;
          return (
            <g key={s.n}>
              <rect x={x} y={68} width={56} height={44} rx={6}
                fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={1.4} />
              <text x={x + 28} y={82} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={s.color}>
                {s.n}
              </text>
              {s.label.split('\n').map((line, li) => (
                <text key={li} x={x + 28} y={96 + li * 10} textAnchor="middle" fontSize={9} fill={s.color}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* Arrows between stages (horizontal flow) */}
        {stages.slice(0, -1).map((_, i) => {
          const x = 156 + i * 64;
          return (
            <line key={i} x1={x} y1={90} x2={x + 8} y2={90}
              stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#gp-arr)" />
          );
        })}
        {/* Input → stage 1 */}
        <line x1={92} y1={90} x2={100} y2={90} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#gp-arr)" />

        {/* Deny branches (stages 1-5) dropping down to a shared deny row */}
        {stages.slice(0, 5).map((s, i) => {
          const x = 100 + i * 64 + 28;
          return (
            <g key={`deny-${i}`}>
              <line x1={x} y1={112} x2={x} y2={146}
                stroke="#ef4444" strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#gp-deny)" />
            </g>
          );
        })}

        {/* Deny row — shared */}
        <rect x={100} y={150} width={312} height={32} rx={6}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1.4} strokeDasharray="4 2" />
        <text x={256} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          Deny → 즉시 종료 (이후 단계 스킵)
        </text>

        {/* Post-hook warning branch */}
        <line x1={512} y1={112} x2={512} y2={146} stroke="#06b6d4" strokeWidth={1.2} strokeDasharray="3 2" />
        <rect x={446} y={150} width={96} height={32} rx={6}
          fill="#06b6d4" fillOpacity={0.1} stroke="#06b6d4" strokeWidth={1.4} strokeDasharray="4 2" />
        <text x={494} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill="#06b6d4">
          Warning only
        </text>
        <text x={494} y={174} textAnchor="middle" fontSize={8.5} fill="#06b6d4">
          실행 결과 유지
        </text>

        {/* Legend / annotations below */}
        <rect x={24} y={202} width={512} height={104} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={222} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          단계별 역할
        </text>

        <g transform="translate(38, 232)">
          {[
            { n: '1-4', desc: '시스템 게이트 — 설정/정책/경로 검증, Deny 시 차단', color: '#3b82f6' },
            { n: '5',   desc: 'Pre-hook — 사용자 커스텀 abort 가능 (마지막 방어선)', color: '#f59e0b' },
            { n: '6',   desc: 'Tool 실행 — 부수 효과 발생 지점', color: '#10b981' },
            { n: '7',   desc: 'Post-hook — 감사/로깅 전용, 차단 불가', color: '#06b6d4' },
          ].map((row, i) => (
            <g key={i} transform={`translate(0, ${i * 16})`}>
              <rect x={0} y={0} width={20} height={12} rx={2} fill={row.color} fillOpacity={0.3} stroke={row.color} strokeWidth={0.8} />
              <text x={10} y={10} textAnchor="middle" fontSize={9} fontWeight={700} fill={row.color}>{row.n}</text>
              <text x={28} y={10} fontSize={9.5} fill="var(--muted-foreground)">{row.desc}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
