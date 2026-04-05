export default function Create2PairViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">CREATE2 — Pair 주소 결정론적 계산</text>

        <defs>
          <marker id="c2-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 입력 */}
        <rect x={20} y={42} width={480} height={68} rx={8}
          fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          입력 — 정렬된 토큰 쌍
        </text>
        {[
          { x: 40, label: 'tokenA', value: '0xA0b8...eB48', color: '#f59e0b' },
          { x: 180, label: 'tokenB', value: '0xC02a...6Cc2', color: '#10b981' },
          { x: 320, label: '정렬', value: 'tokenA < tokenB', color: '#8b5cf6' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={74} width={150} height={30} rx={4}
              fill="var(--card)" stroke={s.color} strokeWidth={0.6} />
            <text x={s.x + 10} y={92} fontSize={10} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={s.x + 140} y={92} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
              {s.value}
            </text>
          </g>
        ))}

        {/* salt 계산 */}
        <rect x={20} y={124} width={480} height={62} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={260} y={144} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
          salt 생성
        </text>
        <text x={260} y={166} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          salt = keccak256(token0, token1)
        </text>
        <text x={260} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          정렬된 주소 쌍 → 32바이트 해시
        </text>

        <line x1={260} y1={110} x2={260} y2={124} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#c2-arr)" />

        {/* CREATE2 assembly */}
        <rect x={20} y={200} width={480} height={78} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={260} y={220} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          CREATE2 opcode
        </text>
        <text x={260} y={242} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          create2(0, bytecode, length, salt)
        </text>
        <text x={260} y={260} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">새 Pair 배포 · pair 주소 결정론적</text>
        <text x={260} y={273} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">address = keccak(0xff, factory, salt, keccak(bytecode))[12:]</text>

        <line x1={260} y1={186} x2={260} y2={200} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#c2-arr)" />

        {/* pairFor() */}
        <rect x={20} y={292} width={480} height={40} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={260} y={310} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          pairFor(tokenA, tokenB) — 배포 없이 주소 계산
        </text>
        <text x={260} y={324} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          Router가 온체인 조회 없이 Pair 주소 즉시 획득 (gas 절감)
        </text>
      </svg>
    </div>
  );
}
