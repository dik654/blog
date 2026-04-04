import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, ANTI_ITEMS } from './AntiPatternsData';
import { OverInstruction, VagueRole, NegativePrompt, ContextPollution } from './AntiPatternsParts';

const W = 460, H = 220;
const CX = W / 2;
const DETAILS = [OverInstruction, VagueRole, NegativePrompt, ContextPollution];

export default function AntiPatternsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Detail = DETAILS[step];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {ANTI_ITEMS.map((item, i) => {
              const x = 25 + i * 110;
              const active = step === i;
              return (
                <motion.g key={item.label}
                  animate={{ opacity: active ? 1 : step > i ? 0.4 : 0.2 }}
                  transition={{ duration: 0.3 }}>
                  <rect x={x} y={15} width={95} height={36} rx={5}
                    fill={active ? '#ef444420' : '#ef444408'}
                    stroke="#ef4444" strokeWidth={active ? 2 : 0.8} />
                  <text x={x + 48} y={38} textAnchor="middle" fontSize={9}
                    fontWeight={active ? 700 : 400} fill="#ef4444">{item.label}</text>
                </motion.g>
              );
            })}
            <motion.line
              animate={{ x1: 25 + step * 110 + 48, x2: 25 + step * 110 + 48 }}
              y1={51} y2={65} stroke="#ef4444" strokeWidth={1.5}
              transition={{ type: 'spring', bounce: 0.3 }} />
            <Detail />
            <motion.g animate={{ opacity: 0.5 }}>
              <text x={CX} y={H - 15} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                안티패턴 인식 → 프롬프트 품질 향상
              </text>
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
