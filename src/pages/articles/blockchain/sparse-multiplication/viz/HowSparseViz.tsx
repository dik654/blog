import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './HowSparseVizData';
import { PRIMARY, ACCENT, WARN, sp, NONZERO_IDX } from './constants';

const SX = 30;
const SW = 18;
const GAP = 3;
const ROW_F = 50;
const ROW_L = 180;

export default function HowSparseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* f² slots (top row) */}
          <text x={SX} y={ROW_F - 10} fontSize={11} fontWeight={600}
            fill="hsl(var(--foreground))">f² (12 slots)</text>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.rect key={`f${i}`}
              x={SX + i * (SW + GAP)} y={ROW_F}
              width={SW} height={24} rx={2}
              animate={{
                fill: `${PRIMARY}25`,
                stroke: PRIMARY,
                strokeWidth: step === 0 ? 1.2 : 0.6,
              }} transition={sp} />
          ))}

          {/* l(P) slots (bottom row) */}
          <text x={SX} y={ROW_L - 10} fontSize={11} fontWeight={600}
            fill="hsl(var(--foreground))">l(P) (3/12 slots)</text>
          {Array.from({ length: 12 }).map((_, i) => {
            const isNZ = (NONZERO_IDX as readonly number[]).includes(i);
            return (
              <motion.rect key={`l${i}`}
                x={SX + i * (SW + GAP)} y={ROW_L}
                width={SW} height={24} rx={2}
                animate={{
                  fill: isNZ ? `${ACCENT}30` : 'hsl(var(--muted)/0.15)',
                  stroke: isNZ ? ACCENT : 'hsl(var(--border))',
                  strokeWidth: isNZ ? 1.4 : 0.6,
                }} transition={sp} />
            );
          })}

          {/* Connection lines: step 1 = sparse only, step 2 = compare */}
          {step >= 1 && NONZERO_IDX.map((li, ni) => (
            Array.from({ length: 12 }).map((_, fi) => (
              <motion.line key={`c${ni}-${fi}`}
                x1={SX + fi * (SW + GAP) + SW / 2}
                y1={ROW_F + 24}
                x2={SX + li * (SW + GAP) + SW / 2}
                y2={ROW_L}
                stroke={ACCENT} strokeWidth={0.6}
                strokeOpacity={step === 1 ? 0.5 : 0.3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ ...sp, delay: ni * 0.08 + fi * 0.01 }} />
            ))
          ))}

          {/* Step 2: comparison numbers */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              <rect x={300} y={ROW_F} width={160} height={28} rx={4}
                fill="hsl(var(--muted)/0.15)"
                stroke="hsl(var(--border))" strokeWidth={0.7} />
              <text x={380} y={ROW_F + 18} textAnchor="middle"
                fontSize={11} fill="hsl(var(--muted-foreground))">
                Full: 144 항 → 54 Fp곱
              </text>
              <rect x={300} y={ROW_F + 38} width={160} height={28} rx={4}
                fill={`${WARN}15`} stroke={WARN} strokeWidth={0.8} />
              <text x={380} y={ROW_F + 56} textAnchor="middle"
                fontSize={11} fontWeight={600} fill={WARN}>
                Sparse: 36 항 → 18 Fp곱
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
