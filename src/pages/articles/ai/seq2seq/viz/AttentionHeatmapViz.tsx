import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, SRC, TGT, WEIGHTS, HEAT_C, LABEL_C } from './AttentionHeatmapData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const CELL = 52;
const PAD_L = 60, PAD_T = 40;
const W = PAD_L + SRC.length * CELL + 30;
const H = PAD_T + TGT.length * CELL + 20;

function cellOpacity(v: number) {
  return 0.1 + v * 0.8;
}

export default function AttentionHeatmapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Column headers (source words) */}
          {SRC.map((w, j) => (
            <text key={`col-${j}`} x={PAD_L + j * CELL + CELL / 2} y={PAD_T - 10}
              textAnchor="middle" fontSize={11} fill={LABEL_C} fontWeight={500}>
              {w}
            </text>
          ))}
          {/* Source label */}
          <text x={PAD_L + (SRC.length * CELL) / 2} y={14}
            textAnchor="middle" fontSize={11} fill={LABEL_C}>입력 (Source)</text>

          {/* Row headers (target words) */}
          {TGT.map((w, i) => (
            <text key={`row-${i}`} x={PAD_L - 8} y={PAD_T + i * CELL + CELL / 2 + 3}
              textAnchor="end" fontSize={11} fill={LABEL_C} fontWeight={500}>
              {w}
            </text>
          ))}

          {/* Cells */}
          {WEIGHTS.map((row, i) =>
            row.map((v, j) => {
              const x = PAD_L + j * CELL;
              const y = PAD_T + i * CELL;
              const highlight = (step === 1 && i === 0) || (step === 2 && i === 1);
              return (
                <motion.g key={`${i}-${j}`}
                  animate={{ opacity: 1 }} transition={sp}>
                  <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2}
                    rx={4} fill={HEAT_C}
                    fillOpacity={cellOpacity(v)}
                    stroke={highlight ? '#f59e0b' : 'transparent'}
                    strokeWidth={highlight ? 1.5 : 0} />
                  <text x={x + CELL / 2} y={y + CELL / 2 + 3}
                    textAnchor="middle" fontSize={11}
                    fill={v > 0.35 ? '#fff' : HEAT_C}
                    fontWeight={v > 0.35 ? 600 : 400}>
                    {v.toFixed(2)}
                  </text>
                </motion.g>
              );
            })
          )}

          {/* Highlight row indicator */}
          {step === 1 && (
            <motion.text x={W - 18} y={PAD_T + CELL / 2 + 3}
              fontSize={10} fill="#f59e0b" initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={sp}>←</motion.text>
          )}
          {step === 2 && (
            <motion.text x={W - 18} y={PAD_T + CELL + CELL / 2 + 3}
              fontSize={10} fill="#f59e0b" initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={sp}>←</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
