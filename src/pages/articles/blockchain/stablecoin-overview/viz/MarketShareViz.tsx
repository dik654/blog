export default function MarketShareViz() {
  const stables = [
    { name: 'USDT', share: 55, mktCap: 130, color: '#10b981' },
    { name: 'USDC', share: 25, mktCap: 60, color: '#3b82f6' },
    { name: 'USDe', share: 2, mktCap: 5, color: '#8b5cf6' },
    { name: 'DAI/USDS', share: 2, mktCap: 5, color: '#f59e0b' },
    { name: 'FDUSD', share: 1, mktCap: 2, color: '#ec4899' },
    { name: 'Others', share: 15, mktCap: 38, color: '#6b7280' },
  ];

  let cumulativeAngle = -Math.PI / 2;
  const cx = 130;
  const cy = 130;
  const r = 80;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">스테이블코인 시장 점유율 (2025)</text>

        {/* 파이 차트 */}
        {stables.map((s, i) => {
          const angle = (s.share / 100) * Math.PI * 2;
          const startX = cx + Math.cos(cumulativeAngle) * r;
          const startY = cy + Math.sin(cumulativeAngle) * r;
          const endAngle = cumulativeAngle + angle;
          const endX = cx + Math.cos(endAngle) * r;
          const endY = cy + Math.sin(endAngle) * r;
          const largeArc = angle > Math.PI ? 1 : 0;

          const path = `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`;
          cumulativeAngle = endAngle;

          return <path key={i} d={path} fill={s.color} opacity={0.85} stroke="var(--card)" strokeWidth={1} />;
        })}

        {/* 범례 */}
        <g transform="translate(240, 50)">
          {stables.map((s, i) => (
            <g key={s.name} transform={`translate(0, ${i * 30})`}>
              <rect x={0} y={0} width={16} height={16} fill={s.color} rx={2} />
              <text x={22} y={12} fontSize={9} fontWeight={600} fill="var(--foreground)">{s.name}</text>
              <text x={90} y={12} fontSize={9} fill="var(--muted-foreground)">${s.mktCap}B</text>
              <text x={150} y={12} textAnchor="end" fontSize={9} fontWeight={700} fill={s.color}>{s.share}%</text>
            </g>
          ))}
        </g>

        <text x={130} y={250} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">총 시총: $240B+</text>
        <text x={130} y={262} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Fiat-backed (USDT+USDC) 80% 지배</text>
      </svg>
    </div>
  );
}
