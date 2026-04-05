export default function PositionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Position NFT — 고유 LP 포지션</text>

        {/* 중앙 NFT */}
        <rect x={195} y={56} width={130} height={188} rx={10}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={1.5} />
        <rect x={195} y={56} width={130} height={30} rx={10}
          fill="#8b5cf6" opacity={0.2} />
        <rect x={195} y={76} width={130} height={10}
          fill="#8b5cf6" opacity={0.2} />
        <text x={260} y={76} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#8b5cf6">Position #42</text>

        {/* NFT 내부 필드 */}
        {[
          { y: 104, label: 'poolId:', value: 'ETH/USDC' },
          { y: 122, label: 'tickLower:', value: '-820' },
          { y: 140, label: 'tickUpper:', value: '+820' },
          { y: 158, label: 'liquidity:', value: '1.2e21' },
          { y: 176, label: 'fee tier:', value: '0.3%' },
        ].map((f, i) => (
          <g key={i}>
            <text x={207} y={f.y} fontSize={10} fontWeight={600} fill="var(--foreground)">{f.label}</text>
            <text x={314} y={f.y} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">{f.value}</text>
          </g>
        ))}

        <line x1={207} y1={186} x2={314} y2={186} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />

        <text x={207} y={202} fontSize={10} fontWeight={700} fill="#10b981">누적 수수료:</text>
        <text x={260} y={220} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">+85.4 USDC</text>
        <text x={260} y={236} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">+0.028 ETH</text>

        {/* 왼쪽 사용 사례 */}
        {[
          { y: 80, label: '2차 시장 거래', sub: 'OpenSea, Blur', color: '#3b82f6' },
          { y: 130, label: '담보로 사용', sub: 'Aave, Morpho', color: '#f59e0b' },
          { y: 180, label: 'Vault 번들', sub: 'Arrakis, Gamma', color: '#10b981' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={20} y={s.y} width={150} height={40} rx={6}
              fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={0.8} />
            <text x={95} y={s.y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={95} y={s.y + 32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {s.sub}
            </text>
            <line x1={170} y1={s.y + 20} x2={195} y2={s.y + 20} stroke="var(--border)" strokeWidth={0.5} />
          </g>
        ))}

        {/* 오른쪽 사용 사례 */}
        {[
          { y: 80, label: '포지션 전송', sub: 'NFT transfer()', color: '#8b5cf6' },
          { y: 130, label: '수수료 수거', sub: 'collect()', color: '#10b981' },
          { y: 180, label: '시각화 카드', sub: 'NFT metadata', color: '#ef4444' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={350} y={s.y} width={150} height={40} rx={6}
              fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={0.8} />
            <text x={425} y={s.y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={425} y={s.y + 32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {s.sub}
            </text>
            <line x1={325} y1={s.y + 20} x2={350} y2={s.y + 20} stroke="var(--border)" strokeWidth={0.5} />
          </g>
        ))}

        <text x={260} y={268} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">V2 LP (ERC20) vs V3 Position (ERC721)</text>
        <text x={260} y={284} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">fungibility 상실 → 다양한 새 활용 방안 탄생</text>
        <text x={260} y={302} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">각 포지션은 (pool, tickLower, tickUpper)로 고유 식별</text>
      </svg>
    </div>
  );
}
