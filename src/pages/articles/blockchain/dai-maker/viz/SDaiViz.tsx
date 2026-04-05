export default function SDaiViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">sDAI — ERC-4626 Vault (Pot wrapping)</text>

        <defs>
          <marker id="sd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="sd-arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* deposit 흐름 — 상단 */}
        <text x={30} y={52} fontSize={11} fontWeight={700} fill="#3b82f6">deposit — DAI 예치 → sDAI 발행</text>

        {[
          { x: 30, label: 'User', sub: '1000 DAI', color: '#3b82f6' },
          { x: 172, label: 'SavingsDai', sub: 'shares = DAI × RAY / chi', color: '#8b5cf6' },
          { x: 320, label: 'Pot', sub: 'pot.join(shares)', color: '#10b981' },
          { x: 460, label: 'User', sub: '_mint(shares)', color: '#3b82f6' },
        ].map((s, i) => {
          if (i === 3) {
            return (
              <g key={i}>
                <rect x={420} y={62} width={90} height={50} rx={6}
                  fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1} />
                <text x={465} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
                <text x={465} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
              </g>
            );
          }
          const w = i === 1 ? 132 : (i === 2 ? 120 : 90);
          return (
            <g key={i}>
              <rect x={s.x} y={62} width={w} height={50} rx={6}
                fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1} />
              <text x={s.x + w / 2} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={s.x + w / 2} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
            </g>
          );
        })}
        <line x1={120} y1={87} x2={172} y2={87} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#sd-arr)" />
        <line x1={304} y1={87} x2={320} y2={87} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#sd-arr)" />
        <line x1={440} y1={87} x2={420} y2={87} stroke="#3b82f6" strokeWidth={1.3} markerEnd="url(#sd-arr)" />

        {/* redeem 흐름 — 하단 */}
        <text x={30} y={144} fontSize={11} fontWeight={700} fill="#f59e0b">redeem — sDAI 소각 → DAI 인출 (+이자)</text>

        {[
          { x: 30, label: 'User', sub: '100 sDAI', color: '#3b82f6', w: 90 },
          { x: 172, label: 'SavingsDai', sub: 'assets = shares × chi / RAY', color: '#8b5cf6', w: 132 },
          { x: 320, label: 'Pot', sub: 'pot.exit(shares)', color: '#10b981', w: 120 },
          { x: 460, label: 'User', sub: '≈ 103 DAI (+3%)', color: '#10b981', w: 90 },
        ].map((s, i) => {
          if (i === 3) {
            return (
              <g key={i}>
                <rect x={420} y={154} width={90} height={50} rx={6}
                  fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1} />
                <text x={465} y={174} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
                <text x={465} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
              </g>
            );
          }
          return (
            <g key={i}>
              <rect x={s.x} y={154} width={s.w} height={50} rx={6}
                fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1} />
              <text x={s.x + s.w / 2} y={174} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={s.x + s.w / 2} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
            </g>
          );
        })}
        <line x1={120} y1={179} x2={172} y2={179} stroke="#f59e0b" strokeWidth={1.3} markerEnd="url(#sd-arr-r)" />
        <line x1={304} y1={179} x2={320} y2={179} stroke="#f59e0b" strokeWidth={1.3} markerEnd="url(#sd-arr-r)" />
        <line x1={440} y1={179} x2={420} y2={179} stroke="#f59e0b" strokeWidth={1.3} markerEnd="url(#sd-arr-r)" />

        {/* 특성 */}
        <text x={260} y={234} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">sDAI 특성 — ERC-20 vs Pot pie</text>

        {[
          { label: '전송 가능', desc: 'DEX 거래 가능', color: '#3b82f6' },
          { label: '이자 자동 누적', desc: '보유만 해도 증가', color: '#10b981' },
          { label: 'DeFi 담보 사용', desc: 'Aave, Curve 등', color: '#f59e0b' },
        ].map((s, i) => {
          const x = 20 + i * 163;
          return (
            <g key={i}>
              <rect x={x} y={248} width={154} height={54} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.6} />
              <text x={x + 77} y={268} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
                ✓ {s.label}
              </text>
              <text x={x + 77} y={287} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                {s.desc}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
