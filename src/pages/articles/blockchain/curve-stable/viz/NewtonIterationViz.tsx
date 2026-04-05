export default function NewtonIterationViz() {
  // Simulated Newton iterations for get_D
  const iterations = [
    { n: 0, D: 10000000, diff: '-' },
    { n: 1, D: 9950000, diff: '50,000' },
    { n: 2, D: 9985234, diff: '35,234' },
    { n: 3, D: 9999812, diff: '14,578' },
    { n: 4, D: 10000051, diff: '239' },
    { n: 5, D: 10000053, diff: '2' },
    { n: 6, D: 10000053, diff: '0 (수렴)' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">get_D — Newton&apos;s Method 수렴 과정</text>

        {/* 헤더 */}
        <rect x={20} y={44} width={480} height={28} rx={4}
          fill="var(--muted)" opacity={0.5} />
        <text x={70} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          iter
        </text>
        <text x={240} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          D (추정치)
        </text>
        <text x={420} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          diff
        </text>

        {/* 반복 */}
        {iterations.map((it, i) => {
          const y = 78 + i * 32;
          const converged = i === iterations.length - 1;
          return (
            <g key={i}>
              <rect x={20} y={y} width={480} height={30} rx={4}
                fill={converged ? '#10b981' : '#3b82f6'}
                fillOpacity={converged ? 0.12 : 0.05}
                stroke={converged ? '#10b981' : '#3b82f6'}
                strokeWidth={converged ? 1 : 0.4} />
              <circle cx={70} cy={y + 15} r={10} fill={converged ? '#10b981' : '#3b82f6'} />
              <text x={70} y={y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
                {it.n}
              </text>
              <text x={240} y={y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                {it.D.toLocaleString()}
              </text>
              <text x={420} y={y + 19} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={converged ? '#10b981' : 'var(--muted-foreground)'}>
                {it.diff}
              </text>
            </g>
          );
        })}

        {/* 수렴 조건 */}
        <rect x={20} y={308} width={480} height={26} rx={4}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.6} />
        <text x={260} y={326} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          수렴 조건: abs(D − D_prev) ≤ 1 wei · 평균 4-6 iter · 최대 255 iter
        </text>
      </svg>
    </div>
  );
}
