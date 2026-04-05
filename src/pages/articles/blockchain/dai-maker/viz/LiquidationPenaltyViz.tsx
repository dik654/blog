export default function LiquidationPenaltyViz() {
  const debt = 15000;
  const penaltyPct = 13;
  const collateralAmt = 10; // ETH
  const ethPrice = 3000;
  const collateralValue = collateralAmt * ethPrice; // $30K

  const recoveryTarget = debt * (1 + penaltyPct / 100); // 16,950
  const toVow = recoveryTarget;
  const toUser = collateralValue - recoveryTarget;
  const userEthRefund = toUser / ethPrice;
  const userLossEth = collateralAmt - userEthRefund;

  // 시각화 비율
  const totalW = 440;
  const vowW = (toVow / collateralValue) * totalW;
  const userW = (toUser / collateralValue) * totalW;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">청산 페널티 & 담보 분배 — ETH-A 예시</text>

        {/* 입력 상태 */}
        <rect x={20} y={44} width={480} height={60} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">청산 대상 Vault</text>

        {[
          { x: 30, label: '부채', value: `${debt.toLocaleString()} DAI`, color: '#ef4444' },
          { x: 180, label: '페널티', value: `${penaltyPct}%`, color: '#f59e0b' },
          { x: 330, label: '담보', value: `${collateralAmt} ETH ($${collateralValue.toLocaleString()})`, color: '#3b82f6' },
        ].map((s, i) => (
          <g key={i}>
            <text x={s.x} y={88} fontSize={10} fontWeight={600} fill="var(--muted-foreground)">{s.label}</text>
            <text x={s.x} y={100} fontSize={11} fontWeight={700} fill={s.color}>{s.value}</text>
          </g>
        ))}

        {/* 회수 목표 계산 */}
        <rect x={20} y={118} width={480} height={56} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={260} y={138} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          회수 목표 = 부채 × (1 + 페널티)
        </text>
        <text x={260} y={158} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          {debt.toLocaleString()} × 1.13 = ${recoveryTarget.toLocaleString()}
        </text>

        {/* 담보 분배 바 */}
        <text x={260} y={196} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">담보 매각 ${collateralValue.toLocaleString()} 분배</text>

        <g transform="translate(40, 210)">
          {/* vow 부분 */}
          <rect x={0} y={0} width={vowW} height={52} rx={4}
            fill="#ef4444" fillOpacity={0.8} />
          <text x={vowW / 2} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">
            → Vow (system)
          </text>
          <text x={vowW / 2} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
            ${toVow.toLocaleString()}
          </text>

          {/* user refund 부분 */}
          <rect x={vowW} y={0} width={userW} height={52} rx={4}
            fill="#10b981" fillOpacity={0.8} />
          <text x={vowW + userW / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
            → User refund
          </text>
          <text x={vowW + userW / 2} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
            ${toUser.toLocaleString()}
          </text>

          {/* 경계선 */}
          <line x1={vowW} y1={-4} x2={vowW} y2={56} stroke="var(--foreground)" strokeWidth={1.5} />

          {/* % 라벨 */}
          <text x={vowW / 2} y={-8} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
            {((toVow / collateralValue) * 100).toFixed(1)}%
          </text>
          <text x={vowW + userW / 2} y={-8} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
            {((toUser / collateralValue) * 100).toFixed(1)}%
          </text>
        </g>

        {/* User 순 손실 */}
        <text x={260} y={296} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">User 관점 — 담보 손실 계산</text>

        <g transform="translate(40, 308)">
          <rect x={0} y={0} width={200} height={56} rx={6}
            fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.6} />
          <text x={12} y={18} fontSize={10} fontWeight={700} fill="#3b82f6">원래 담보</text>
          <text x={190} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill="#3b82f6">
            {collateralAmt} ETH
          </text>
          <text x={12} y={36} fontSize={10} fontWeight={700} fill="#10b981">반환</text>
          <text x={190} y={36} textAnchor="end" fontSize={11} fontWeight={700} fill="#10b981">
            {userEthRefund.toFixed(2)} ETH
          </text>
          <text x={12} y={50} fontSize={10} fill="var(--muted-foreground)">(${toUser.toLocaleString()})</text>
        </g>

        <g transform="translate(260, 308)">
          <rect x={0} y={0} width={220} height={56} rx={6}
            fill="#ef4444" fillOpacity={0.12} stroke="#ef4444" strokeWidth={1} />
          <text x={12} y={22} fontSize={11} fontWeight={700} fill="#ef4444">순 손실</text>
          <text x={210} y={22} textAnchor="end" fontSize={13} fontWeight={700} fill="#ef4444">
            {userLossEth.toFixed(2)} ETH
          </text>
          <text x={12} y={40} fontSize={9.5} fill="var(--muted-foreground)">
            = 부채 상환 + 13% 페널티 매각분
          </text>
          <text x={12} y={52} fontSize={9.5} fill="var(--muted-foreground)">
            (나머지 담보는 user에게 반환)
          </text>
        </g>
      </svg>
    </div>
  );
}
