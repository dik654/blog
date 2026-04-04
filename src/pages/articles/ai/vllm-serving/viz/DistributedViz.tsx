import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const GPUS = [
  { label: 'GPU 0', x: 40, y: 55, color: '#3b82f6' },
  { label: 'GPU 1', x: 140, y: 55, color: '#6366f1' },
  { label: 'GPU 2', x: 240, y: 55, color: '#8b5cf6' },
];

const STRATEGIES = [
  { label: 'TP', desc: 'Tensor Parallel', color: '#3b82f6', y: 22 },
  { label: 'PP', desc: 'Pipeline Parallel', color: '#10b981', y: 22 },
  { label: 'EP', desc: 'Expert Parallel', color: '#f59e0b', y: 22 },
  { label: 'DP', desc: 'Data Parallel', color: '#8b5cf6', y: 22 },
];

const STEPS = [
  { label: '대형 모델 (예: 70B)' },
  { label: '4가지 병렬화 전략' },
  { label: 'Tensor Parallelism: Head 분할' },
  { label: 'All-Reduce 동기화' },
];
const BODY = [
  '140GB+ → 여러 GPU에 분배 필요',
  'TP/PP/EP/DP 4가지 전략',
  'Head를 GPU별로 분할',
  'NCCL All-Reduce로 결과 합산',
];

export default function DistributedViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 125" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Model block */}
          <rect x={120} y={2} width={100} height={20} rx={4}
            fill="#6366f110" stroke="#6366f1" strokeWidth={1.2} />
          <text x={170} y={15} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight={600}>
            Llama-70B (140GB)
          </text>

          {/* Step 1: strategy badges */}
          {step === 1 && STRATEGIES.map((s, i) => (
            <motion.g key={s.label} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: i * 0.1 }}>
              <rect x={10 + i * 82} y={30} width={72} height={16} rx={3}
                fill={`${s.color}15`} stroke={s.color} strokeWidth={1} />
              <text x={46 + i * 82} y={41} textAnchor="middle" fontSize={9} fill={s.color} fontWeight={600}>
                {s.label}: {s.desc}
              </text>
            </motion.g>
          ))}

          {/* GPU boxes */}
          {step >= 2 && GPUS.map((g, i) => (
            <motion.g key={g.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: i * 0.1 }}>
              <rect x={g.x} y={g.y} width={80} height={30} rx={5}
                fill={`${g.color}10`} stroke={g.color} strokeWidth={1.5} />
              <text x={g.x + 40} y={g.y + 13} textAnchor="middle" fontSize={9}
                fill={g.color} fontWeight={600}>{g.label}</text>
              <text x={g.x + 40} y={g.y + 24} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                Head {i * 14}~{(i + 1) * 14 - 1}
              </text>
              {/* Arrow from model to GPU */}
              <line x1={170} y1={22} x2={g.x + 40} y2={g.y}
                stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="3 2" />
            </motion.g>
          ))}

          {/* Step 3: All-Reduce */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={110} y={92} width={120} height={18} rx={4}
                fill="#ec489920" stroke="#ec4899" strokeWidth={1.5} />
              <text x={170} y={104} textAnchor="middle" fontSize={9} fill="#ec4899" fontWeight={600}>
                NCCL All-Reduce
              </text>
              {GPUS.map((g, i) => (
                <motion.line key={i} x1={g.x + 40} y1={g.y + 30} x2={170} y2={92}
                  stroke="#ec4899" strokeWidth={1.2} strokeDasharray="4 2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} />
              ))}
            </motion.g>
          )}
          {/* inline body */}
          <motion.text x={350} y={57} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
