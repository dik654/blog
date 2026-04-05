export default function TypesCompareViz() {
  const types = [
    {
      name: 'Fiat-backed', examples: 'USDC, USDT', peg: 'Strong',
      decentralization: 'Low', capitalEff: '1:1', risk: 'Custodial', color: '#3b82f6'
    },
    {
      name: 'Crypto-backed', examples: 'DAI, LUSD', peg: 'Medium',
      decentralization: 'High', capitalEff: '150%+', risk: 'Volatility', color: '#10b981'
    },
    {
      name: 'Algorithmic', examples: 'UST(RIP), USDD', peg: 'Weak',
      decentralization: 'High', capitalEff: '0%', risk: 'Death spiral', color: '#ef4444'
    },
    {
      name: 'Hybrid/Synth', examples: 'FRAX, USDe', peg: 'Medium',
      decentralization: 'Medium', capitalEff: 'Variable', risk: 'Complex', color: '#8b5cf6'
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">4가지 스테이블코인 유형 비교</text>

        {/* 헤더 */}
        <rect x={20} y={40} width={480} height={28} rx={4}
          fill="var(--muted)" opacity={0.5} />
        <text x={90} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">유형</text>
        <text x={210} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">페그 강도</text>
        <text x={300} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">탈중앙</text>
        <text x={380} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">자본효율</text>
        <text x={460} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">리스크</text>

        {types.map((t, i) => {
          const y = 76 + i * 66;
          return (
            <g key={i}>
              <rect x={20} y={y} width={480} height={58} rx={6}
                fill={t.color} fillOpacity={0.08} stroke={t.color} strokeWidth={0.8} />
              <rect x={20} y={y} width={6} height={58} fill={t.color} rx={2} />

              <text x={32} y={y + 22} fontSize={12} fontWeight={700} fill={t.color}>{t.name}</text>
              <text x={32} y={y + 40} fontSize={9} fill="var(--muted-foreground)">{t.examples}</text>

              <text x={210} y={y + 32} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={t.peg === 'Strong' ? '#10b981' : t.peg === 'Weak' ? '#ef4444' : '#f59e0b'}>
                {t.peg}
              </text>
              <text x={300} y={y + 32} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={t.decentralization === 'High' ? '#10b981' : t.decentralization === 'Low' ? '#ef4444' : '#f59e0b'}>
                {t.decentralization}
              </text>
              <text x={380} y={y + 32} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                {t.capitalEff}
              </text>
              <text x={460} y={y + 32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {t.risk}
              </text>
            </g>
          );
        })}

        <text x={260} y={352} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">시장 점유율: Fiat-backed 80% · Crypto-backed 2% · Algo 2%</text>
        <text x={260} y={370} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">"Holy grail" = 탈중앙 + 자본효율 + 페그 (아직 미달성)</text>
      </svg>
    </div>
  );
}
