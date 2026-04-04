import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, BUDGET } from './OptimizationData';
import { PriorityPyramid, CompressionThreshold, AttentionCurve } from './OptimizationParts';

const W = 460, H = 230;
const CTX_X = 30, CTX_W = 400, CTX_H = 30, CTX_Y = 30;

export default function OptimizationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        let runX = CTX_X;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={W / 2} y={18} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="var(--foreground)">
              컨텍스트 윈도우 (200K 토큰)
            </text>
            <rect x={CTX_X} y={CTX_Y} width={CTX_W} height={CTX_H} rx={5}
              fill="var(--muted)" opacity={0.15} stroke="var(--border)" strokeWidth={1} />

            {BUDGET.map((b, i) => {
              const w = (b.pct / 100) * CTX_W;
              const x = runX;
              runX += w;
              const active = step === 0 || step === 3;
              return (
                <motion.g key={b.label}
                  animate={{ opacity: active ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}>
                  <motion.rect x={x} y={CTX_Y} height={CTX_H} rx={i === 0 ? 5 : 0}
                    fill={`${b.color}25`} stroke={b.color} strokeWidth={1}
                    initial={{ width: 0 }}
                    animate={{ width: w }}
                    transition={{ duration: 0.4, delay: i * 0.1 }} />
                  <text x={x + w / 2} y={CTX_Y + 19} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={b.color}>
                    {b.label} {b.pct}%
                  </text>
                </motion.g>
              );
            })}

            {step === 1 && <PriorityPyramid />}
            {step === 2 && <CompressionThreshold />}
            {step === 3 && <AttentionCurve />}
          </svg>
        );
      }}
    </StepViz>
  );
}
