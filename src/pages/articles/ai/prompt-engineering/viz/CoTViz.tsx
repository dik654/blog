import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COT_ROWS } from './CoTData';

const W = 460, H = 220;
const BAR_X = 130, BAR_W = 280, BAR_H = 28;

export default function CoTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* accuracy bar chart */}
          {COT_ROWS.map((row, i) => {
            const y = 25 + i * 48;
            const active = step === i;
            const fillW = (row.accuracy / 100) * BAR_W;
            return (
              <motion.g key={row.label}
                animate={{ opacity: active ? 1 : step > i ? 0.5 : 0.25 }}
                transition={{ duration: 0.3 }}>
                {/* label */}
                <text x={BAR_X - 10} y={y + 18} textAnchor="end"
                  fontSize={10} fontWeight={active ? 700 : 400}
                  fill={active ? row.color : 'var(--muted-foreground)'}>
                  {row.label}
                </text>
                {/* bg bar */}
                <rect x={BAR_X} y={y} width={BAR_W} height={BAR_H} rx={4}
                  fill="var(--muted)" opacity={0.15} />
                {/* fill bar */}
                <motion.rect x={BAR_X} y={y} height={BAR_H} rx={4}
                  fill={row.color}
                  initial={{ width: 0 }}
                  animate={{ width: active || step > i ? fillW : 0 }}
                  transition={{ duration: 0.5, delay: active ? 0.1 : 0 }}
                  opacity={active ? 0.8 : 0.4} />
                {/* value */}
                {(active || step > i) && (
                  <motion.text x={BAR_X + fillW + 8} y={y + 18}
                    fontSize={10} fontWeight={700} fill={row.color}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {row.accuracy}%
                  </motion.text>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
