/**
 * 데이터 분석 워크플로우 — raw → 가설 → SQL → 검증 → 인사이트.
 */
export default function AnalysisFlowViz() {
  const W = 720;
  const H = 360;

  const steps = [
    { n: '1', label: '신호 발견', sub: '대시보드 / alert / 사용자 보고', color: '#3b82f6' },
    { n: '2', label: '가설 수립', sub: '“만약 X 가 원인이면 Y 가 보일 것”', color: '#10b981' },
    { n: '3', label: '쿼리 작성', sub: 'SQL · jq · grep · pandas', color: '#f59e0b' },
    { n: '4', label: '결과 검증', sub: 'sample 확인 · 다른 각도 cross-check', color: '#8b5cf6' },
    { n: '5', label: '인사이트 도출', sub: '근본 원인 또는 다음 가설', color: '#ec4899' },
    { n: '6', label: '액션 / 공유', sub: 'fix · postmortem · runbook · 대시보드', color: '#06b6d4' },
  ];

  const itemH = 42;
  const gap = 6;
  const yStart = 50;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">데이터 분석 워크플로우 — 신호에서 액션까지 6 단계</text>

        {steps.map((s, i) => {
          const y = yStart + i * (itemH + gap);
          return (
            <g key={s.n}>
              <circle cx={50} cy={y + itemH / 2} r={16}
                fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={1.4} />
              <text x={50} y={y + itemH / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={s.color}>{s.n}</text>

              <rect x={80} y={y} width={620} height={itemH} rx={5}
                fill={s.color} fillOpacity={0.05} stroke={s.color} strokeWidth={0.8} />
              <text x={94} y={y + 18} fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={94} y={y + 34} fontSize={9.5} fill="var(--muted-foreground)">{s.sub}</text>

              {i < steps.length - 1 && (
                <line x1={50} y1={y + itemH + 1} x2={50} y2={y + itemH + gap}
                  stroke={s.color} strokeWidth={1.5} />
              )}
            </g>
          );
        })}

        {/* 루프 화살표 (6 → 2) */}
        <path d={`M 50 ${yStart + 5 * (itemH + gap) + itemH + 5} Q 25 ${yStart + 1.5 * (itemH + gap)}, 50 ${yStart + (itemH + gap) - 5}`}
          stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 2" fill="none" opacity={0.6} />
        <text x={20} y={yStart + 2.5 * (itemH + gap)} fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">반복</text>
      </svg>
    </div>
  );
}
