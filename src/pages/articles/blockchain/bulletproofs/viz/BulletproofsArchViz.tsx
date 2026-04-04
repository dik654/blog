import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: '비밀 v', sub: 'v ∈ [0, 2ⁿ)', color: '#6366f1', x: 40, y: 20 },
  { label: '비트 분해', sub: 'aᵢ ∈ {0,1}', color: '#8b5cf6', x: 40, y: 60 },
  { label: 'Pedersen', sub: 'C = v·B + r·B̃', color: '#10b981', x: 120, y: 20 },
  { label: 't(x)', sub: '⟨l(x),r(x)⟩', color: '#f59e0b', x: 120, y: 60 },
  { label: 'IPA', sub: 'O(log n)', color: '#ec4899', x: 200, y: 40 },
  { label: 'Proof', sub: '~672 B', color: '#3b82f6', x: 280, y: 40 },
  { label: '검증자', sub: 'MSM 확인', color: '#ef4444', x: 350, y: 40 },
];

const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [5, 6],
];

const STEP_ACTIVE = [
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2],
  [1, 2, 3],
  [3, 4, 5],
  [5, 6],
];

const STEPS = [
  { label: '전체 아키텍처', body: 'Bulletproofs 범위 증명의 Prover → Verifier 전체 흐름.' },
  { label: '비트 분해 & 커밋', body: '비밀 값 v를 n비트로 분해하고 Pedersen 커밋을 생성합니다.' },
  { label: '다항식 구성', body: 'Fiat-Shamir 챌린지 y,z로 t(x)=⟨l(x),r(x)⟩를 구성합니다.' },
  { label: 'IPA 증명', body: '내적 인수 증명으로 O(log n) 크기로 압축합니다.' },
  { label: '검증', body: '검증자가 RangeProof를 받아 MSM으로 확인합니다.' },
];

export default function BulletproofsArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const activeSet = new Set(STEP_ACTIVE[step]);
        return (
          <svg viewBox="0 0 540 85" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([a, b], ei) => {
              const na = NODES[a], nb = NODES[b];
              const vis = activeSet.has(a) && activeSet.has(b);
              return (
                <motion.line key={ei}
                  x1={na.x + 20} y1={na.y} x2={nb.x - 20} y2={nb.y}
                  stroke="var(--border)" strokeWidth={0.7}
                  animate={{ opacity: vis ? 0.5 : 0.08 }} transition={sp} />
              );
            })}
            {NODES.map((n, i) => {
              const active = activeSet.has(i);
              return (
                <g key={n.label}>
                  <motion.rect x={n.x - 24} y={n.y - 14} width={48} height={28} rx={4}
                    animate={{
                      fill: active ? `${n.color}18` : `${n.color}04`,
                      stroke: n.color, strokeWidth: active ? 1.4 : 0.5,
                      opacity: active ? 1 : 0.2,
                    }} transition={sp} />
                  <motion.text x={n.x} y={n.y - 2} textAnchor="middle" fontSize={9} fontWeight={600}
                    animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                    {n.label}
                  </motion.text>
                  <motion.text x={n.x} y={n.y + 8} textAnchor="middle" fontSize={9}
                    animate={{ fill: n.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                    {n.sub}
                  </motion.text>
                </g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
