import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'CPU: 순차 처리', body: '소수의 강력한 코어가 작업을 하나씩 처리. 복잡한 분기/제어 흐름에 유리하지만 대규모 병렬 연산에는 느림.' },
  { label: 'GPU: 병렬 처리', body: '수천 개 코어가 동시에 처리. 단순 반복 연산(행렬 곱)에서 CPU 대비 10~100배 빠름.' },
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function CPUView() {
  const tasks = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={700} fill="var(--foreground)">CPU (8코어)</text>
      {tasks.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15, ...sp }}>
          <rect x={20 + i * 46} y={28} width={40} height={22} rx={4}
            fill="#6366f120" stroke="#6366f1" strokeWidth={1} />
          <text x={40 + i * 46} y={43} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="#6366f1">{t}</text>
        </motion.g>
      ))}
      <text x={200} y={70} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">→ 순차적으로 하나씩 실행</text>
    </g>
  );
}

function GPUView() {
  const rows = 4;
  const cols = 8;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={700} fill="var(--foreground)">GPU (수천 코어)</text>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <motion.rect key={`${r}-${c}`}
            x={20 + c * 46} y={26 + r * 18} width={40} height={14} rx={2}
            fill="#10b98120" stroke="#10b981" strokeWidth={0.8}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.05, ...sp }} />
        ))
      )}
      <text x={200} y={105} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">→ 32개 작업을 동시에 실행 (실제로는 수천 개)</text>
    </g>
  );
}

export default function GPUParallelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 ? <CPUView /> : <GPUView />}
        </svg>
      )}
    </StepViz>
  );
}
