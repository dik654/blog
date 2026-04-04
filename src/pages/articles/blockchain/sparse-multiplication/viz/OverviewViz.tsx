import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewVizData';
import { PRIMARY, ACCENT, WARN, MUTED, sp, NONZERO_IDX } from './constants';

function Slot({ x, y, active, color }: {
  x: number; y: number; active: boolean; color: string;
}) {
  return (
    <motion.rect x={x} y={y} width={16} height={20} rx={2}
      animate={{
        fill: active ? `${color}30` : 'hsl(var(--muted)/0.15)',
        stroke: active ? color : 'hsl(var(--border))',
        strokeWidth: active ? 1.4 : 0.7,
      }} transition={sp} />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Step 0: Full multiplication cost */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.1 }} transition={sp}>
            <text x={24} y={30} fontSize={12} fontWeight={600}
              fill="hsl(var(--foreground))">Fp12 x Fp12</text>
            <text x={24} y={48} fontSize={11}
              fill="hsl(var(--muted-foreground))">
              12 slots x 12 slots = 54 Fp곱 (Karatsuba)
            </text>
            {/* Two full 12-slot bars */}
            {Array.from({ length: 12 }).map((_, i) => (
              <Slot key={`a${i}`} x={24 + i * 20} y={60}
                active={step === 0} color={PRIMARY} />
            ))}
            <text x={270} y={74} fontSize={10}
              fill="hsl(var(--muted-foreground))">x</text>
            {Array.from({ length: 12 }).map((_, i) => (
              <Slot key={`b${i}`} x={290 + i * 20} y={60}
                active={step === 0} color={PRIMARY} />
            ))}
          </motion.g>

          {/* Step 1: Sparse discovery */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.1 }} transition={sp}>
            <text x={24} y={116} fontSize={12} fontWeight={600}
              fill="hsl(var(--foreground))">l(P)의 12슬롯</text>
            {Array.from({ length: 12 }).map((_, i) => {
              const isNZ = (NONZERO_IDX as readonly number[]).includes(i);
              return (
                <Slot key={`s${i}`} x={24 + i * 20} y={128}
                  active={step >= 1 && isNZ} color={ACCENT} />
              );
            })}
            {step >= 1 && (
              <motion.text x={280} y={142} fontSize={11}
                fill={ACCENT} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                3/12 non-zero
              </motion.text>
            )}
          </motion.g>

          {/* Step 2: Savings */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0 }} transition={sp}>
            <text x={24} y={190} fontSize={12} fontWeight={600}
              fill="hsl(var(--foreground))">비용 비교</text>
            {/* Full bar */}
            <motion.rect x={24} y={200} width={200} height={22} rx={4}
              animate={{ fill: `${MUTED}25`, stroke: MUTED }}
              strokeWidth={0.8} transition={sp} />
            <text x={34} y={215} fontSize={11}
              fill={MUTED}>Full: 54 Fp곱</text>
            {/* Sparse bar */}
            <motion.rect x={24} y={230} rx={4}
              animate={{ width: 200 * (18 / 54), height: 22,
                fill: `${WARN}25`, stroke: WARN }}
              strokeWidth={0.8} transition={sp} />
            <text x={34} y={245} fontSize={11}
              fill={WARN}>Sparse: 18 Fp곱</text>
            <motion.text x={280} y={238} fontSize={14} fontWeight={700}
              fill={WARN}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...sp, delay: 0.3 }}>
              3x 절감
            </motion.text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
