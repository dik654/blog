import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewData';

const W = 460, H = 220;
const CX = W / 2;

const PARTS = [
  { label: 'name', y: 30, color: '#6366f1' },
  { label: 'description', y: 65, color: '#6366f1' },
  { label: 'parameters', y: 100, color: '#10b981' },
  { label: 'prompt body', y: 135, color: '#f59e0b' },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Skill package box */}
          <motion.rect x={CX - 90} y={20} width={180} height={170} rx={8}
            fill="var(--card)" stroke={step >= 1 ? '#6366f1' : 'var(--border)'}
            animate={{ strokeWidth: step >= 1 ? 2 : 1 }}
            transition={{ duration: 0.3 }} />
          <text x={CX} y={14} textAnchor="middle" fontSize={10}
            fontWeight={700} fill="var(--foreground)">SKILL</text>

          {/* 4 parts (step 1) */}
          {step >= 1 && PARTS.map((p, i) => (
            <motion.g key={p.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <rect x={CX - 75} y={p.y} width={150} height={28} rx={4}
                fill={`${p.color}15`} stroke={p.color} strokeWidth={1} />
              <text x={CX} y={p.y + 18} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={p.color}>{p.label}</text>
            </motion.g>
          ))}

          {/* Step 0: simple prompt vs skill */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={60} y={70} width={120} height={36} rx={6}
                fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1} />
              <text x={120} y={92} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#f59e0b">단일 프롬프트</text>
              <text x={CX} y={92} fontSize={12} fill="var(--muted-foreground)"
                textAnchor="middle">→</text>
              <rect x={280} y={70} width={120} height={36} rx={6}
                fill="#6366f115" stroke="#6366f1" strokeWidth={1} />
              <text x={340} y={92} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#6366f1">Skill 패키지</text>
            </motion.g>
          )}

          {/* Step 2: library analogy */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={20} y={55} width={100} height={50} rx={6}
                fill="#10b98115" stroke="#10b981" strokeWidth={1} />
              <text x={70} y={75} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#10b981">npm library</text>
              <text x={70} y={92} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">import해서 사용</text>

              <text x={CX} y={85} textAnchor="middle"
                fontSize={10} fill="var(--muted-foreground)">≈</text>

              <rect x={340} y={55} width={100} height={50} rx={6}
                fill="#6366f115" stroke="#6366f1" strokeWidth={1} />
              <text x={390} y={75} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#6366f1">Agent Skill</text>
              <text x={390} y={92} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">자동 호출</text>
            </motion.g>
          )}

          {/* Step 3: benefits */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['복붙 제거', '품질 일관성', '생태계 공유'].map((t, i) => (
                <motion.g key={t}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <rect x={20 + i * 150} y={60} width={110} height={32} rx={5}
                    fill="#10b98112" stroke="#10b981" strokeWidth={1} />
                  <text x={75 + i * 150} y={80} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill="#10b981">{t}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
