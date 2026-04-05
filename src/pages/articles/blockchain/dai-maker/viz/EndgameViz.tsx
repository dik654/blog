export default function EndgameViz() {
  const phases = [
    {
      n: 1,
      title: 'Free-Float DAI',
      period: '2024-2026',
      color: '#3b82f6',
      items: [
        'DAI를 USD 페그에서 점진적 분리',
        'USDC 담보 단계 제거',
        '"crypto-native" stable 지향',
      ],
    },
    {
      n: 2,
      title: 'SubDAO 시스템',
      period: '2024~',
      color: '#8b5cf6',
      items: [
        'specialized SubDAO 분할',
        'Spark: DAI 기반 lending',
        '각자 토큰 & 거버넌스',
      ],
    },
    {
      n: 3,
      title: 'New Stable Token',
      period: '2024~',
      color: '#10b981',
      items: [
        'DAI → USDS 리브랜딩',
        'MKR → SKY 리브랜딩',
        'USD-agnostic 방향',
      ],
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">MakerDAO Endgame — 3단계 로드맵 (Rune Christensen 2022)</text>

        {/* 현재 상태 */}
        <rect x={20} y={40} width={480} height={40} rx={6}
          fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={58} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--muted-foreground)">현재 상태 (2024)</text>
        <text x={260} y={74} textAnchor="middle" fontSize={10}
          fill="var(--foreground)">USDC 30% · 중앙화 의존 · MKR 보유 집중 · PSM 페그 핵심</text>

        {/* 3단계 */}
        {phases.map((p, i) => {
          const x = 20 + i * 163;
          return (
            <g key={p.n}>
              {/* 박스 */}
              <rect x={x} y={92} width={155} height={150} rx={8}
                fill={p.color} fillOpacity={0.08} stroke={p.color} strokeWidth={1} />

              {/* Phase 번호 */}
              <circle cx={x + 26} cy={114} r={16} fill={p.color} />
              <text x={x + 26} y={119} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
                {p.n}
              </text>

              {/* 제목 */}
              <text x={x + 50} y={110} fontSize={12} fontWeight={700} fill={p.color}>Phase {p.n}</text>
              <text x={x + 50} y={125} fontSize={9} fill="var(--muted-foreground)">{p.period}</text>

              {/* 서브 제목 */}
              <text x={x + 78} y={148} textAnchor="middle" fontSize={12} fontWeight={700}
                fill="var(--foreground)">{p.title}</text>

              {/* 구분선 */}
              <line x1={x + 14} y1={158} x2={x + 141} y2={158}
                stroke={p.color} strokeWidth={0.5} opacity={0.4} />

              {/* 항목들 */}
              {p.items.map((item, j) => (
                <g key={j}>
                  <circle cx={x + 20} cy={178 + j * 22} r={2.5} fill={p.color} />
                  <text x={x + 28} y={182 + j * 22} fontSize={9.5} fill="var(--foreground)">{item}</text>
                </g>
              ))}
            </g>
          );
        })}

        {/* 화살표 */}
        <defs>
          <marker id="eg-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>
        <line x1={175} y1={167} x2={183} y2={167} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#eg-arr)" />
        <line x1={338} y1={167} x2={346} y2={167} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#eg-arr)" />

        {/* 최종 목표 */}
        <rect x={20} y={254} width={480} height={60} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={260} y={274} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#10b981">최종 목표 — 진정한 탈중앙 스테이블</text>
        <text x={260} y={292} textAnchor="middle" fontSize={10}
          fill="var(--foreground)">USDC 담보 0% · ETH + RWA + 암호자산 담보만 · USD 페그 초월</text>
        <text x={260} y={308} textAnchor="middle" fontSize={9.5}
          fill="var(--muted-foreground)">MakerDAO 7년 경험의 결정판 — "crypto-native" 화폐</text>

        <text x={260} y={332} textAnchor="middle" fontSize={10} fontStyle="italic"
          fill="var(--muted-foreground)">이상과 현실의 균형 — Endgame은 "더 나은 탈중앙" 이동 계획</text>
      </svg>
    </div>
  );
}
