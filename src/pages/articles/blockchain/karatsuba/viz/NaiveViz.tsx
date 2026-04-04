import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, MULS } from './NaiveVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { mul: '#6366f1', res: '#f59e0b', sub: '#ec4899' };

export default function NaiveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 20 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* FOIL expression */}
          <motion.text x={260} y={60} textAnchor="middle" fontSize={12}
            fontWeight={600} fill="hsl(var(--foreground))"
            animate={{ opacity: step >= 0 ? 1 : 0 }} transition={sp}>
            ac + adu + bcu + bdu²
          </motion.text>

          {/* 4 multiplication boxes */}
          {MULS.map((m, i) => (
            <motion.g key={m.label}
              animate={{
                opacity: step >= 1 ? 1 : (step === 0 ? 0.3 : 0),
                scale: step === 1 ? 1 : 0.95,
              }}
              transition={{ ...sp, delay: step >= 1 ? i * 0.1 : 0 }}>
              <rect x={m.x} y={100} width={100} height={50} rx={6}
                fill={step >= 1 ? `${C.mul}18` : 'hsl(var(--muted) / 0.15)'}
                stroke={step >= 1 ? C.mul : 'hsl(var(--border))'} strokeWidth={1.2} />
              <text x={m.x + 50} y={122} textAnchor="middle" fontSize={14}
                fontWeight={700} fill={C.mul}>{m.label}</text>
              <text x={m.x + 50} y={140} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">{m.desc}</text>
            </motion.g>
          ))}

          {/* Step 2: u² = -1 substitution */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.1 }}>
              <rect x={120} y={175} width={280} height={36} rx={6}
                fill={`${C.sub}10`} stroke={`${C.sub}60`} strokeWidth={1} />
              <text x={260} y={198} textAnchor="middle" fontSize={12}
                fontWeight={600} fill={C.sub}>
                u² = -1 대입 → (ac - bd) + (ad + bc)u
              </text>
            </motion.g>
          )}

          {/* Step 3: Result */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.1 }}>
              <rect x={80} y={230} width={160} height={40} rx={6}
                fill={`${C.res}14`} stroke={C.res} strokeWidth={1} />
              <text x={160} y={246} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C.res}>실수부: ac - bd</text>
              <text x={160} y={260} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">뺄셈 1회</text>

              <rect x={280} y={230} width={160} height={40} rx={6}
                fill={`${C.res}14`} stroke={C.res} strokeWidth={1} />
              <text x={360} y={246} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C.res}>허수부: ad + bc</text>
              <text x={360} y={260} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">덧셈 1회</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
