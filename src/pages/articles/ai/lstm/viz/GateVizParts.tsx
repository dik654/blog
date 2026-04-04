import { motion } from 'framer-motion';
import {
  FORGET_C, INPUT_C, OUTPUT_C, CELL_C,
  GATE_ROWS, COL_X, COL_W, ROW_H,
} from './GateVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Cell({ x, y, val, color, delay }: {
  x: number; y: number; val: string; color: string; delay: number;
}) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={COL_W} height={ROW_H - 4} rx={4}
        fill={color + '15'} stroke={color} strokeWidth={0.8} />
      <text x={x + COL_W / 2} y={y + ROW_H / 2 + 1} textAnchor="middle"
        fontSize={10} fill={color} fontFamily="monospace">{val}</text>
    </motion.g>
  );
}

/** Step 3: actual numeric gate operations */
export function GateNumericStep() {
  const headers = [
    { label: '차원', color: '#999' },
    { label: 'C_{t-1}', color: CELL_C },
    { label: 'f_t', color: FORGET_C },
    { label: 'f*C', color: FORGET_C },
    { label: 'i*C\u0303', color: INPUT_C },
    { label: 'C_t', color: CELL_C },
    { label: 'o_t', color: OUTPUT_C },
    { label: 'h_t', color: OUTPUT_C },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        셀 상태 4차원 — 각 게이트가 원소별로 작용
      </text>

      {/* Column headers */}
      {headers.map((h, i) => (
        <text key={i} x={COL_X[i] + COL_W / 2} y={34} textAnchor="middle"
          fontSize={9} fill={h.color} fontWeight={600}>{h.label}</text>
      ))}

      {/* Operation symbols between columns */}
      {[
        { x: COL_X[2] - 4, sym: '\u00d7', c: FORGET_C },
        { x: COL_X[3] + COL_W + 3, sym: '=', c: FORGET_C },
        { x: COL_X[4] - 4, sym: '+', c: INPUT_C },
        { x: COL_X[5] - 4, sym: '=', c: CELL_C },
        { x: COL_X[6] - 3, sym: '\u00d7tanh', c: OUTPUT_C },
        { x: COL_X[7] - 4, sym: '=', c: OUTPUT_C },
      ].map((s, i) => (
        <text key={`op${i}`} x={s.x} y={64} fontSize={8} fill={s.c}
          textAnchor="middle">{s.sym}</text>
      ))}

      {/* Data rows */}
      {GATE_ROWS.map((r, ri) => {
        const y = 42 + ri * ROW_H;
        const d = ri * 0.08;
        const fDim = r.f < 0.5;
        const iHi = r.iC > 0.5;
        return (
          <g key={ri}>
            <Cell x={COL_X[0]} y={y} val={r.dim} color="#999" delay={d} />
            <Cell x={COL_X[1]} y={y} val={r.cPrev.toFixed(2)} color={CELL_C} delay={d} />
            <Cell x={COL_X[2]} y={y}
              val={r.f.toFixed(2)}
              color={fDim ? '#ef4444' : FORGET_C}
              delay={d + 0.05} />
            <Cell x={COL_X[3]} y={y} val={r.afterF.toFixed(2)} color={FORGET_C} delay={d + 0.1} />
            <Cell x={COL_X[4]} y={y}
              val={r.iC.toFixed(2)}
              color={iHi ? '#10b981' : INPUT_C}
              delay={d + 0.15} />
            <Cell x={COL_X[5]} y={y} val={r.cNew.toFixed(2)} color={CELL_C} delay={d + 0.2} />
            <Cell x={COL_X[6]} y={y} val={r.o.toFixed(2)} color={OUTPUT_C} delay={d + 0.25} />
            <Cell x={COL_X[7]} y={y} val={r.h.toFixed(2)} color={OUTPUT_C} delay={d + 0.3} />
          </g>
        );
      })}

      {/* Annotations */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={60} y={158} width={360} height={20} rx={4}
          fill={FORGET_C + '10'} stroke={FORGET_C} strokeWidth={0.8} />
        <text x={240} y={172} textAnchor="middle" fontSize={9} fill={FORGET_C}>
          "감정" f=0.05 → 95% 삭제 | "언어" f=0.95 → 거의 보존
        </text>
      </motion.g>
    </g>
  );
}
