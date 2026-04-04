import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, BOXES } from './TrickVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { mul: '#6366f1', real: '#f59e0b', imag: '#10b981', why: '#ec4899' };

export default function TrickViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 20 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 3 multiplication boxes */}
          {BOXES.map((b, i) => (
            <motion.g key={b.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ ...sp, delay: i * 0.1 }}>
              <rect x={b.x} y={60} width={130} height={46} rx={6}
                fill={`${C.mul}18`} stroke={C.mul} strokeWidth={1.2} />
              <text x={b.x + 65} y={80} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="hsl(var(--muted-foreground))">{b.id}</text>
              <text x={b.x + 65} y={96} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C.mul}>{b.label.split('= ')[1]}</text>
            </motion.g>
          ))}

          {/* Step 1: Real part */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.1 }}>
              <rect x={50} y={130} width={200} height={38} rx={6}
                fill={`${C.real}12`} stroke={C.real} strokeWidth={1} />
              <text x={150} y={148} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C.real}>실수부 = M1 - M2</text>
              <text x={150} y={162} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">= ac - bd (뺄셈만)</text>
            </motion.g>
          )}

          {/* Step 2: Imaginary part */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.1 }}>
              <rect x={270} y={130} width={210} height={38} rx={6}
                fill={`${C.imag}12`} stroke={C.imag} strokeWidth={1} />
              <text x={375} y={148} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C.imag}>허수부 = M3 - M1 - M2</text>
              <text x={375} y={162} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">= ad + bc (뺄셈만)</text>
            </motion.g>
          )}

          {/* Step 3: Why it works */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.1 }}>
              <rect x={80} y={190} width={360} height={38} rx={6}
                fill={`${C.why}10`} stroke={`${C.why}60`} strokeWidth={1} />
              <text x={260} y={207} textAnchor="middle" fontSize={11}
                fontWeight={600} fill={C.why}>M3 = ac + ad + bc + bd</text>
              <text x={260} y={222} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">M3 - M1 - M2 = ad + bc</text>
            </motion.g>
          )}

          {/* Step 4: Cost comparison */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.1 }}>
              <rect x={60} y={248} width={170} height={34} rx={6}
                fill="hsl(var(--muted) / 0.15)" stroke="hsl(var(--border))" strokeWidth={1} />
              <text x={145} y={269} textAnchor="middle" fontSize={10}
                fill="hsl(var(--muted-foreground))">Naive: 4곱 + 2덧</text>
              <rect x={290} y={248} width={170} height={34} rx={6}
                fill={`${C.imag}10`} stroke={C.imag} strokeWidth={1} />
              <text x={375} y={269} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C.imag}>Karatsuba: 3곱 + 5덧</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
