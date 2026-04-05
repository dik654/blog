export default function DrawFlowViz() {
  const steps = [
    {
      n: 1, name: 'jug.drip()', mod: 'Jug', color: '#f59e0b',
      action: 'SF 이자율 갱신',
      detail: 'ilk.rate = rate_old × (1+SF)^dt',
    },
    {
      n: 2, name: 'vat.frob()', mod: 'Vat', color: '#3b82f6',
      action: '부채 증가 (dart +)',
      detail: 'urn.art += dart · 안전성 체크',
    },
    {
      n: 3, name: 'vat.move()', mod: 'Vat', color: '#8b5cf6',
      action: 'DAI internal 이동',
      detail: 'vat.dai[urn] → vat.dai[user]',
    },
    {
      n: 4, name: 'daiJoin.exit()', mod: 'DaiJoin', color: '#10b981',
      action: 'ERC20 DAI 출금',
      detail: 'Vat internal → ERC20 DAI 지갑',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">DAI Draw — 4단계 시퀀스</text>

        <defs>
          <marker id="dr-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 4단계 세로 박스 */}
        {steps.map((s, i) => {
          const y = 48 + i * 64;
          return (
            <g key={s.n}>
              {/* 단계 번호 */}
              <circle cx={42} cy={y + 26} r={17} fill={s.color} />
              <text x={42} y={y + 32} textAnchor="middle" fontSize={15} fontWeight={700}
                fill="#fff">{s.n}</text>

              {/* 호출 모듈 */}
              <rect x={72} y={y + 4} width={100} height={46} rx={6}
                fill={s.color} fillOpacity={0.12} stroke={s.color} strokeWidth={1} />
              <text x={122} y={y + 23} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={s.color}>{s.mod}</text>
              <text x={122} y={y + 39} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={s.color}>{s.name}</text>

              {/* 동작 설명 */}
              <rect x={186} y={y + 4} width={320} height={46} rx={6}
                fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
              <text x={200} y={y + 23} fontSize={12} fontWeight={700}
                fill="var(--foreground)">{s.action}</text>
              <text x={200} y={y + 40} fontSize={10}
                fill="var(--muted-foreground)">{s.detail}</text>

              {/* 단계 간 연결선 */}
              {i < steps.length - 1 && (
                <line x1={42} y1={y + 43} x2={42} y2={y + 64}
                  stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#dr-arr)" />
              )}
            </g>
          );
        })}

        {/* 전후 상태 비교 */}
        <rect x={20} y={312} width={240} height={40} rx={6}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={32} y={329} fontSize={11} fontWeight={700}
          fill="var(--muted-foreground)">Before</text>
        <text x={100} y={329} fontSize={11}
          fill="var(--foreground)">urn.art = 0 · user DAI = 0</text>
        <text x={32} y={345} fontSize={11} fontWeight={700}
          fill="var(--muted-foreground)">After</text>
        <text x={100} y={345} fontSize={11}
          fill="#10b981">art = 15K · DAI = 15K</text>

        <rect x={270} y={312} width={236} height={40} rx={6}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.6} />
        <text x={388} y={329} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#8b5cf6">이중 단위 체계</text>
        <text x={388} y={345} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">Vat internal (RAD) ↔ ERC20 (WAD)</text>
      </svg>
    </div>
  );
}
