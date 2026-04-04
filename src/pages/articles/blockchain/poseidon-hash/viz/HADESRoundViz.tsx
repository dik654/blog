import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#f59e0b', C3 = '#10b981';

/** 수직 파이프라인: Full Round / Partial Round 내부 과정 */
export default function HADESRoundViz({ mode }: { mode: 'full' | 'partial' }) {
  const isFull = mode === 'full';
  const color = isFull ? C1 : C2;
  const cols = [60, 175, 290];
  const w = 80, h = 30;
  const labels = ['s₀', 's₁', 's₂'];

  type Row = { y: number; title: string; values: string[]; color: string; highlight?: boolean[] };

  const rows: Row[] = [
    { y: 32, title: '입력', values: ['s₀', 's₁', 's₂'], color: 'var(--muted-foreground)' },
    { y: 82, title: 'AddRC', values: ['s₀ + c₀', 's₁ + c₁', 's₂ + c₂'], color: C1 },
    {
      y: 132, title: 'S-box',
      values: isFull ? ['(·)⁵', '(·)⁵', '(·)⁵'] : ['(·)⁵', '통과', '통과'],
      color, highlight: isFull ? [true, true, true] : [true, false, false],
    },
    { y: 202, title: '출력', values: ["s₀'", "s₁'", "s₂'"], color: 'var(--muted-foreground)' },
  ];

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={210} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>
        {isFull ? 'Full Round' : 'Partial Round'} 내부 (T=3)
      </text>

      {/* 열 헤더 */}
      {labels.map((l, i) => (
        <text key={l} x={cols[i] + w / 2} y={rows[0].y - 4} textAnchor="middle"
          fontSize={9} fill="var(--muted-foreground)">{l}</text>
      ))}

      {/* 행 데이터 */}
      {rows.map((row, ri) => (
        <motion.g key={ri} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ri * 0.1 }}>
          {/* 행 제목 */}
          <text x={14} y={row.y + h / 2 + 3} fontSize={9} fontWeight={600}
            fill={row.color}>{row.title}</text>

          {/* 셀 */}
          {cols.map((cx, ci) => {
            const active = !row.highlight || row.highlight[ci];
            return (
              <g key={ci}>
                {(() => {
                  const isHex = row.color.startsWith('#');
                  const fillColor = active
                    ? (isHex ? `${row.color}12` : 'transparent')
                    : 'var(--muted)';
                  return (
                    <rect x={cx} y={row.y} width={w} height={h} rx={5}
                      fill={fillColor}
                      stroke={active ? row.color : 'var(--border)'}
                      strokeWidth={active ? 1 : 0.5}
                      strokeDasharray={active ? 'none' : '3 2'} />
                  );
                })()}
                <text x={cx + w / 2} y={row.y + h / 2 + 4} textAnchor="middle"
                  fontSize={active ? 9 : 8} fontWeight={active ? 600 : 400}
                  fill={active ? row.color : 'var(--muted-foreground)'}>
                  {row.values[ci]}
                </text>
              </g>
            );
          })}

          {/* 수직 화살표 (다음 행으로) */}
          {ri < rows.length - 1 && cols.map((cx, ci) => (
            <line key={`a-${ci}`}
              x1={cx + w / 2} y1={row.y + h + 2}
              x2={cx + w / 2} y2={rows[ri + 1].y - 2}
              stroke="var(--muted-foreground)" strokeWidth={0.6}
              markerEnd="url(#hd-va)" />
          ))}
        </motion.g>
      ))}

      {/* MDS 행렬 영역 (S-box → 출력 사이) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={50} y={168} width={320} height={28} rx={6}
          fill={`${C3}08`} stroke={C3} strokeWidth={1} />
        <text x={210} y={186} textAnchor="middle" fontSize={9} fontWeight={600} fill={C3}>
          MDS 행렬 곱 — 모든 원소 혼합
        </text>
        {/* cross-connections */}
        {[0, 1, 2].map(i => [0, 1, 2].filter(j => j !== i).map(j => (
          <line key={`c-${i}-${j}`}
            x1={cols[i] + w / 2} y1={168}
            x2={cols[j] + w / 2} y2={196}
            stroke={C3} strokeWidth={0.4} strokeDasharray="2 2" opacity={0.3} />
        )))}
      </motion.g>

      {/* 제약 수 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.6 }}>
        <rect x={110} y={236} width={200} height={20} rx={10}
          fill={`${color}10`} stroke={color} strokeWidth={0.7} />
        <text x={210} y={250} textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>
          {isFull ? 'S-box 3개 × 3제약 = 9 제약/라운드' : 'S-box 1개 × 3제약 = 3 제약/라운드'}
        </text>
      </motion.g>

      <defs>
        <marker id="hd-va" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <polygon points="0 0, 5 2, 0 4" fill="var(--muted-foreground)" opacity={0.4} />
        </marker>
      </defs>
    </motion.g>
  );
}
