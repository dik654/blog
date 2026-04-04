import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { PINNING_STEPS, BLOCKSTORE_LAYERS } from '../PinningGCData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const LW = 180, LH = 24, GAP = 4, X0 = 60;

export default function BlockstoreViz() {
  return (
    <StepViz steps={PINNING_STEPS}>
      {(step) => (
        <svg viewBox="-50 0 400 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BLOCKSTORE_LAYERS.map((l, i) => {
            const y = 10 + i * (LH + GAP);
            const highlight = step === 3 || (step === 1 && i >= 3) || (step === 2 && i >= 3);
            return (
              <motion.g key={l.label}
                animate={{ opacity: highlight || step === 0 ? 1 : 0.3 }} transition={sp}>
                <rect x={X0} y={y} width={LW} height={LH} rx={5}
                  fill={`${l.color}15`} stroke={l.color} strokeWidth={1.5} />
                <text x={X0 + LW / 2} y={y + 15} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={l.color}>{l.label}</text>
                <text x={X0 + LW + 8} y={y + 15}
                  fontSize={10} fill="var(--muted-foreground)">{l.desc}</text>
                {i < BLOCKSTORE_LAYERS.length - 1 && (
                  <line x1={X0 + LW / 2} y1={y + LH} x2={X0 + LW / 2} y2={y + LH + GAP}
                    stroke={l.color} strokeWidth={1} strokeDasharray="2 2" />
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
