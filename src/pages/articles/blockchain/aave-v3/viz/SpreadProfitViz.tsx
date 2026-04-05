export default function SpreadProfitViz() {
  const borrowRate = 5.0;
  const supplyRate = 3.5;
  const spread = borrowRate - supplyRate;
  const reserveFactor = 10;
  const treasuryShare = spread * (reserveFactor / 100);
  const lenderShare = supplyRate;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Spread + Reserve Factor — 프로토콜 수익 구조</text>

        <defs>
          <marker id="sp-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 차입자 */}
        <rect x={20} y={52} width={110} height={56} rx={6}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
        <text x={75} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          차입자
        </text>
        <text x={75} y={92} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">
          {borrowRate}% APY
        </text>
        <text x={75} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          지불
        </text>

        {/* Pool */}
        <rect x={170} y={52} width={180} height={56} rx={6}
          fill="#8b5cf6" fillOpacity={0.12} stroke="#8b5cf6" strokeWidth={1.2} />
        <text x={260} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          Aave Pool (수집)
        </text>
        <text x={260} y={92} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          {borrowRate}% × borrowed
        </text>
        <text x={260} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          차입자 이자 수집
        </text>

        <line x1={130} y1={80} x2={170} y2={80} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#sp-arr)" />

        {/* 분배 — 3방향 */}
        <text x={260} y={148} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Pool 이자 분배 구조</text>

        {/* Lender */}
        <rect x={20} y={164} width={150} height={100} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={95} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Lender (예치자)
        </text>
        <text x={95} y={212} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--foreground)">
          {supplyRate}%
        </text>
        <text x={95} y={230} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          APY 지급
        </text>
        <text x={95} y={246} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
          ← borrow × U × (1-RF)
        </text>
        <text x={95} y={258} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          utilization 반영
        </text>

        {/* Treasury */}
        <rect x={185} y={164} width={150} height={100} rx={8}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} />
        <text x={260} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          Treasury (DAO)
        </text>
        <text x={260} y={212} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--foreground)">
          {treasuryShare.toFixed(2)}%
        </text>
        <text x={260} y={230} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          프로토콜 수익
        </text>
        <text x={260} y={246} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
          spread × RF ({reserveFactor}%)
        </text>
        <text x={260} y={258} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          DAO 거버넌스 관리
        </text>

        {/* Spread 전체 */}
        <rect x={350} y={164} width={150} height={100} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
        <text x={425} y={184} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          Spread (전체)
        </text>
        <text x={425} y={212} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--foreground)">
          {spread.toFixed(1)}%
        </text>
        <text x={425} y={230} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          borrow − supply
        </text>
        <text x={425} y={246} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
          {borrowRate}% - {supplyRate}% = {spread}%
        </text>
        <text x={425} y={258} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          treasury + unutilized
        </text>

        {/* 화살표 */}
        <line x1={260} y1={108} x2={95} y2={164} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sp-arr)" />
        <line x1={260} y1={108} x2={260} y2={164} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sp-arr)" />
        <line x1={260} y1={108} x2={425} y2={164} stroke="#6b7280" strokeWidth={1.2} markerEnd="url(#sp-arr)" />

        {/* 핵심 공식 */}
        <rect x={20} y={284} width={480} height={46} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={304} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          supplyRate = borrowRate × utilization × (1 − reserveFactor)
        </text>
        <text x={260} y={322} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          utilization ↑ → spread ↑ · 차입 수요가 프로토콜 수익 결정
        </text>
      </svg>
    </div>
  );
}
