export default function VariableDebtTokenViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">VariableDebtToken — aToken의 "거울 구조"</text>

        {/* aToken */}
        <rect x={20} y={48} width={235} height={156} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
        <rect x={20} y={48} width={235} height={30} rx={8}
          fill="#10b981" fillOpacity={0.15} />
        <rect x={20} y={68} width={235} height={10}
          fill="#10b981" fillOpacity={0.15} />
        <text x={137} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          AToken (예치 증명)
        </text>

        <text x={32} y={100} fontSize={10} fontWeight={700} fill="var(--foreground)">구조:</text>
        <text x={80} y={100} fontSize={10} fill="var(--muted-foreground)">scaledBalance × index</text>

        <text x={32} y={120} fontSize={10} fontWeight={700} fill="var(--foreground)">index:</text>
        <text x={80} y={120} fontSize={10} fill="var(--muted-foreground)">liquidityIndex (linear)</text>

        <text x={32} y={140} fontSize={10} fontWeight={700} fill="#10b981">방향:</text>
        <text x={80} y={140} fontSize={10} fill="var(--foreground)">시간 ↑ → 잔액 ↑ (이자 누적)</text>

        <text x={32} y={160} fontSize={10} fontWeight={700} fill="var(--foreground)">전송:</text>
        <text x={80} y={160} fontSize={10} fill="#10b981">✓ transferable (ERC20)</text>

        <text x={32} y={180} fontSize={10} fontWeight={700} fill="var(--foreground)">의미:</text>
        <text x={80} y={180} fontSize={10} fill="var(--muted-foreground)">LP의 지분 (claim)</text>

        {/* 거울 구분선 */}
        <line x1={260} y1={60} x2={260} y2={196} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />
        <text x={260} y={56} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          거울 구조
        </text>

        {/* VariableDebtToken */}
        <rect x={265} y={48} width={235} height={156} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
        <rect x={265} y={48} width={235} height={30} rx={8}
          fill="#f59e0b" fillOpacity={0.15} />
        <rect x={265} y={68} width={235} height={10}
          fill="#f59e0b" fillOpacity={0.15} />
        <text x={382} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          VariableDebtToken (부채)
        </text>

        <text x={277} y={100} fontSize={10} fontWeight={700} fill="var(--foreground)">구조:</text>
        <text x={325} y={100} fontSize={10} fill="var(--muted-foreground)">scaledBalance × index</text>

        <text x={277} y={120} fontSize={10} fontWeight={700} fill="var(--foreground)">index:</text>
        <text x={325} y={120} fontSize={10} fill="var(--muted-foreground)">variableBorrowIndex (compound)</text>

        <text x={277} y={140} fontSize={10} fontWeight={700} fill="#ef4444">방향:</text>
        <text x={325} y={140} fontSize={10} fill="var(--foreground)">시간 ↑ → 부채 ↑ (이자 가산)</text>

        <text x={277} y={160} fontSize={10} fontWeight={700} fill="var(--foreground)">전송:</text>
        <text x={325} y={160} fontSize={10} fill="#ef4444">✗ non-transferable</text>

        <text x={277} y={180} fontSize={10} fontWeight={700} fill="var(--foreground)">의미:</text>
        <text x={325} y={180} fontSize={10} fill="var(--muted-foreground)">borrower의 부채 (obligation)</text>

        {/* 비교 요약 */}
        <text x={260} y={236} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">핵심 차이 — 이자 방향 + 전송성</text>

        {[
          {
            x: 20, label: '이자 방향', aLabel: '예치자 이익', aColor: '#10b981',
            bLabel: '차입자 부담', bColor: '#ef4444',
          },
          {
            x: 180, label: '정밀도', aLabel: 'Linear (근사)', aColor: '#10b981',
            bLabel: 'Compound (정확)', bColor: '#f59e0b',
          },
          {
            x: 340, label: '전송 가능', aLabel: '✓ Yes (ERC20)', aColor: '#10b981',
            bLabel: '✗ No (locked)', bColor: '#ef4444',
          },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y={250} width={160} height={96} rx={6}
              fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
            <text x={item.x + 80} y={270} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
              {item.label}
            </text>
            <text x={item.x + 10} y={294} fontSize={9} fontWeight={700} fill="#10b981">aToken:</text>
            <text x={item.x + 10} y={308} fontSize={10} fontWeight={600} fill={item.aColor}>{item.aLabel}</text>
            <text x={item.x + 10} y={326} fontSize={9} fontWeight={700} fill="#f59e0b">debtToken:</text>
            <text x={item.x + 10} y={340} fontSize={10} fontWeight={600} fill={item.bColor}>{item.bLabel}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
