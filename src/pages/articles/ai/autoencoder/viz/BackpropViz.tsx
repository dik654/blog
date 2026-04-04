import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './BackpropVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const GRADS = [
  { label: 'w_dec₁', grad: -0.0313, color: C.dec },
  { label: 'w_dec₂', grad: 0.031, color: C.dec },
  { label: 'w_enc₁', grad: -0.0025, color: C.enc },
  { label: 'w_enc₂', grad: -0.0012, color: C.enc },
];

export default function BackpropViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Loss box */}
          <rect x={160} y={6} width={120} height={26} rx={6}
            fill={`${C.loss}12`} stroke={C.loss} strokeWidth={1} />
          <text x={220} y={23} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={C.loss}>L = 0.043 (MSE)</text>

          {/* Gradient bars */}
          {GRADS.map((g, i) => {
            const y = 48 + i * 22;
            const show = i < 2 ? step >= i + 1 : step >= 3;
            const barW = Math.abs(g.grad) * 1600;
            const isNeg = g.grad < 0;
            return (
              <g key={i}>
                <text x={10} y={y + 12} fontSize={9} fontWeight={500}
                  fill={g.color}>{g.label}</text>
                {show && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={sp}>
                    <rect x={90} y={y + 2} width={barW} height={14} rx={3}
                      fill={`${g.color}20`} stroke={g.color} strokeWidth={0.8} />
                    <text x={95 + barW} y={y + 13} fontSize={9}
                      fontWeight={600} fill={g.color}>
                      {g.grad > 0 ? '+' : ''}{g.grad}
                    </text>
                    {/* Arrow showing direction */}
                    <text x={200 + barW} y={y + 13} fontSize={9}
                      fill={C.muted}>
                      {isNeg ? 'w↑ → 손실↓' : 'w↓ → 손실↓'}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Update formula */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={80} y={105} width={280} height={20} rx={4}
                fill={`${C.enc}08`} stroke={C.enc} strokeWidth={0.6} />
              <text x={220} y={119} textAnchor="middle" fontSize={9}
                fontWeight={500} fill={C.enc}>
                w_new = w_old - 0.01 x gradient (반복 학습)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
