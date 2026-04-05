export default function RulesDslViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PolicyCondition DSL — 조합 연산자</text>

        {/* 조건 카테고리 */}
        <text x={280} y={54} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          조건 타입
        </text>

        <g transform="translate(30, 64)">
          {[
            { category: '조합', items: ['And', 'Or', 'Not'], color: '#8b5cf6' },
            { category: '상태', items: ['StatusIs', 'StatusFor'], color: '#3b82f6' },
            { category: '빌드', items: ['BuildGreen', 'TestsPass', 'LintClean'], color: '#10b981' },
            { category: '시간', items: ['FailureCount', 'TimeElapsed'], color: '#f59e0b' },
            { category: '고급', items: ['Custom (Lua)'], color: '#ef4444' },
          ].map((cat, i) => (
            <g key={cat.category} transform={`translate(0, ${i * 44})`}>
              <rect x={0} y={0} width={100} height={34} rx={4}
                fill={cat.color} fillOpacity={0.15} stroke={cat.color} strokeWidth={0.8} />
              <text x={50} y={22} textAnchor="middle" fontSize={10.5} fontWeight={700}
                fill={cat.color}>{cat.category}</text>

              <g transform="translate(110, 3)">
                {cat.items.map((item, j) => (
                  <g key={item} transform={`translate(${j * 125}, 0)`}>
                    <rect x={0} y={0} width={120} height={28} rx={3}
                      fill={cat.color} fillOpacity={0.08} stroke={cat.color} strokeWidth={0.4} />
                    <text x={60} y={19} textAnchor="middle" fontSize={9} fontWeight={600}
                      fontFamily="monospace" fill={cat.color}>{item}</text>
                  </g>
                ))}
              </g>
            </g>
          ))}
        </g>

        <text x={280} y={300} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">YAML 선언형 + Lua 임베디드 (고급 케이스)</text>
      </svg>
    </div>
  );
}
