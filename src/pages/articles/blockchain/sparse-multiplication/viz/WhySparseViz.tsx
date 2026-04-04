import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FP_SLOTS, FP2_SLOTS } from './WhySparseVizData';
import { PRIMARY, ACCENT, WARN, sp } from './constants';
import SlotBox, { SX, SY } from './SlotBox';

export default function WhySparseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const labels: Record<number, string> = {};
        if (step >= 1) FP_SLOTS.forEach(s => { labels[s.idx] = s.label; });
        if (step >= 2) FP2_SLOTS.forEach(s => { labels[s.idx] = s.label; });

        return (
          <svg viewBox="0 0 480 280" className="w-full max-w-2xl"
            style={{ height: 'auto' }}>
            {/* Title line */}
            <text x={SX} y={30} fontSize={12} fontWeight={600}
              fill="hsl(var(--foreground))">
              {step === 0 ? 'l(x,y) = yP - yT - lambda(xP - xT)'
                : step === 1 ? 'Fp → Fp12 매핑'
                : step === 2 ? 'Fp2 → Fp12 매핑'
                : '3개 슬롯 = non-zero'}
            </text>
            {/* Coordinate labels */}
            <motion.g animate={{ opacity: step === 0 ? 1 : 0.4 }}
              transition={sp}>
              <rect x={SX} y={46} width={90} height={22} rx={4}
                fill={`${PRIMARY}15`} stroke={PRIMARY} strokeWidth={0.7} />
              <text x={SX + 45} y={61} textAnchor="middle"
                fontSize={11} fill={PRIMARY}>xP, yP: Fp</text>
              <rect x={SX + 110} y={46} width={130} height={22} rx={4}
                fill={`${ACCENT}15`} stroke={ACCENT} strokeWidth={0.7} />
              <text x={SX + 175} y={61} textAnchor="middle"
                fontSize={11} fill={ACCENT}>xT, yT, lambda: Fp2</text>
            </motion.g>
            {/* 12 slot boxes */}
            <text x={SX} y={SY - 8} fontSize={11}
              fill="hsl(var(--muted-foreground))">
              Fp12 슬롯 (0-11)
            </text>
            {Array.from({ length: 12 }).map((_, i) => (
              <SlotBox key={i} idx={i} step={step} label={labels[i]} />
            ))}
            {/* Summary at step 3 */}
            {step === 3 && (
              <motion.g initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={SX} y={200} width={260} height={28} rx={5}
                  fill={`${WARN}15`} stroke={WARN} strokeWidth={0.8} />
                <text x={SX + 130} y={218} textAnchor="middle"
                  fontSize={12} fontWeight={600} fill={WARN}>
                  twist degree 6 → 3/12 non-zero
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
