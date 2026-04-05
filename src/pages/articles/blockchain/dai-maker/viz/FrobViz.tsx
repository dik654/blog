export default function FrobViz() {
  // dink/dart 조합 — signed int (+/-)로 4가지 조작 표현
  const ops = [
    { dink: '+', dart: 0, label: '담보 추가', color: '#10b981', desc: 'Lock collateral' },
    { dink: '-', dart: 0, label: '담보 회수', color: '#f59e0b', desc: 'Free collateral' },
    { dink: 0, dart: '+', label: '부채 발행', color: '#3b82f6', desc: 'Draw DAI' },
    { dink: 0, dart: '-', label: '부채 상환', color: '#8b5cf6', desc: 'Wipe DAI' },
  ];

  const checks = [
    { name: 'safe', line1: 'art × rate', line2: '≤ ink × spot', color: '#10b981' },
    { name: 'dust', line1: 'art × rate', line2: '≥ dust 최소', color: '#f59e0b' },
    { name: 'ceiling', line1: 'ilk.Art × rate', line2: '≤ line 한도', color: '#3b82f6' },
    { name: 'balance', line1: 'gem · dai', line2: '잔액 충분', color: '#8b5cf6' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Vat.frob() — 단일 함수 · signed int</text>

        {/* 중앙 frob 함수 박스 — 폭 넓힘 */}
        <rect x={110} y={40} width={300} height={56} rx={8}
          fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={260} y={62} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="#3b82f6">Vat.frob(i, u, v, w, dink, dart)</text>
        <text x={260} y={83} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">dink: 담보 Δ (signed) · dart: 부채 Δ (signed)</text>

        {/* 4가지 조작 그리드 */}
        <text x={260} y={120} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">4가지 조작 — dink/dart 부호 조합</text>

        {ops.map((op, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 20 + col * 248;
          const y = 136 + row * 70;
          return (
            <g key={i}>
              <rect x={x} y={y} width={232} height={58} rx={6}
                fill={op.color} fillOpacity={0.08} stroke={op.color} strokeWidth={0.8} />
              {/* signed int 표시 */}
              <rect x={x + 10} y={y + 10} width={56} height={38} rx={4}
                fill="var(--card)" stroke={op.color} strokeWidth={0.8} />
              <text x={x + 38} y={y + 23} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">dink</text>
              <text x={x + 38} y={y + 41} textAnchor="middle" fontSize={14} fontWeight={700}
                fill={op.dink === 0 ? 'var(--muted-foreground)' : op.color}>{op.dink || '0'}</text>

              <rect x={x + 72} y={y + 10} width={56} height={38} rx={4}
                fill="var(--card)" stroke={op.color} strokeWidth={0.8} />
              <text x={x + 100} y={y + 23} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">dart</text>
              <text x={x + 100} y={y + 41} textAnchor="middle" fontSize={14} fontWeight={700}
                fill={op.dart === 0 ? 'var(--muted-foreground)' : op.color}>{op.dart || '0'}</text>

              <text x={x + 138} y={y + 25} fontSize={12} fontWeight={700}
                fill={op.color}>{op.label}</text>
              <text x={x + 138} y={y + 42} fontSize={10}
                fill="var(--muted-foreground)">{op.desc}</text>
            </g>
          );
        })}

        {/* 4가지 체크 */}
        <text x={260} y={304} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">4가지 안전성 체크 (require)</text>

        {checks.map((c, i) => {
          const x = 20 + i * 125;
          return (
            <g key={c.name}>
              <rect x={x} y={316} width={120} height={58} rx={6}
                fill={c.color} fillOpacity={0.08} stroke={c.color} strokeWidth={0.8} />
              <text x={x + 60} y={333} textAnchor="middle" fontSize={12} fontWeight={700}
                fill={c.color}>{c.name}</text>
              <text x={x + 60} y={350} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{c.line1}</text>
              <text x={x + 60} y={364} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{c.line2}</text>
            </g>
          );
        })}

        <text x={260} y={390} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">양/음 혼합 가능 → 담보+부채 동시 조작 · 감사 단순 · 원자성 보장</text>
      </svg>
    </div>
  );
}
