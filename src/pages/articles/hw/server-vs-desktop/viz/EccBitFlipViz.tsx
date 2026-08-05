/**
 * ECC 메모리 — bit flip 검출/정정 시각화.
 */
export default function EccBitFlipViz() {
  const W = 720;
  const H = 320;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">ECC 메모리 — single bit flip 자동 정정 (서버 필수)</text>

        {/* Non-ECC */}
        <g>
          <rect x={20} y={50} width={330} height={240} rx={8}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1.4} />
          <text x={185} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">Non-ECC (Desktop)</text>

          {/* 원본 */}
          <text x={40} y={100} fontSize={9} fill="var(--muted-foreground)">CPU write</text>
          <g fontFamily="monospace">
            {['0', '1', '0', '1', '0', '1', '0', '1'].map((b, i) => (
              <g key={i}>
                <rect x={120 + i * 22} y={88} width={20} height={20} rx={2}
                  fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={0.5} />
                <text x={130 + i * 22} y={102} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">{b}</text>
              </g>
            ))}
          </g>

          {/* cosmic ray */}
          <text x={185} y={130} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">↓ cosmic ray / 전자기 노이즈</text>

          {/* 손상 */}
          <text x={40} y={170} fontSize={9} fill="var(--muted-foreground)">DRAM 저장</text>
          <g fontFamily="monospace">
            {['0', '1', '0', '1', '1', '1', '0', '1'].map((b, i) => (
              <g key={i}>
                <rect x={120 + i * 22} y={158} width={20} height={20} rx={2}
                  fill={i === 4 ? '#ef4444' : '#94a3b8'} fillOpacity={i === 4 ? 0.5 : 0.10} stroke={i === 4 ? '#ef4444' : '#94a3b8'} strokeWidth={i === 4 ? 1.2 : 0.5} />
                <text x={130 + i * 22} y={172} textAnchor="middle" fontSize={11} fontWeight={700} fill={i === 4 ? '#fff' : 'var(--muted-foreground)'}>{b}</text>
              </g>
            ))}
          </g>
          <text x={130 + 4 * 22} y={193} textAnchor="middle" fontSize={8} fontWeight={700} fill="#ef4444">flip!</text>

          {/* read */}
          <text x={40} y={225} fontSize={9} fill="var(--muted-foreground)">CPU read</text>
          <g fontFamily="monospace">
            {['0', '1', '0', '1', '1', '1', '0', '1'].map((b, i) => (
              <g key={i}>
                <rect x={120 + i * 22} y={213} width={20} height={20} rx={2}
                  fill={i === 4 ? '#ef4444' : '#94a3b8'} fillOpacity={i === 4 ? 0.5 : 0.10} stroke={i === 4 ? '#ef4444' : '#94a3b8'} strokeWidth={i === 4 ? 1.2 : 0.5} />
                <text x={130 + i * 22} y={227} textAnchor="middle" fontSize={11} fontWeight={700} fill={i === 4 ? '#fff' : 'var(--muted-foreground)'}>{b}</text>
              </g>
            ))}
          </g>

          <text x={185} y={262} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#ef4444">⚠ silent corruption · 검출 불가</text>
          <text x={185} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">학습 weight 손상 · DB 무결성 깨짐</text>
        </g>

        {/* ECC */}
        <g>
          <rect x={370} y={50} width={330} height={240} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={535} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">ECC RDIMM (Server)</text>

          <text x={535} y={83} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">CPU write + parity</text>
          <g fontFamily="monospace">
            {['0', '1', '0', '1', '0', '1', '0', '1', 'P'].map((b, i) => (
              <g key={i}>
                <rect x={460 + i * 22} y={88} width={20} height={20} rx={2}
                  fill="#10b981" fillOpacity={i === 8 ? 0.30 : 0.15} stroke="#10b981" strokeWidth={i === 8 ? 1 : 0.5} />
                <text x={470 + i * 22} y={102} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">{b}</text>
              </g>
            ))}
          </g>
          <text x={470 + 8 * 22} y={123} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">parity</text>

          <text x={535} y={140} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">↓ flip 발생</text>

          <text x={390} y={170} fontSize={9} fill="var(--muted-foreground)">DRAM 저장</text>
          <g fontFamily="monospace">
            {['0', '1', '0', '1', '1', '1', '0', '1', 'P'].map((b, i) => (
              <g key={i}>
                <rect x={460 + i * 22} y={158} width={20} height={20} rx={2}
                  fill={i === 4 ? '#f59e0b' : '#10b981'} fillOpacity={i === 4 ? 0.4 : (i === 8 ? 0.30 : 0.15)} stroke={i === 4 ? '#f59e0b' : '#10b981'} strokeWidth={i === 4 ? 1.2 : 0.5} />
                <text x={470 + i * 22} y={172} textAnchor="middle" fontSize={11} fontWeight={700} fill={i === 4 ? '#fff' : '#10b981'}>{b}</text>
              </g>
            ))}
          </g>

          <text x={535} y={200} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">↓ ECC controller 가 parity 비교 → flip 검출 → 정정</text>

          <text x={390} y={225} fontSize={9} fill="var(--muted-foreground)">CPU read (정정됨)</text>
          <g fontFamily="monospace">
            {['0', '1', '0', '1', '0', '1', '0', '1', 'P'].map((b, i) => (
              <g key={i}>
                <rect x={460 + i * 22} y={213} width={20} height={20} rx={2}
                  fill="#10b981" fillOpacity={i === 8 ? 0.30 : 0.15} stroke="#10b981" strokeWidth={0.5} />
                <text x={470 + i * 22} y={227} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">{b}</text>
              </g>
            ))}
          </g>

          <text x={535} y={262} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">✓ single bit 자동 정정</text>
          <text x={535} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">double bit 검출 (uncorrectable error 알림)</text>
        </g>
      </svg>
    </div>
  );
}
