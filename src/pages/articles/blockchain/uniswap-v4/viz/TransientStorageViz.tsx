export default function TransientStorageViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">EIP-1153 — Transient Storage (TSTORE/TLOAD)</text>

        {/* 3가지 storage 비교 */}
        <text x={260} y={46} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Storage 3종류 비교</text>

        {[
          {
            type: 'SSTORE/SLOAD',
            cost: '20K / 2.1K',
            persist: '영구',
            usage: '토큰 잔액·상태',
            color: '#ef4444',
          },
          {
            type: 'TSTORE/TLOAD',
            cost: '100 / 100',
            persist: '1 tx 동안',
            usage: 'flash accounting',
            color: '#10b981',
            highlight: true,
          },
          {
            type: 'MSTORE/MLOAD',
            cost: '3 / 3',
            persist: '1 call 동안',
            usage: '임시 변수',
            color: '#3b82f6',
          },
        ].map((s, i) => {
          const y = 62 + i * 72;
          return (
            <g key={i}>
              <rect x={20} y={y} width={480} height={64} rx={8}
                fill={s.color} fillOpacity={s.highlight ? 0.12 : 0.08}
                stroke={s.color} strokeWidth={s.highlight ? 1.2 : 0.8} />
              <text x={32} y={y + 22} fontSize={12} fontWeight={700} fill={s.color}>
                {s.type}
              </text>
              <text x={32} y={y + 42} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Gas:</text>
              <text x={64} y={y + 42} fontSize={10} fontWeight={700} fill="var(--foreground)">{s.cost}</text>
              <text x={32} y={y + 56} fontSize={9} fill="var(--muted-foreground)">{s.usage}</text>

              <rect x={340} y={y + 14} width={146} height={36} rx={4}
                fill="var(--card)" stroke={s.color} strokeWidth={0.6} />
              <text x={413} y={y + 28} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--muted-foreground)">
                유지 범위
              </text>
              <text x={413} y={y + 44} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
                {s.persist}
              </text>
            </g>
          );
        })}

        {/* 가스 비교 */}
        <text x={260} y={294} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Gas 비용 비교 — TSTORE가 SSTORE의 1/200</text>

        <g transform="translate(30, 306)">
          <text x={0} y={14} fontSize={10} fontWeight={700} fill="#ef4444">SSTORE</text>
          <rect x={70} y={4} width={380} height={14} rx={2}
            fill="#ef4444" fillOpacity={0.4} stroke="#ef4444" strokeWidth={0.6} />
          <text x={460} y={15} fontSize={10} fontWeight={700} fill="#ef4444">20,000</text>

          <text x={0} y={34} fontSize={10} fontWeight={700} fill="#10b981">TSTORE</text>
          <rect x={70} y={24} width={3.8} height={14} rx={1}
            fill="#10b981" fillOpacity={0.7} stroke="#10b981" strokeWidth={0.6} />
          <text x={80} y={35} fontSize={10} fontWeight={700} fill="#10b981">100 (1/200)</text>
        </g>
      </svg>
    </div>
  );
}
