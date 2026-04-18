import { motion } from 'framer-motion';
import { residualGradients, PLAIN_COLOR, RES_COLOR } from '../ResidualComputationData';

const MAX_W = 180;
const BASE_X = 110;
const MAX_VAL = 0.13;

export default function GradientCompareViz({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 420 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={210} y={14} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">일반 vs 잔차 기울기 비교 (|dL/dw|)</text>

      {residualGradients.map((g, i) => {
        const y = 30 + i * 44;
        const show = step >= i + 1;
        const pw = (g.plain / MAX_VAL) * MAX_W;
        const rw = (g.residual / MAX_VAL) * MAX_W;

        return (
          <g key={g.layer}>
            <text x={BASE_X - 6} y={y + 12} textAnchor="end"
              fontSize={9} fill="var(--foreground)" fontWeight={500}>
              {g.layer}
            </text>

            {/* Plain bar */}
            <motion.rect x={BASE_X} y={y} rx={3} height={16}
              fill={PLAIN_COLOR} fillOpacity={0.3} stroke={PLAIN_COLOR} strokeWidth={1}
              initial={{ width: 0 }}
              animate={{ width: show ? Math.max(pw, 2) : 0 }}
              transition={{ duration: 0.5 }} />
            {show && (
              <motion.text x={BASE_X + Math.max(pw, 2) + 4} y={y + 12}
                fontSize={9} fill={PLAIN_COLOR} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}>
                {g.plain}
              </motion.text>
            )}

            {/* Residual bar */}
            <motion.rect x={BASE_X} y={y + 20} rx={3} height={16}
              fill={RES_COLOR} fillOpacity={0.3} stroke={RES_COLOR} strokeWidth={1}
              initial={{ width: 0 }}
              animate={{ width: show ? Math.max(rw, 2) : 0 }}
              transition={{ duration: 0.5, delay: 0.15 }} />
            {show && (
              <motion.text x={BASE_X + Math.max(rw, 2) + 4} y={y + 32}
                fontSize={9} fill={RES_COLOR} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}>
                {g.residual} {g.unit}
              </motion.text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <rect x={130} y={167} width={10} height={8} rx={2}
        fill={PLAIN_COLOR} fillOpacity={0.4} />
      <text x={144} y={175} fontSize={9} fill={PLAIN_COLOR}>일반</text>
      <rect x={190} y={167} width={10} height={8} rx={2}
        fill={RES_COLOR} fillOpacity={0.4} />
      <text x={204} y={175} fontSize={9} fill={RES_COLOR}>잔차</text>

      {step >= 3 && (
        <motion.text x={300} y={175} fontSize={9}
          fill={RES_COLOR} fontWeight={600}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          40x 개선!
        </motion.text>
      )}
    </svg>
  );
}
