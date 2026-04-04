import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CostVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { naive: '#6b7280', karat: '#10b981' };
const BAR_MAX = 320;

function barW(val: number) {
  return (val / 144) * BAR_MAX;
}

export default function CostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 20 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={260} y={60} textAnchor="middle" fontSize={14}
            fontWeight={700} fill="hsl(var(--foreground))">
            Fp12 곱셈 1회의 Fp 곱셈 비용
          </text>

          {/* Naive bar */}
          <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={sp}>
            <text x={85} y={125} textAnchor="end" fontSize={12}
              fontWeight={600} fill={C.naive}>Naive</text>
            <motion.rect x={100} y={110} rx={5} height={24}
              animate={{ width: barW(144) }}
              initial={{ width: 0 }}
              transition={{ ...sp, duration: 0.8 }}
              fill="hsl(var(--muted) / 0.25)" stroke={C.naive} strokeWidth={1} />
            <motion.text x={100 + barW(144) + 8} y={127}
              fontSize={12} fontWeight={700} fill={C.naive}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: 0.5 }}>
              144
            </motion.text>
          </motion.g>

          {/* Karatsuba bar */}
          <motion.g
            animate={{ opacity: step >= 1 ? 1 : 0.2 }}
            transition={sp}>
            <text x={85} y={185} textAnchor="end" fontSize={12}
              fontWeight={600} fill={C.karat}>Karatsuba</text>
            <motion.rect x={100} y={170} rx={5} height={24}
              animate={{ width: step >= 1 ? barW(54) : 0 }}
              initial={{ width: 0 }}
              transition={{ ...sp, duration: 0.8, delay: 0.1 }}
              fill={`${C.karat}20`} stroke={C.karat} strokeWidth={1.2} />
            {step >= 1 && (
              <motion.text x={100 + barW(54) + 8} y={187}
                fontSize={12} fontWeight={700} fill={C.karat}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                54
              </motion.text>
            )}
          </motion.g>

          {/* Savings annotation */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.4 }}>
              <rect x={140} y={230} width={240} height={42} rx={8}
                fill={`${C.karat}10`} stroke={`${C.karat}50`} strokeWidth={1} />
              <text x={260} y={250} textAnchor="middle" fontSize={12}
                fontWeight={700} fill={C.karat}>2.7x 절감</text>
              <text x={260} y={265} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">
                Miller Loop 254회 반복마다 적용
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
