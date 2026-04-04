import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, LAYERS } from './RecursiveVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const BAR_MAX = 280;

function barW(val: number, max: number) {
  return (val / max) * BAR_MAX;
}

export default function RecursiveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 20 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Header labels */}
          <text x={110} y={55} textAnchor="end" fontSize={10}
            fontWeight={600} fill="hsl(var(--muted-foreground))">단계</text>
          <text x={320} y={55} textAnchor="middle" fontSize={10}
            fontWeight={600} fill="hsl(var(--muted-foreground))">Fp 곱셈 횟수</text>

          {LAYERS.map((l, i) => {
            const visible = i <= step;
            const active = i === step;
            const yBase = 75 + i * 75;

            return (
              <motion.g key={l.label}
                animate={{ opacity: visible ? 1 : 0.15 }}
                transition={sp}>
                {/* Layer label */}
                <text x={110} y={yBase + 10} textAnchor="end" fontSize={12}
                  fontWeight={700} fill={l.color}>{l.label}</text>

                {/* Naive bar (gray) */}
                <motion.rect x={130} y={yBase - 6} rx={4} height={16}
                  animate={{ width: visible ? barW(l.naive, 144) : 0 }}
                  initial={{ width: 0 }} transition={{ ...sp, delay: 0.05 }}
                  fill="hsl(var(--muted) / 0.2)" stroke="hsl(var(--border))" strokeWidth={0.8} />
                {visible && (
                  <motion.text x={130 + barW(l.naive, 144) + 6} y={yBase + 7}
                    fontSize={10} fill="hsl(var(--muted-foreground))"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
                    {l.naive}
                  </motion.text>
                )}

                {/* Karatsuba bar (colored) */}
                <motion.rect x={130} y={yBase + 18} rx={4} height={16}
                  animate={{ width: visible ? barW(l.karat, 144) : 0 }}
                  initial={{ width: 0 }} transition={{ ...sp, delay: 0.15 }}
                  fill={`${l.color}30`} stroke={l.color} strokeWidth={active ? 1.4 : 0.8} />
                {visible && (
                  <motion.text x={130 + barW(l.karat, 144) + 6} y={yBase + 31}
                    fontSize={10} fontWeight={600} fill={l.color}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                    {l.karat}
                  </motion.text>
                )}

                {/* Ratio label */}
                {visible && (
                  <motion.text x={110} y={yBase + 31} textAnchor="end" fontSize={10}
                    fill="hsl(var(--muted-foreground))"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                    transition={{ ...sp, delay: 0.2 }}>
                    {(l.naive / l.karat).toFixed(1)}x
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          {/* Legend */}
          <rect x={130} y={262} width={12} height={10} rx={2}
            fill="hsl(var(--muted) / 0.2)" stroke="hsl(var(--border))" strokeWidth={0.8} />
          <text x={148} y={271} fontSize={10} fill="hsl(var(--muted-foreground))">Naive</text>
          <rect x={210} y={262} width={12} height={10} rx={2}
            fill="#6366f130" stroke="#6366f1" strokeWidth={0.8} />
          <text x={228} y={271} fontSize={10} fill="hsl(var(--muted-foreground))">Karatsuba</text>
        </svg>
      )}
    </StepViz>
  );
}
