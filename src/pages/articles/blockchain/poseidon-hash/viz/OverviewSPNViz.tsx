import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

/** SPN 라운드 1회 — 기호 + F₇ 실제 숫자 변환 */
export default function OverviewSPNViz() {
  const cols = [68, 175, 282], w = 72, h = 44;

  type Row = {
    y: number; op: string; sym: string[]; num: string[];
    color: string; desc: string; dashed?: boolean;
  };

  const rows: Row[] = [
    { y: 28, op: '입력', sym: ['s₀', 's₁', 's₂'], num: ['2', '3', '1'],
      color: 'var(--muted-foreground)', desc: '', dashed: true },
    { y: 86, op: 'AddRC', sym: ['s₀+c₀', 's₁+c₁', 's₂+c₂'], num: ['3', '0', '3'],
      color: C1, desc: '상수 [1,4,2] 더하기' },
    { y: 144, op: 'S-box', sym: ['(·)⁵', '(·)⁵', '(·)⁵'], num: ['5', '0', '5'],
      color: C2, desc: 'x⁵ mod 7 적용' },
    { y: 226, op: '출력', sym: ["s₀'", "s₁'", "s₂'"], num: ['1', '3', '1'],
      color: 'var(--muted-foreground)', desc: '', dashed: true },
  ];

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={210} y={16} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">SPN 라운드 1회 (F₇ 예시, T=3)</text>

      {rows.map((row, ri) => (
        <motion.g key={ri} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ri * 0.1 }}>
          {/* 행 제목 */}
          <text x={10} y={row.y + h / 2} fontSize={9} fontWeight={600} fill={row.color}>
            {row.op}
          </text>

          {/* 셀 3개: 기호 + 숫자 */}
          {cols.map((cx, ci) => (
            <g key={ci}>
              <rect x={cx} y={row.y} width={w} height={h} rx={5}
                fill={row.dashed ? 'transparent' : `${row.color}12`}
                stroke={row.dashed ? 'var(--border)' : row.color}
                strokeWidth={row.dashed ? 0.6 : 1}
                strokeDasharray={row.dashed ? '3 2' : 'none'} />
              {/* 기호 */}
              <text x={cx + w / 2} y={row.y + 18} textAnchor="middle"
                fontSize={9} fontWeight={600}
                fill={row.dashed ? 'var(--foreground)' : row.color}>
                {row.sym[ci]}
              </text>
              {/* 실제 값 */}
              <text x={cx + w / 2} y={row.y + 36} textAnchor="middle"
                fontSize={11} fontWeight={700} fill={row.dashed ? C3 : C3}>
                {row.num[ci]}
              </text>
            </g>
          ))}

          {/* 우측 설명 */}
          {row.desc && (
            <text x={362} y={row.y + h / 2} fontSize={9}
              fill="var(--muted-foreground)">{row.desc}</text>
          )}

          {/* 수직 화살표 */}
          {ri < rows.length - 1 && cols.map((cx, ci) => (
            <line key={`a-${ci}`}
              x1={cx + w / 2} y1={row.y + h + 2}
              x2={cx + w / 2} y2={rows[ri + 1].y - 2}
              stroke="var(--muted-foreground)" strokeWidth={0.6}
              markerEnd="url(#ov-va)" />
          ))}
        </motion.g>
      ))}

      {/* MDS 영역 (S-box → 출력 사이) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={58} y={195} width={296} height={24} rx={6}
          fill={`${C3}08`} stroke={C3} strokeWidth={1} />
        <text x={206} y={211} textAnchor="middle" fontSize={9} fontWeight={600} fill={C3}>
          MDS [2,1,1; 1,2,1; 1,1,2] 행렬 곱
        </text>
        <text x={368} y={211} fontSize={9} fill="var(--muted-foreground)">전체 혼합</text>
        {/* cross-connections */}
        {[0, 1, 2].map(i => [0, 1, 2].filter(j => j !== i).map(j => (
          <line key={`c-${i}-${j}`}
            x1={cols[i] + w / 2} y1={195}
            x2={cols[j] + w / 2} y2={219}
            stroke={C3} strokeWidth={0.4} strokeDasharray="2 2" opacity={0.25} />
        )))}
      </motion.g>

      <defs>
        <marker id="ov-va" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <polygon points="0 0, 5 2, 0 4" fill="var(--muted-foreground)" opacity={0.4} />
        </marker>
      </defs>
    </motion.g>
  );
}
