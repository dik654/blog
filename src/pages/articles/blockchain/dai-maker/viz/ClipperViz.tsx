export default function ClipperViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Clipper.sol — Dutch 경매 컨트랙트</text>

        <defs>
          <marker id="cl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Sale 구조 */}
        <rect x={20} y={44} width={480} height={98} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#8b5cf6">struct Sale — 경매 상태</text>

        {[
          { x: 36, label: 'pos', desc: '경매 index' },
          { x: 128, label: 'tab', desc: '회수 DAI (부채)' },
          { x: 220, label: 'lot', desc: '담보 양' },
          { x: 312, label: 'usr', desc: '원 Vault 소유자' },
          { x: 404, label: 'top', desc: '시작 가격' },
        ].map((f, i) => (
          <g key={i}>
            <rect x={f.x} y={74} width={80} height={56} rx={4}
              fill="var(--card)" stroke="#8b5cf6" strokeWidth={0.6} />
            <text x={f.x + 40} y={92} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
              {f.label}
            </text>
            <text x={f.x + 40} y={110} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
              {f.desc.split(' ')[0]}
            </text>
            {f.desc.split(' ')[1] && (
              <text x={f.x + 40} y={122} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                {f.desc.split(' ').slice(1).join(' ')}
              </text>
            )}
          </g>
        ))}

        {/* kick() 호출 */}
        <text x={260} y={166} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">2가지 호출 — kick (시작) · take (매수)</text>

        <rect x={20} y={180} width={230} height={90} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
        <text x={135} y={200} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          kick() — 경매 시작
        </text>
        <text x={135} y={218} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">호출자: Dog.sol (청산 트리거)</text>
        <text x={32} y={236} fontSize={9.5} fill="var(--muted-foreground)">• sales[id] = 새 Sale 생성</text>
        <text x={32} y={250} fontSize={9.5} fill="var(--muted-foreground)">• top = market × buf (10% 프리미엄)</text>
        <text x={32} y={263} fontSize={9.5} fill="var(--muted-foreground)">• keeper bounty 지급</text>

        {/* take() */}
        <rect x={270} y={180} width={230} height={90} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
        <text x={385} y={200} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          take() — 매수 실행
        </text>
        <text x={385} y={218} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">호출자: Buyer (keeper/arb)</text>
        <text x={282} y={236} fontSize={9.5} fill="var(--muted-foreground)">• price = getPrice(id) 계산</text>
        <text x={282} y={250} fontSize={9.5} fill="var(--muted-foreground)">• vat.flux: 담보 → 매수자</text>
        <text x={282} y={263} fontSize={9.5} fill="var(--muted-foreground)">• vat.move: DAI → vow</text>

        {/* 완료 조건 */}
        <text x={260} y={296} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">경매 완료 조건 (sale.lot == 0 || sale.tab == 0)</text>

        <rect x={20} y={308} width={480} height={80} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />

        {[
          { x: 32, label: 'lot == 0', desc: '담보 전부 매각' },
          { x: 200, label: 'tab == 0', desc: '부채 전부 상환' },
          { x: 368, label: 'expired', desc: 'tail 시간 초과 → redo()' },
        ].map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={322} width={120} height={54} rx={6}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
            <text x={c.x + 60} y={342} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
              {c.label}
            </text>
            <text x={c.x + 60} y={360} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{c.desc}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
