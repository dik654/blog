import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, SOURCES } from './ContextOverviewData';

const W = 500, H = 220;
const BW = 78, BH = 32;
const CX = W / 2, LLM_Y = 110;

export default function ContextOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showSources = step >= 2;
        const showArrow = step >= 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* LLM central box */}
            <motion.rect x={CX - 45} y={LLM_Y - 18} width={90} height={36} rx={6}
              fill={step >= 1 ? '#6366f120' : '#6366f10a'} stroke="#6366f1"
              animate={{ strokeWidth: step >= 1 ? 2 : 1 }}
              transition={{ duration: 0.3 }} />
            <text x={CX} y={LLM_Y + 5} textAnchor="middle" fontSize={11}
              fontWeight={700} fill="#6366f1">LLM</text>

            {/* prompt-only indicator (step 0) */}
            {step === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={CX - 50} y={20} width={100} height={28} rx={5}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
                <text x={CX} y={38} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#f59e0b">단일 프롬프트</text>
                <line x1={CX} y1={48} x2={CX} y2={LLM_Y - 18}
                  stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" />
              </motion.g>
            )}

            {/* 5 context sources (step >= 2) */}
            {showSources && SOURCES.map((s, i) => {
              const sx = 15 + i * 96;
              const sy = 30;
              return (
                <motion.g key={s.label}
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={sx} y={sy} width={BW} height={BH} rx={5}
                    fill={`${s.color}18`} stroke={s.color} strokeWidth={1} />
                  <text x={sx + BW / 2} y={sy + 13} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={s.color}>{s.short}</text>
                  <text x={sx + BW / 2} y={sy + 25} textAnchor="middle"
                    fontSize={9} fill="var(--muted-foreground)">{s.label}</text>
                  <line x1={sx + BW / 2} y1={sy + BH} x2={CX} y2={LLM_Y - 18}
                    stroke={s.color} strokeWidth={0.8} opacity={0.4} />
                </motion.g>
              );
            })}

            {/* merge arrow glow (step 3) */}
            {showArrow && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={CX - 60} y={LLM_Y + 28} width={120} height={24} rx={5}
                  fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
                <text x={CX} y={LLM_Y + 44} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#10b981">Context Engineering</text>
              </motion.g>
            )}

            {/* output */}
            <motion.g animate={{ opacity: step >= 1 ? 0.6 : 0.2 }}>
              <text x={CX} y={H - 15} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">→ 응답 품질</text>
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
