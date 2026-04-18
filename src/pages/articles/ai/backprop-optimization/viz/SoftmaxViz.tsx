import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, H, EXP, SUM, PROB, LABELS, COLORS } from './softmaxData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function SoftmaxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* h bars */}
          {H.map((v, i) => {
            const by = 20 + i * 38;
            const barW = Math.abs(v) * 20;
            return (
              <g key={i}>
                <text x={28} y={by + 14} textAnchor="end" fontSize={9} fontWeight={500} fill={COLORS[i]}>{LABELS[i]}</text>
                <rect x={35} y={by} width={barW} height={20} rx={3} fill={`${COLORS[i]}25`} stroke={COLORS[i]} strokeWidth={0.8} />
                <text x={40 + barW} y={by + 14} fontSize={9} fill={COLORS[i]}>h={v}</text>
              </g>
            );
          })}
          <text x={120} y={62} fontSize={12} fill="var(--muted-foreground)">→</text>

          {/* e^h column */}
          {step >= 1 && EXP.map((v, i) => (
            <motion.text key={i} x={160} y={34 + i * 38} fontSize={9} fill={COLORS[i]}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              e^{H[i]} = {v}
            </motion.text>
          ))}

          {/* Sum */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={140} y1={118} x2={230} y2={118} stroke="var(--border)" strokeWidth={0.8} />
              <text x={185} y={132} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">Σ = {SUM}</text>
            </motion.g>
          )}

          {step >= 3 && <text x={240} y={62} fontSize={12} fill="var(--muted-foreground)">→</text>}

          {/* Probability bars */}
          {step >= 3 && PROB.map((v, i) => {
            const by = 20 + i * 38;
            const barW = v * 130;
            return (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={260} y={by} width={barW} height={20} rx={3} fill={`${COLORS[i]}30`} stroke={COLORS[i]} strokeWidth={1} />
                <text x={265 + barW} y={by + 14} fontSize={9} fontWeight={600} fill={COLORS[i]}>{(v * 100).toFixed(0)}%</text>
                {i === 0 && <text x={395} y={by + 14} fontSize={9} fill="#ef4444">← 잘못된 예측!</text>}
              </motion.g>
            );
          })}

          <text x={350} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">yᵢ = e^hᵢ / Σe^hⱼ</text>
        </svg>
      )}
    </StepViz>
  );
}
