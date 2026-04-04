import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { WORDS, WIN, EMB, NEG, STEPS, BODY } from './TrainingPipelineData';

const spring = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

export default function TrainingPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0-1: corpus words */}
          {WORDS.map((w, i) => {
            const inWin = step < 2 ? Math.abs(i - WIN[0]) <= 1 : false;
            const isCenter = step >= 1 && i === WIN[0];
            return (
              <motion.g key={i} animate={{ opacity: step <= 1 ? 1 : 0.3 }} transition={spring}>
                <rect x={10 + i * 44} y={10} width={40} height={22} rx={4}
                  fill={isCenter ? '#6366f120' : inWin ? '#3b82f610' : '#80808008'}
                  stroke={isCenter ? '#6366f1' : inWin ? '#3b82f6' : '#555'} strokeWidth={isCenter ? 2 : 1} />
                <text x={30 + i * 44} y={24} textAnchor="middle" fontSize={9}
                  fill={isCenter ? '#6366f1' : inWin ? '#3b82f6' : 'var(--foreground)'}
                  fontWeight={isCenter ? 700 : 400}>{w}</text>
              </motion.g>
            );
          })}
          {step >= 1 && step < 3 && (
            <motion.text x={30 + WIN[0] * 44} y={44} textAnchor="middle" fontSize={9} fill="#6366f1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>center</motion.text>
          )}
          {/* Step 2: embedding bars with real values */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
              <text x={15} y={56} fontSize={9} fill="var(--muted-foreground)">W[학교]→</text>
              {EMB.map((e, i) => {
                const h = Math.abs(e.v) * 22;
                const baseY = 72, barY = e.v >= 0 ? baseY - h : baseY;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}>
                    <rect x={60 + i * 22} y={barY} width={16} height={h} rx={2}
                      fill={e.v >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.6} />
                    <text x={68 + i * 22} y={baseY + 12} textAnchor="middle" fontSize={7}
                      fill="#10b981" fontWeight={600}>{e.v.toFixed(2)}</text>
                    <text x={68 + i * 22} y={baseY + 20} textAnchor="middle" fontSize={7}
                      fill="currentColor" fillOpacity={0.3}>{e.label}</text>
                  </motion.g>
                );
              })}
              <text x={60 + EMB.length * 22 + 6} y={68} fontSize={8} fill="#10b981">...300dims</text>
            </motion.g>
          )}
          {/* Step 3: negative samples */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
              <rect x={200} y={48} width={50} height={20} rx={4} fill="#10b98120" stroke="#10b981" strokeWidth={1.5} />
              <text x={225} y={61} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>친구 +</text>
              {NEG.map((w, i) => (
                <g key={w}>
                  <rect x={260 + i * 36} y={48} width={32} height={20} rx={4} fill="#ef444420" stroke="#ef4444" strokeWidth={1} />
                  <text x={276 + i * 36} y={61} textAnchor="middle" fontSize={9} fill="#ef4444">{w}</text>
                </g>
              ))}
              <text x={200} y={44} fontSize={9} fill="var(--muted-foreground)">positive</text>
              <text x={300} y={44} fontSize={9} fill="var(--muted-foreground)">negative (k=3)</text>
            </motion.g>
          )}
          {/* Step 4: loss with concrete numerical computation */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
              <rect x={190} y={80} width={180} height={38} rx={4}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.7} />
              <text x={200} y={93} fontSize={8} fill="#f59e0b" fontWeight={600}>
                σ(v_친구 · v_학교) = σ(1.24) = 0.78
              </text>
              <text x={200} y={105} fontSize={8} fill="#ef4444">
                L = -log(0.78) - Σlog(σ(-vₙ·v)) = 0.25 + 1.02
              </text>
              <text x={200} y={115} fontSize={7} fill="currentColor" fillOpacity={0.4}>
                ∂L/∂W → lr=0.025 → W 갱신
              </text>
              <motion.line x1={280} y1={118} x2={100} y2={136} stroke="#ec4899" strokeWidth={1.5}
                strokeDasharray="4 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }} />
              <text x={95} y={146} fontSize={8} fill="#ec4899" fontWeight={600}>SGD → W 갱신</text>
            </motion.g>
          )}
          {/* inline body */}
          <motion.text x={380} y={65} fontSize={9} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
