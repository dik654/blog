export default function LoopingViz() {
  const iterations = [
    { n: 0, collateral: 10, label: '초기 10 ETH' },
    { n: 1, collateral: 19.3, label: '+ 9.3 stETH' },
    { n: 2, collateral: 27.95, label: '+ 8.65 stETH' },
    { n: 3, collateral: 36, label: '+ 8.04 stETH' },
    { n: 4, collateral: 43.47, label: '+ 7.48 stETH' },
    { n: 5, collateral: 49, label: '+ 6.95 stETH (수렴)' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">E-Mode Looping — Leveraged Staking (93% LTV)</text>

        {/* 막대 차트 */}
        <line x1={60} y1={260} x2={490} y2={260} stroke="var(--foreground)" strokeWidth={1} />
        <line x1={60} y1={50} x2={60} y2={260} stroke="var(--foreground)" strokeWidth={1} />

        {[0, 10, 20, 30, 40, 50].map(v => {
          const y = 260 - (v / 55) * 210;
          return (
            <g key={v}>
              <line x1={56} y1={y} x2={60} y2={y} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={52} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                {v}
              </text>
            </g>
          );
        })}

        {iterations.map((it, i) => {
          const x = 85 + i * 68;
          const h = (it.collateral / 55) * 210;
          const y = 260 - h;
          const isLast = i === iterations.length - 1;
          return (
            <g key={i}>
              <rect x={x} y={y} width={48} height={h} rx={4}
                fill={isLast ? '#10b981' : '#3b82f6'}
                fillOpacity={0.35}
                stroke={isLast ? '#10b981' : '#3b82f6'}
                strokeWidth={1} />
              <text x={x + 24} y={y - 4} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={isLast ? '#10b981' : '#3b82f6'}>
                {it.collateral.toFixed(1)}
              </text>
              <text x={x + 24} y={276} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                iter {it.n}
              </text>
              <text x={x + 24} y={290} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                ETH
              </text>
            </g>
          );
        })}

        {/* 최종 결과 */}
        <rect x={20} y={300} width={480} height={50} rx={8}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1.2} />
        <text x={36} y={320} fontSize={11} fontWeight={700} fill="#10b981">최종 포지션:</text>
        <text x={128} y={320} fontSize={11} fill="var(--foreground)">
          49 stETH 담보 + 39 ETH 부채 = <tspan fontWeight={700} fill="#10b981">4.9× 레버리지</tspan>
        </text>
        <text x={36} y={340} fontSize={9} fill="var(--muted-foreground)">
          수익: (staking 3.5% − borrow 2.5%) × 레버리지 = ~4.9% effective APY · HF 1.06 (tight)
        </text>
      </svg>
    </div>
  );
}
