import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COMPONENTS } from './OverviewData';
import { AgentLoop } from './OverviewParts';

const W = 460, H = 220;
const CX = W / 2;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={CX - 60} y={80} width={120} height={40} rx={6}
                fill="#6366f118" stroke="#6366f1" strokeWidth={1.5} />
              <text x={CX} y={96} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">입력</text>
              <text x={CX} y={110} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="#6366f1">LLM → 출력</text>
              <text x={CX} y={140} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">1회성, 도구 없음</text>
            </motion.g>
          )}

          {(step === 1 || step === 2) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AgentLoop step={step} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {COMPONENTS.map((c, i) => {
                const cx = 60 + i * 110;
                return (
                  <motion.g key={c.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}>
                    <rect x={cx - 40} y={60} width={80} height={56} rx={6}
                      fill={`${c.color}15`} stroke={c.color} strokeWidth={1.5} />
                    <text x={cx} y={84} textAnchor="middle" fontSize={11}
                      fontWeight={700} fill={c.color}>{c.label}</text>
                    <text x={cx} y={102} textAnchor="middle" fontSize={9}
                      fill="var(--muted-foreground)">{c.short}</text>
                  </motion.g>
                );
              })}
              <text x={CX} y={150} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">4대 구성요소가 결합 → 자율적 에이전트</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
