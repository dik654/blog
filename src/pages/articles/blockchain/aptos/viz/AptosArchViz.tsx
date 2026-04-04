import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const LAYERS = [
  { label: 'QuorumStore', sub: 'TX 배치 + ProofOfStore', color: '#8b5cf6', y: 10 },
  { label: 'DiemBFT v4', sub: '합의 (Propose → Vote → Commit)', color: '#6366f1', y: 52 },
  { label: 'Block-STM', sub: '낙관적 병렬 실행', color: '#10b981', y: 94 },
  { label: 'Jellyfish Merkle', sub: '상태 저장 & 증명', color: '#f59e0b', y: 136 },
];

const STEPS = [
  { label: 'QuorumStore: TX 배치화', body: 'BatchGenerator가 TX를 배치 → 2f+1 ProofOfStore 수집' },
  { label: 'DiemBFT v4: 합의', body: '3-chain 파이프라인 합의. 리더 평판으로 장애 리더 자동 교체' },
  { label: 'Block-STM: 병렬 실행', body: '모든 TX 낙관적 병렬 실행 → 충돌 감지 시 재실행' },
  { label: 'Jellyfish Merkle: 상태', body: '256비트 sparse Merkle tree로 상태 저장 + 증명 생성' },
];

export default function AptosArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i === step, done = i < step;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : done ? 0.6 : 0.2 }} transition={sp}>
                <motion.rect x={40} y={l.y} width={300} height={34} rx={8}
                  fill={l.color} animate={{ opacity: active ? 0.9 : done ? 0.4 : 0.12 }} transition={sp} />
                <text x={190} y={l.y + 16} textAnchor="middle" fontSize={10}
                  fontWeight={600} className="fill-white">{l.label}</text>
                <text x={190} y={l.y + 27} textAnchor="middle" fontSize={9}
                  className="fill-white/70">{l.sub}</text>
                {i > 0 && (
                  <motion.line x1={190} y1={LAYERS[i - 1].y + 34} x2={190} y2={l.y}
                    stroke={done || active ? '#888' : '#444'} strokeWidth={1}
                    strokeDasharray="3 2" animate={{ opacity: done || active ? 0.6 : 0.1 }} transition={sp} />
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
