export default function TickBitmapViz() {
  // Represent 24 ticks (one word slice)
  const bits = [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Tick Bitmap — 256 tick을 1 slot에 packing</text>

        <text x={260} y={44} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">mapping(int16 word ={">"} uint256 bits) — bit=1은 초기화된 tick</text>

        {/* Word 0 */}
        <text x={24} y={72} fontSize={11} fontWeight={700} fill="var(--foreground)">word=0 (tick 0 ~ 255)</text>

        {/* bitmap 시각화 (24 bits sample) */}
        {bits.map((b, i) => (
          <g key={i}>
            <rect x={24 + i * 19} y={82} width={17} height={32} rx={2}
              fill={b === 1 ? '#10b981' : 'var(--card)'}
              fillOpacity={b === 1 ? 0.4 : 1}
              stroke={b === 1 ? '#10b981' : 'var(--border)'}
              strokeWidth={b === 1 ? 1 : 0.5} />
            <text x={24 + i * 19 + 8.5} y={102} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={b === 1 ? '#10b981' : 'var(--muted-foreground)'}>
              {b}
            </text>
          </g>
        ))}

        {/* bit position 라벨 */}
        {[0, 4, 8, 12, 16, 20].map(i => (
          <text key={i} x={24 + i * 19 + 8.5} y={128} textAnchor="middle" fontSize={8}
            fill="var(--muted-foreground)">{i}</text>
        ))}

        <text x={490} y={102} textAnchor="end" fontSize={10} fontStyle="italic" fill="var(--muted-foreground)">
          ... 256 bits
        </text>

        {/* 초기화된 tick 강조 */}
        <text x={24} y={152} fontSize={10} fontWeight={700} fill="#10b981">
          초기화된 ticks: 1, 4, 8, 10, 15, 19
        </text>
        <text x={24} y={167} fontSize={9} fill="var(--muted-foreground)">
          LP가 진입/퇴출하는 tick (다른 tick은 건너뜀)
        </text>

        {/* Position 인코딩 */}
        <rect x={20} y={188} width={480} height={60} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={208} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          tick 인덱스 분할 — word + bit
        </text>
        <text x={260} y={228} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          tick 500 → word = 1, bit = 244
        </text>
        <text x={260} y={242} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          256으로 분리: wordPos = tick ÷ 256, bitPos = tick % 256
        </text>

        {/* 다음 tick 찾기 */}
        <rect x={20} y={258} width={480} height={50} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={260} y={278} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          nextInitializedTickWithinOneWord() — O(1)
        </text>
        <text x={260} y={296} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          bit mask + mostSignificantBit → 다음 활성 tick 즉시 찾기 (gas 절감)
        </text>
      </svg>
    </div>
  );
}
