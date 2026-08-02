/**
 * Shared memory bank conflict — 32 bank, 같은 bank 동시 접근 = serialize.
 */
export default function BankConflictViz() {
  const W = 720;
  const H = 380;
  const bankW = 18;
  const bankCount = 32;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Shared Memory Bank Conflict — 32 bank · 같은 bank 동시 접근 시 serialize</text>

        {/* Conflict-free */}
        <g>
          <rect x={20} y={50} width={680} height={140} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={W / 2} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">✓ Conflict-free — 각 thread 가 다른 bank 접근</text>

          {/* threads */}
          <text x={20 + 8} y={100} fontSize={9} fontWeight={600} fill="#10b981">thread 0~31</text>
          {Array.from({ length: bankCount }).map((_, i) => (
            <rect key={`t-cf-${i}`} x={120 + i * bankW} y={88} width={bankW - 2} height={20} rx={2}
              fill="#10b981" fillOpacity={0.40} stroke="#10b981" strokeWidth={0.6} />
          ))}

          {/* arrows 1-to-1 */}
          {Array.from({ length: bankCount }).map((_, i) => (
            <line key={`arr-cf-${i}`} x1={120 + i * bankW + bankW / 2} y1={108}
              x2={120 + i * bankW + bankW / 2} y2={130} stroke="#10b981" strokeWidth={0.6} opacity={0.5} />
          ))}

          {/* banks */}
          <text x={20 + 8} y={148} fontSize={9} fontWeight={600} fill="#10b981">bank 0~31</text>
          {Array.from({ length: bankCount }).map((_, i) => (
            <g key={`b-cf-${i}`}>
              <rect x={120 + i * bankW} y={132} width={bankW - 2} height={20} rx={2}
                fill="#10b981" fillOpacity={0.20} stroke="#10b981" strokeWidth={0.4} />
              <text x={120 + i * bankW + (bankW - 2) / 2} y={146} textAnchor="middle" fontSize={7} fill="#10b981">{i}</text>
            </g>
          ))}

          <text x={W / 2} y={178} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">1 cycle 에 모든 32 thread 완료</text>
        </g>

        {/* Conflict — 모두 bank 0 */}
        <g>
          <rect x={20} y={210} width={680} height={150} rx={8}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1.4} />
          <text x={W / 2} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">✗ 32-way Conflict — 32 thread 가 모두 같은 bank → 32 cycle</text>

          {/* threads */}
          <text x={20 + 8} y={262} fontSize={9} fontWeight={600} fill="#ef4444">thread 0~31</text>
          {Array.from({ length: bankCount }).map((_, i) => (
            <rect key={`t-x-${i}`} x={120 + i * bankW} y={250} width={bankW - 2} height={20} rx={2}
              fill="#ef4444" fillOpacity={0.40} stroke="#ef4444" strokeWidth={0.6} />
          ))}

          {/* arrows all to bank 0 */}
          {Array.from({ length: bankCount }).map((_, i) => (
            <line key={`arr-x-${i}`} x1={120 + i * bankW + bankW / 2} y1={270}
              x2={120 + bankW / 2} y2={295} stroke="#ef4444" strokeWidth={0.4} opacity={0.4} />
          ))}

          {/* banks */}
          <text x={20 + 8} y={310} fontSize={9} fontWeight={600} fill="#ef4444">bank 0 (혼잡)</text>
          {Array.from({ length: bankCount }).map((_, i) => (
            <g key={`b-x-${i}`}>
              <rect x={120 + i * bankW} y={295} width={bankW - 2} height={20} rx={2}
                fill="#ef4444" fillOpacity={i === 0 ? 0.55 : 0.05} stroke="#ef4444" strokeWidth={i === 0 ? 1 : 0.3} />
              <text x={120 + i * bankW + (bankW - 2) / 2} y={309} textAnchor="middle" fontSize={7} fill={i === 0 ? '#ef4444' : 'var(--muted-foreground)'}>{i}</text>
            </g>
          ))}

          <text x={W / 2} y={340} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">32 cycle serialize → 32x 느림 (warp 효율 1/32)</text>
        </g>
      </svg>
    </div>
  );
}
