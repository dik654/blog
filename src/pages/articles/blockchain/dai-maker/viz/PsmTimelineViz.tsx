export default function PsmTimelineViz() {
  const events = [
    {
      date: '2020.03 이전',
      title: 'ETH 담보만',
      desc: 'DAI 페그 $0.97~$1.05',
      detail: '담보 자체가 변동성',
      color: '#f59e0b',
      bad: true,
    },
    {
      date: '2020.03.12',
      title: '블랙서스데이',
      desc: 'DAI 최고 $1.10',
      detail: '공급 부족 · 수요 급증',
      color: '#ef4444',
      bad: true,
    },
    {
      date: '2020.04',
      title: 'USDC 담보 추가',
      desc: 'Stability Anchor',
      detail: 'USDC = $1 고정',
      color: '#06b6d4',
      bad: false,
    },
    {
      date: '2020.12',
      title: 'PSM 런칭',
      desc: '1:1 USDC ↔ DAI',
      detail: '수수료 0%',
      color: '#10b981',
      bad: false,
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 260" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">PSM 도입 배경 — 2020년 타임라인</text>

        {/* 중앙 타임라인 바 */}
        <line x1={50} y1={130} x2={490} y2={130} stroke="var(--border)" strokeWidth={2} />

        {events.map((e, i) => {
          const x = 80 + i * 120;
          const isAbove = i % 2 === 0;
          const boxY = isAbove ? 44 : 154;
          return (
            <g key={i}>
              {/* 타임라인 점 */}
              <circle cx={x} cy={130} r={8} fill={e.color} stroke="var(--card)" strokeWidth={2} />
              {/* 연결선 */}
              <line x1={x} y1={isAbove ? 122 : 138} x2={x} y2={isAbove ? 114 : 150}
                stroke={e.color} strokeWidth={1.5} />

              {/* 이벤트 박스 */}
              <rect x={x - 56} y={boxY} width={112} height={68} rx={6}
                fill={e.color} fillOpacity={0.1} stroke={e.color} strokeWidth={0.8}
                strokeDasharray={e.bad ? "3 2" : undefined} />
              <text x={x} y={boxY + 16} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={e.color}>{e.date}</text>
              <text x={x} y={boxY + 32} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">{e.title}</text>
              <text x={x} y={boxY + 48} textAnchor="middle" fontSize={9}
                fill="var(--foreground)">{e.desc}</text>
              <text x={x} y={boxY + 61} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{e.detail}</text>
            </g>
          );
        })}

        {/* 하단 설명 */}
        <text x={260} y={240} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">ETH 담보 단일 → 위기 → USDC 도입 → PSM 무한 유동성 (9개월 여정)</text>
      </svg>
    </div>
  );
}
