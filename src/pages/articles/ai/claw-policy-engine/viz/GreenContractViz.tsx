export default function GreenContractViz() {
  const checks = [
    { label: 'build: green', status: true, color: '#10b981' },
    { label: 'tests: 487/487', status: true, color: '#10b981' },
    { label: 'coverage: 84.2% ≥ 80%', status: true, color: '#10b981' },
    { label: 'lint: 0 warnings', status: true, color: '#10b981' },
    { label: 'security: no issues', status: true, color: '#10b981' },
    { label: 'consecutive: 2/2', status: true, color: '#10b981' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">GreenContract — 머지 품질 게이트</text>

        {/* 컨테이너 */}
        <rect x={40} y={54} width={480} height={226} rx={10}
          fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={1.5} />
        <text x={280} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Lane #42 — feat/add-auth
        </text>
        <text x={280} y={91} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          Status: ReadyToMerge
        </text>

        {/* 체크 리스트 */}
        {checks.map((check, i) => (
          <g key={check.label} transform={`translate(60, ${110 + i * 24})`}>
            <rect x={0} y={0} width={440} height={20} rx={3}
              fill={check.color} fillOpacity={0.08} stroke={check.color} strokeWidth={0.3} />
            <text x={10} y={15} fontSize={12} fill="#10b981">✓</text>
            <text x={30} y={15} fontSize={10} fontWeight={600} fontFamily="monospace" fill="var(--foreground)">
              {check.label}
            </text>
          </g>
        ))}

        <rect x={60} y={258} width={440} height={14} rx={3}
          fill="#10b981" fillOpacity={0.2} />
        <text x={280} y={268} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">
          Ready to merge!
        </text>

        <text x={280} y={314} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">모든 체크 통과 시 자동 MergeBranch 액션 실행</text>
      </svg>
    </div>
  );
}
