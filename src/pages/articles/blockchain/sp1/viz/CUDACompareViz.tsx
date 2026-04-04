import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const OPS = [
  { label: 'NTT', color: '#10b981' },
  { label: 'MSM', color: '#f59e0b' },
  { label: 'Poseidon2', color: '#8b5cf6' },
  { label: 'FRI 커밋', color: '#ec4899' },
];

const STEPS = [
  { label: 'GPU 가속 전체', body: 'CUDA 커널이 NTT, MSM, Poseidon2, FRI를 병렬 처리합니다.' },
  { label: 'CPU 경로 (~15초)', body: 'CPU는 순차 처리로 ~15초가 걸립니다.' },
  { label: 'GPU 경로 (~0.3초)', body: 'GPU는 수천 코어로 병렬 처리해 ~0.3초 만에 완료합니다.' },
];

export default function CUDACompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* CPU box */}
          <motion.rect x={20} y={20} width={80} height={36} rx={8}
            fill={step === 1 ? '#6b728018' : '#6b728008'} stroke="#6b7280"
            strokeWidth={step === 1 ? 2 : 1} animate={{ opacity: step === 2 ? 0.3 : 1 }} />
          <text x={60} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6b7280">CPU</text>
          {/* GPU box */}
          <motion.rect x={20} y={120} width={80} height={36} rx={8}
            fill={step === 2 ? '#84cc1618' : '#84cc1608'} stroke="#84cc16"
            strokeWidth={step === 2 ? 2 : 1} animate={{ opacity: step === 1 ? 0.3 : 1 }} />
          <text x={60} y={142} textAnchor="middle" fontSize={10} fontWeight={600} fill="#84cc16">CUDA GPU</text>
          {/* Operation boxes */}
          {OPS.map((op, i) => {
            const x = 160 + i * 58, y = 70;
            return (
              <motion.g key={i} animate={{ opacity: 1 }} initial={{ opacity: 0 }}
                transition={{ delay: i * 0.08 }}>
                <rect x={x} y={y} width={52} height={36} rx={6}
                  fill={op.color + '18'} stroke={op.color} strokeWidth={1} />
                <text x={x + 26} y={y + 22} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={op.color}>{op.label}</text>
              </motion.g>
            );
          })}
          {/* CPU arrows (sequential, slow) */}
          {step === 1 && OPS.map((_, i) => (
            <motion.line key={`c${i}`} x1={100} y1={38} x2={160 + i * 58} y2={85}
              stroke="#6b7280" strokeWidth={1} strokeDasharray="3 2"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ delay: i * 0.15 }} />
          ))}
          {/* GPU arrows (parallel, fast) */}
          {step !== 1 && OPS.map((op, i) => (
            <motion.line key={`g${i}`} x1={100} y1={138} x2={160 + i * 58} y2={107}
              stroke={step === 2 ? op.color : '#84cc16'} strokeWidth={step === 2 ? 1.5 : 1}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: step === 2 ? 0.8 : 0.3 }}
              transition={{ duration: 0.3, delay: 0.02 }} />
          ))}
          {/* Timing labels */}
          {step === 1 && (
            <motion.text x={60} y={75} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="#ef4444" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>~15초</motion.text>
          )}
          {step === 2 && (
            <motion.text x={60} y={110} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="#84cc16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>~0.3초</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
