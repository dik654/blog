export default function BlackThursdayViz() {
  const events = [
    { time: '00:00', event: 'ETH $200 거래', state: '정상', color: '#10b981' },
    { time: '03:00', event: 'ETH 급락 시작', state: '불안정', color: '#f59e0b' },
    { time: '06:00', event: 'Gas 200+ gwei', state: '네트워크 혼잡', color: '#f59e0b' },
    { time: '12:00', event: 'ETH $130', state: '청산 경매 시작', color: '#ef4444' },
    { time: '18:00', event: 'Gas 1000+ gwei', state: '입찰 실패', color: '#ef4444' },
    { time: '24:00', event: 'ETH $90 · 0 DAI 낙찰', state: '$4.5M bad debt', color: '#991b1b' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">블랙서스데이 (2020.03.12) — 24시간 재난 시퀀스</text>

        {/* 타임라인 */}
        <line x1={80} y1={62} x2={80} y2={282} stroke="var(--border)" strokeWidth={2} />

        {events.map((e, i) => {
          const y = 62 + i * 38;
          return (
            <g key={i}>
              {/* 시간 점 */}
              <circle cx={80} cy={y} r={6} fill={e.color} stroke="var(--card)" strokeWidth={2} />

              {/* 시간 텍스트 */}
              <text x={66} y={y + 4} textAnchor="end" fontSize={10} fontWeight={700} fill={e.color}>
                {e.time}
              </text>

              {/* 이벤트 박스 */}
              <rect x={98} y={y - 16} width={300} height={32} rx={6}
                fill={e.color} fillOpacity={0.08} stroke={e.color} strokeWidth={0.8} />
              <text x={110} y={y - 1} fontSize={11} fontWeight={700} fill="var(--foreground)">
                {e.event}
              </text>
              <text x={110} y={y + 12} fontSize={9.5} fill="var(--muted-foreground)">
                {e.state}
              </text>

              {/* 심각도 인디케이터 */}
              <rect x={410} y={y - 12} width={80} height={24} rx={4}
                fill="var(--card)" stroke={e.color} strokeWidth={0.6} />
              <text x={450} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={e.color}>
                {i <= 1 ? '●○○○' : i <= 2 ? '●●○○' : i <= 3 ? '●●●○' : '●●●●'}
              </text>
            </g>
          );
        })}

        {/* 근본 원인 */}
        <text x={260} y={306} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">근본 원인 (Liquidations 1.0 — English Auction)</text>

        {[
          { label: '3일 경매', desc: '너무 긴 시간' },
          { label: '누진 입찰', desc: 'gas 경쟁 필요' },
          { label: 'Oracle 지연', desc: '가격 업데이트 실패' },
        ].map((c, i) => {
          const x = 20 + i * 163;
          return (
            <g key={i}>
              <rect x={x} y={316} width={154} height={36} rx={4}
                fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.6} strokeDasharray="3 2" />
              <text x={x + 77} y={331} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
                {c.label}
              </text>
              <text x={x + 77} y={345} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {c.desc}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
