/**
 * Memory coalescing — warp 32 thread 가 인접 메모리 읽으면 1 transaction.
 * Strided 면 N transaction (느림).
 */
export default function CoalescingViz() {
  const W = 720;
  const H = 380;
  const cellW = 18;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Memory Coalescing — warp 의 32 thread 가 인접 메모리 읽기</text>

        {/* Coalesced */}
        <g>
          <rect x={20} y={50} width={680} height={140} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={W / 2} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">✓ Coalesced — 한 transaction (128 byte)</text>

          {/* Threads */}
          <text x={20 + 8} y={100} fontSize={9} fontWeight={600} fill="#10b981">thread 0~31</text>
          {Array.from({ length: 32 }).map((_, i) => (
            <rect key={`t-c-${i}`} x={120 + i * cellW} y={88} width={cellW - 2} height={20} rx={2}
              fill="#10b981" fillOpacity={0.40} stroke="#10b981" strokeWidth={0.6} />
          ))}

          {/* arrows down */}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`arr-c-${i}`} x1={120 + i * cellW + cellW / 2} y1={108}
              x2={120 + i * cellW + cellW / 2} y2={130} stroke="#10b981" strokeWidth={0.6} opacity={0.5} />
          ))}

          {/* Memory cells */}
          <text x={20 + 8} y={148} fontSize={9} fontWeight={600} fill="#10b981">memory address</text>
          {Array.from({ length: 32 }).map((_, i) => (
            <g key={`m-c-${i}`}>
              <rect x={120 + i * cellW} y={132} width={cellW - 2} height={20} rx={2}
                fill="#10b981" fillOpacity={0.20} stroke="#10b981" strokeWidth={0.4} />
              <text x={120 + i * cellW + (cellW - 2) / 2} y={146} textAnchor="middle" fontSize={7} fill="#10b981">{i}</text>
            </g>
          ))}

          {/* transaction box */}
          <rect x={117} y={158} width={32 * cellW + 1} height={20} rx={3}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={1} />
          <text x={120 + 32 * cellW / 2} y={172} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">1 memory transaction (128 byte) — 빠름</text>
        </g>

        {/* Strided */}
        <g>
          <rect x={20} y={210} width={680} height={150} rx={8}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1.4} />
          <text x={W / 2} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">✗ Strided — 32 transaction (각 thread 다른 cache line)</text>

          {/* threads */}
          <text x={20 + 8} y={262} fontSize={9} fontWeight={600} fill="#ef4444">thread 0~31</text>
          {Array.from({ length: 32 }).map((_, i) => (
            <rect key={`t-s-${i}`} x={120 + i * cellW} y={250} width={cellW - 2} height={20} rx={2}
              fill="#ef4444" fillOpacity={0.40} stroke="#ef4444" strokeWidth={0.6} />
          ))}

          {/* strided arrows (thread N → memory N*32) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const tx = 120 + i * cellW + cellW / 2;
            const mx = 120 + (i * 4) * cellW + cellW / 2;
            return (
              <line key={`arr-s-${i}`} x1={tx} y1={270} x2={mx} y2={295}
                stroke="#ef4444" strokeWidth={0.6} opacity={0.5} />
            );
          })}

          {/* memory — 같은 위치지만 strided 표시 */}
          <text x={20 + 8} y={310} fontSize={9} fontWeight={600} fill="#ef4444">strided access</text>
          {Array.from({ length: 32 }).map((_, i) => {
            const isAccessed = i % 4 === 0 && i < 32;
            return (
              <g key={`m-s-${i}`}>
                <rect x={120 + i * cellW} y={295} width={cellW - 2} height={20} rx={2}
                  fill="#ef4444" fillOpacity={isAccessed ? 0.40 : 0.05} stroke="#ef4444" strokeWidth={isAccessed ? 0.8 : 0.3} />
                <text x={120 + i * cellW + (cellW - 2) / 2} y={309} textAnchor="middle" fontSize={7} fill={isAccessed ? '#ef4444' : 'var(--muted-foreground)'}>{i}</text>
              </g>
            );
          })}

          <text x={W / 2} y={340} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">각 thread 다른 cache line → 32 transaction → 32x 느림</text>
        </g>
      </svg>
    </div>
  );
}
