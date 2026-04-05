export default function MultiCollateralViz() {
  const ilks = [
    { name: 'ETH-A', ratio: 150, sf: 5, line: 500, color: '#3b82f6', type: '표준' },
    { name: 'ETH-B', ratio: 130, sf: 7, line: 100, color: '#ef4444', type: '고수익' },
    { name: 'ETH-C', ratio: 170, sf: 3, line: 100, color: '#10b981', type: '보수적' },
    { name: 'WBTC-A', ratio: 150, sf: 4, line: 300, color: '#f59e0b', type: '표준' },
    { name: 'wstETH', ratio: 160, sf: 4, line: 200, color: '#8b5cf6', type: 'LSD' },
    { name: 'USDC-A', ratio: 101, sf: 0.5, line: 1000, color: '#06b6d4', type: 'PSM' },
    { name: 'RWA', ratio: 100, sf: 3.5, line: 500, color: '#6b7280', type: '국채' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Multi-Collateral — Ilk별 파라미터</text>

        {/* 헤더 */}
        <rect x={20} y={40} width={480} height={28} fill="var(--muted)" rx={4} />
        <text x={75} y={58} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Ilk</text>
        <text x={160} y={58} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">담보비율</text>
        <text x={250} y={58} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">SF (연)</text>
        <text x={340} y={58} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Line ($M)</text>
        <text x={435} y={58} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">유형</text>

        {/* 행들 */}
        {ilks.map((ilk, i) => {
          const y = 75 + i * 32;
          return (
            <g key={ilk.name}>
              <rect x={20} y={y} width={480} height={30} rx={4}
                fill={ilk.color} fillOpacity={0.06} stroke={ilk.color} strokeWidth={0.5} />

              {/* 색 인디케이터 */}
              <rect x={20} y={y} width={5} height={30} fill={ilk.color} rx={2} />

              <text x={75} y={y + 20} textAnchor="middle" fontSize={12}
                fontWeight={700} fill={ilk.color}>{ilk.name}</text>

              {/* 담보비율 바 */}
              <text x={160} y={y + 14} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="var(--foreground)">{ilk.ratio}%</text>
              <rect x={123} y={y + 18} width={74} height={5} fill="var(--border)" opacity={0.3} rx={2} />
              <rect x={123} y={y + 18} width={Math.min(74, (ilk.ratio / 200) * 74)} height={5}
                fill={ilk.color} rx={2} />

              {/* SF */}
              <text x={250} y={y + 20} textAnchor="middle" fontSize={10}
                fill="var(--foreground)">{ilk.sf}%</text>

              {/* Line */}
              <text x={340} y={y + 20} textAnchor="middle" fontSize={10}
                fill="var(--foreground)">${ilk.line}M</text>

              {/* 유형 */}
              <text x={435} y={y + 20} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">{ilk.type}</text>
            </g>
          );
        })}

        {/* 하단 설명 */}
        <text x={260} y={320} textAnchor="middle" fontSize={11} fontWeight={600}
          fill="var(--foreground)">담보 유형마다 독립 리스크 파라미터</text>
        <text x={260} y={338} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">같은 ETH도 A/B/C 구분 → 리스크 선호도에 따라 선택</text>
        <text x={260} y={354} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">USDC-A: PSM 담보 (1:1 교환) · RWA: 국채·기업대출 담보</text>
      </svg>
    </div>
  );
}
