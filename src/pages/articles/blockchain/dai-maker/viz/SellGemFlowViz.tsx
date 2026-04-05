export default function SellGemFlowViz() {
  const steps = [
    { n: 1, label: 'decimals 정규화', detail: 'gemAmt × 10¹² (6→18)', color: '#06b6d4' },
    { n: 2, label: 'fee 차감', detail: 'fee = gemAmt18 × tin', color: '#f59e0b' },
    { n: 3, label: 'USDC 수령', detail: 'gemJoin.join(this, amt)', color: '#8b5cf6' },
    { n: 4, label: 'DAI 발행', detail: 'vat.frob(ilk, ink+, art+)', color: '#3b82f6' },
    { n: 5, label: 'DAI 사용자 전송', detail: 'daiJoin.exit(usr, amt)', color: '#10b981' },
    { n: 6, label: 'fee → vow', detail: 'vat.move(this, vow, fee)', color: '#ef4444' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">sellGem() — 내부 실행 흐름</text>

        {/* 입력 */}
        <rect x={20} y={42} width={130} height={50} rx={6}
          fill="#06b6d4" fillOpacity={0.1} stroke="#06b6d4" strokeWidth={1} />
        <text x={85} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#06b6d4">USDC 입금</text>
        <text x={85} y={78} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">gemAmt (6 decimals)</text>

        {/* 출력 */}
        <rect x={370} y={42} width={130} height={50} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={435} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#10b981">DAI 출금</text>
        <text x={435} y={78} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">daiAmt = amt - fee</text>

        <defs>
          <marker id="sg-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>
        <line x1={150} y1={67} x2={200} y2={67} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#sg-arr)" />
        <line x1={320} y1={67} x2={370} y2={67} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#sg-arr)" />

        {/* PSM 박스 */}
        <rect x={200} y={42} width={120} height={50} rx={6}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.2} />
        <text x={260} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#8b5cf6">DssPsm</text>
        <text x={260} y={78} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">sellGem(usr, amt)</text>

        {/* 6단계 세로 흐름 */}
        {steps.map((s, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 20 + col * 252;
          const y = 110 + row * 62;
          return (
            <g key={s.n}>
              <rect x={x} y={y} width={238} height={52} rx={6}
                fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
              <circle cx={x + 22} cy={y + 26} r={13} fill={s.color} />
              <text x={x + 22} y={y + 31} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">{s.n}</text>
              <text x={x + 44} y={y + 22} fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={x + 44} y={y + 40} fontSize={10} fill="var(--muted-foreground)">{s.detail}</text>
            </g>
          );
        })}

        {/* 하단 요약 */}
        <rect x={20} y={304} width={480} height={44} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={324} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">사용자 관점: 1:1 교환 · 내부: CDP 생성 + frob</text>
        <text x={260} y={340} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">ink = gemAmt18 (USDC 담보) · art = gemAmt18 (DAI 부채) · ratio = 101%</text>
      </svg>
    </div>
  );
}
