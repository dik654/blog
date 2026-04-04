import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'dL/dh = y − ŷ (소프트맥스+CE 미분 결과)' },
  { label: 'dL/dh₁ = 0.91−0 = +0.91 (마드리드↑ → 손실↑)' },
  { label: 'dL/dh₂ = 0.09−1 = −0.91 (파리↑ → 손실↓)' },
  { label: 'dL/dm₂ = x×(y₂−1) = 2.35×(−0.91) = −2.14' },
];

const NEURONS = [
  { label: 'h₁ 마드리드', pred: 0.91, target: 0, grad: 0.91, color: '#ef4444' },
  { label: 'h₂ 파리', pred: 0.09, target: 1, grad: -0.91, color: '#3b82f6' },
  { label: 'h₃ 베를린', pred: 0.0, target: 0, grad: 0.0, color: '#10b981' },
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function BackpropDerivViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 140" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>

          {/* Neuron rows */}
          {NEURONS.map((n, i) => {
            const ny = 10 + i * 42;
            const active = step >= i + 1;
            const barW = Math.abs(n.grad) * 80;
            const isPos = n.grad >= 0;

            return (
              <g key={i}>
                {/* Neuron label */}
                <text x={10} y={ny + 18} fontSize={9} fontWeight={500}
                  fill={n.color}>{n.label}</text>

                {/* y (pred) */}
                <rect x={100} y={ny} width={50} height={28} rx={4}
                  fill={`${n.color}10`} stroke={n.color}
                  strokeWidth={0.6} />
                <text x={125} y={ny + 12} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">예측 y</text>
                <text x={125} y={ny + 23} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color}>{n.pred}</text>

                {/* ŷ (target) */}
                <rect x={160} y={ny} width={50} height={28} rx={4}
                  fill={`${n.color}10`} stroke={n.color}
                  strokeWidth={0.6} />
                <text x={185} y={ny + 12} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">정답 ŷ</text>
                <text x={185} y={ny + 23} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color}>{n.target}</text>

                {/* gradient bar */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={sp}>
                    <text x={225} y={ny + 12} fontSize={9}
                      fill="var(--muted-foreground)">기울기</text>
                    <rect x={225} y={ny + 14} width={barW} height={10}
                      rx={2} fill={isPos ? '#ef444440' : '#3b82f640'}
                      stroke={isPos ? '#ef4444' : '#3b82f6'}
                      strokeWidth={0.8} />
                    <text x={230 + barW} y={ny + 23} fontSize={9}
                      fontWeight={600}
                      fill={isPos ? '#ef4444' : '#3b82f6'}>
                      {n.grad > 0 ? '+' : ''}{n.grad}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Weight gradient (step 3) */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={100} y={105} width={300} height={28} rx={6}
                fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1} />
              <text x={250} y={123} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#8b5cf6">
                dL/dm₂ = 2.35 × (−0.91) = −2.14
              </text>
              <text x={420} y={123} fontSize={9}
                fill="var(--muted-foreground)">
                m₂↑ → 손실↓
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
