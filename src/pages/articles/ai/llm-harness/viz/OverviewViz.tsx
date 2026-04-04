import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, HARNESS_PARTS } from './OverviewData';

const W = 460, H = 220;
const CX = W / 2, LLM_Y = 110;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* LLM core */}
          <motion.rect x={CX - 40} y={LLM_Y - 16} width={80} height={32} rx={6}
            fill={step >= 1 ? '#6366f120' : '#6366f10a'} stroke="#6366f1"
            animate={{ strokeWidth: step >= 1 ? 2 : 1 }}
            transition={{ duration: 0.3 }} />
          <text x={CX} y={LLM_Y + 4} textAnchor="middle"
            fontSize={11} fontWeight={700} fill="#6366f1">LLM</text>

          {/* step 0: raw model alone */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={CX - 50} y={18} width={100} height={26} rx={5}
                fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={CX} y={35} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#f59e0b">모델 단독 호출</text>
              <line x1={CX} y1={44} x2={CX} y2={LLM_Y - 16}
                stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" />
              <text x={CX} y={H - 14} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">→ 환각 · 형식 깨짐 · 보안 구멍</text>
            </motion.g>
          )}

          {/* step 1: harness wrapper */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={CX - 80} y={LLM_Y - 36} width={160} height={72} rx={10}
                fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="6 3" />
              <text x={CX} y={LLM_Y + 50} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#10b981">Harness (래퍼)</text>
            </motion.g>
          )}

          {/* step 2+: 5 harness parts */}
          {step >= 2 && HARNESS_PARTS.map((p, i) => {
            const px = 25 + i * 85;
            return (
              <motion.g key={p.label}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}>
                <rect x={px} y={24} width={68} height={30} rx={5}
                  fill={`${p.color}18`} stroke={p.color} strokeWidth={1} />
                <text x={px + 34} y={37} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={p.color}>{p.short}</text>
                <text x={px + 34} y={48} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{p.label}</text>
                <line x1={px + 34} y1={54} x2={CX} y2={LLM_Y - 16}
                  stroke={p.color} strokeWidth={0.8} opacity={0.4} />
              </motion.g>
            );
          })}

          {/* step 3: harness engineering label */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={CX - 70} y={LLM_Y + 26} width={140} height={24} rx={5}
                fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
              <text x={CX} y={LLM_Y + 42} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#10b981">Harness Engineering</text>
            </motion.g>
          )}

          {/* output quality */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <text x={CX} y={H - 10} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">→ 안정적 제품 품질</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
