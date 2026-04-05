export default function UserFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">DSProxy — 1 tx로 3단계 원자 실행</text>

        <defs>
          <marker id="uf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="uf-arr-p" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* User */}
        <rect x={20} y={122} width={110} height={54} rx={6}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={75} y={145} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#3b82f6">User</text>
        <text x={75} y={162} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">1 tx + ETH 전송</text>

        {/* DSProxy — 높이를 3단계 전체와 일치시킴 */}
        <rect x={160} y={78} width={140} height={142} rx={6}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1} />
        <rect x={160} y={78} width={140} height={36} rx={6}
          fill="#8b5cf6" fillOpacity={0.12} />
        <rect x={160} y={106} width={140} height={8}
          fill="#8b5cf6" fillOpacity={0.12} />
        <text x={230} y={100} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="#8b5cf6">DSProxy</text>
        <text x={230} y={132} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">execute(target, data)</text>
        <text x={230} y={152} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="#8b5cf6">openLockETHAndDraw</text>
        <text x={230} y={172} textAnchor="middle" fontSize={9.5}
          fill="var(--muted-foreground)">모든 low-level 호출</text>
        <text x={230} y={188} textAnchor="middle" fontSize={9.5}
          fill="var(--muted-foreground)">배치 실행 + 원자성 보장</text>

        <line x1={130} y1={149} x2={160} y2={149} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#uf-arr)" />

        {/* 3단계 헤더 */}
        <rect x={330} y={50} width={180} height={24} rx={4}
          fill="var(--muted)" opacity={0.4} />
        <text x={420} y={66} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">3 단계 원자 실행</text>

        {/* Step 1: Open */}
        <g>
          <rect x={330} y={78} width={180} height={42} rx={6}
            fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
          <circle cx={348} cy={99} r={12} fill="#3b82f6" />
          <text x={348} y={104} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">1</text>
          <text x={368} y={94} fontSize={11} fontWeight={700} fill="#3b82f6">manager.open(ilk)</text>
          <text x={368} y={110} fontSize={10} fill="var(--muted-foreground)">Vault 생성 → urn 주소</text>
        </g>

        {/* Step 2: Lock ETH */}
        <g>
          <rect x={330} y={128} width={180} height={42} rx={6}
            fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
          <circle cx={348} cy={149} r={12} fill="#10b981" />
          <text x={348} y={154} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">2</text>
          <text x={368} y={144} fontSize={11} fontWeight={700} fill="#10b981">lockETH(cdp)</text>
          <text x={368} y={160} fontSize={10} fill="var(--muted-foreground)">ETH → WETH → Vat.gem</text>
        </g>

        {/* Step 3: Draw */}
        <g>
          <rect x={330} y={178} width={180} height={42} rx={6}
            fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
          <circle cx={348} cy={199} r={12} fill="#f59e0b" />
          <text x={348} y={204} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">3</text>
          <text x={368} y={194} fontSize={11} fontWeight={700} fill="#f59e0b">_draw(cdp, wad)</text>
          <text x={368} y={210} fontSize={10} fill="var(--muted-foreground)">frob → move → exit</text>
        </g>

        {/* DSProxy → 각 단계 — 박스 내부에서 시작하는 느낌 */}
        <line x1={300} y1={99} x2={330} y2={99} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#uf-arr-p)" />
        <line x1={300} y1={149} x2={330} y2={149} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#uf-arr-p)" />
        <line x1={300} y1={199} x2={330} y2={199} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#uf-arr-p)" />

        {/* 결과 */}
        <rect x={20} y={248} width={490} height={80} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={265} y={273} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="#10b981">결과 — 1 tx 완료 시점</text>
        <text x={265} y={295} textAnchor="middle" fontSize={11}
          fill="var(--foreground)">User 지갑: 10 ETH 차감 + 15,000 DAI 증가</text>
        <text x={265} y={315} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">원자성: 3단계 중 하나라도 실패하면 전체 revert</text>
      </svg>
    </div>
  );
}
