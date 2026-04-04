import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: 'Chunk 증명', body: '연속된 블록 묶음을 SuperCircuit으로 증명합니다. 동적 크기(k값)를 결정합니다.' },
  { label: 'Batch 집계', body: '여러 Chunk 증명을 집계하여 중간 상태 루트의 연속성을 검증합니다.' },
  { label: 'Bundle 압축', body: '최종 Bundle 증명을 생성하여 L1 검증 컨트랙트에 제출합니다.' },
];

const CHUNKS = [
  { label: 'Chunk 1', color: '#a855f7', x: 20 },
  { label: 'Chunk 2', color: '#3b82f6', x: 100 },
  { label: 'Chunk 3', color: '#10b981', x: 180 },
];

export default function ProofAggViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Chunk proofs */}
          {CHUNKS.map((c, i) => (
            <motion.g key={c.label} animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
              <rect x={c.x} y={10} width={65} height={30} rx={5}
                fill={step === 0 ? c.color + '20' : c.color + '10'}
                stroke={c.color} strokeWidth={step === 0 ? 1.5 : 0.8} />
              <text x={c.x + 32} y={28} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={c.color}>{c.label}</text>
              {/* Arrow down */}
              <motion.line x1={c.x + 32} y1={40} x2={c.x + 32} y2={55}
                stroke={c.color} strokeWidth={0.8}
                animate={{ opacity: step >= 1 ? 0.5 : 0.1 }} transition={sp} />
              {i > 0 && step >= 0 && (
                <motion.circle r={2} fill={c.color}
                  animate={{ cx: [CHUNKS[i-1].x + 65, c.x], cy: [25, 25] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }} />
              )}
            </motion.g>
          ))}

          {/* Batch proof */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
            <rect x={40} y={55} width={180} height={30} rx={6}
              fill={step === 1 ? '#f59e0b20' : '#f59e0b08'}
              stroke="#f59e0b" strokeWidth={step === 1 ? 1.5 : 0.8} />
            <text x={130} y={74} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="#f59e0b">Batch Proof</text>
          </motion.g>

          {/* Arrow down */}
          <motion.line x1={130} y1={85} x2={130} y2={100}
            stroke="#f59e0b" strokeWidth={0.8}
            animate={{ opacity: step >= 2 ? 0.5 : 0.1 }} transition={sp} />

          {/* Bundle proof */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={sp}>
            <rect x={70} y={100} width={120} height={25} rx={6}
              fill={step === 2 ? '#ec489920' : '#ec489908'}
              stroke="#ec4899" strokeWidth={step === 2 ? 1.8 : 0.8} />
            <text x={130} y={116} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="#ec4899">Bundle → L1</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
