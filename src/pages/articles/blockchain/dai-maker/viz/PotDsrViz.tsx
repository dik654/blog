export default function PotDsrViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Pot (DSR) — chi accumulator 모델</text>

        <defs>
          <marker id="pd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#10b981" />
          </marker>
          <marker id="pd-arr-out" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Pot 상태 */}
        <rect x={170} y={42} width={180} height={90} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">Pot.sol</text>

        <text x={182} y={82} fontSize={10} fill="var(--muted-foreground)">dsr</text>
        <text x={338} y={82} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">초당 이자율</text>
        <line x1={182} y1={87} x2={338} y2={87} stroke="var(--border)" strokeWidth={0.3} opacity={0.5} />

        <text x={182} y={100} fontSize={10} fill="var(--muted-foreground)">chi</text>
        <text x={338} y={100} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">누적 rate</text>
        <line x1={182} y1={105} x2={338} y2={105} stroke="var(--border)" strokeWidth={0.3} opacity={0.5} />

        <text x={182} y={118} fontSize={10} fill="var(--muted-foreground)">pie[user]</text>
        <text x={338} y={118} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">개별 지분</text>

        {/* 왼쪽 — join (입금) */}
        <rect x={20} y={160} width={220} height={82} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1} />
        <text x={130} y={180} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          join(wad) — 예치
        </text>
        <text x={32} y={200} fontSize={10} fill="var(--muted-foreground)">1) drip() 선행</text>
        <text x={32} y={215} fontSize={10} fill="var(--muted-foreground)">2) pie[user] += wad</text>
        <text x={32} y={230} fontSize={10} fill="var(--muted-foreground)">3) vat.move(user, pot, wad×chi)</text>

        {/* 오른쪽 — exit (출금) */}
        <rect x={280} y={160} width={220} height={82} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
        <text x={390} y={180} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          exit(wad) — 인출
        </text>
        <text x={292} y={200} fontSize={10} fill="var(--muted-foreground)">1) drip() 선행</text>
        <text x={292} y={215} fontSize={10} fill="var(--muted-foreground)">2) pie[user] -= wad</text>
        <text x={292} y={230} fontSize={10} fill="var(--muted-foreground)">3) vat.move(pot, user, wad×chi)</text>

        {/* 화살표 */}
        <line x1={130} y1={160} x2={200} y2={130} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#pd-arr)" />
        <line x1={320} y1={130} x2={390} y2={160} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#pd-arr-out)" />

        {/* chi 갱신 공식 */}
        <rect x={20} y={258} width={480} height={50} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={278} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">chi 누적 공식 (drip 시)</text>
        <text x={260} y={298} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#10b981">chi = rmul(rpow(dsr, now - rho, RAY), chi)</text>

        {/* 잔액 계산 공식 */}
        <text x={260} y={326} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">
          balanceOf(user) = pie[user] × chi / RAY  (이자 포함 잔액)
        </text>
      </svg>
    </div>
  );
}
