export default function HookAddressViz() {
  const flags = [
    { bit: 159, name: 'BEFORE_INITIALIZE', active: false },
    { bit: 158, name: 'AFTER_INITIALIZE', active: false },
    { bit: 157, name: 'BEFORE_ADD_LIQUIDITY', active: false },
    { bit: 156, name: 'AFTER_ADD_LIQUIDITY', active: false },
    { bit: 155, name: 'BEFORE_REMOVE_LIQUIDITY', active: false },
    { bit: 154, name: 'AFTER_REMOVE_LIQUIDITY', active: false },
    { bit: 153, name: 'BEFORE_SWAP', active: true },
    { bit: 152, name: 'AFTER_SWAP', active: true },
    { bit: 151, name: 'BEFORE_DONATE', active: false },
    { bit: 150, name: 'AFTER_DONATE', active: false },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Hook Address — 주소 bit가 hook 활성 플래그</text>

        <text x={260} y={42} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">hook 주소의 상위 10비트가 어떤 hook이 활성인지 결정</text>

        {/* 예시 주소 */}
        <rect x={20} y={60} width={480} height={40} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={32} y={78} fontSize={10} fontWeight={700} fill="#3b82f6">예시 hook 주소:</text>
        <text x={32} y={94} fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          0x0000C000...... (상위 8비트 = 0000_1100)
        </text>

        {/* 10개 플래그 */}
        <text x={260} y={128} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">10개 플래그 비트 (bit 150~159)</text>

        {flags.map((f, i) => {
          const y = 140 + i * 22;
          return (
            <g key={i}>
              <rect x={20} y={y} width={36} height={18} rx={3}
                fill={f.active ? '#10b981' : 'var(--card)'}
                fillOpacity={f.active ? 0.3 : 1}
                stroke={f.active ? '#10b981' : 'var(--border)'}
                strokeWidth={f.active ? 1 : 0.5} />
              <text x={38} y={y + 13} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={f.active ? '#10b981' : 'var(--muted-foreground)'}>
                {f.active ? '1' : '0'}
              </text>
              <text x={66} y={y + 13} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
                bit {f.bit}
              </text>
              <text x={120} y={y + 13} fontSize={10}
                fill={f.active ? '#10b981' : 'var(--muted-foreground)'}
                fontWeight={f.active ? 700 : 400}>
                {f.name}
              </text>
            </g>
          );
        })}

        {/* CREATE2 mining */}
        <rect x={280} y={140} width={220} height={114} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={390} y={162} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          CREATE2 주소 마이닝
        </text>
        <text x={294} y={182} fontSize={9} fill="var(--muted-foreground)">
          1. 원하는 플래그 결정
        </text>
        <text x={294} y={198} fontSize={9} fill="var(--muted-foreground)">
          2. salt 반복 변경
        </text>
        <text x={294} y={214} fontSize={9} fill="var(--muted-foreground)">
          3. 주소 비트 패턴 일치
        </text>
        <text x={294} y={230} fontSize={9} fill="var(--muted-foreground)">
          4. 조건 맞는 주소로 배포
        </text>
        <text x={294} y={246} fontSize={9} fontStyle="italic" fill="#f59e0b">
          (배포 시 1회성 비용)
        </text>

        {/* validateHookAddress */}
        <rect x={280} y={266} width={220} height={96} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.8} />
        <text x={390} y={288} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          validateHookAddress()
        </text>
        <text x={390} y={306} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          addr의 플래그 bit == selector 존재?
        </text>
        <text x={390} y={322} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          일치하지 않으면 revert
        </text>
        <text x={390} y={342} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          ✓ 런타임 hook 조회 불필요
        </text>
        <text x={390} y={356} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          주소 자체가 메타데이터
        </text>
      </svg>
    </div>
  );
}
