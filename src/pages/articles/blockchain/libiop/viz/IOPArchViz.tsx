import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'R1CS', sub: 'A*z o B*z = C*z', color: '#6366f1', x: 30, y: 40 },
  { label: 'IOP', sub: '다중 라운드', color: '#8b5cf6', x: 110, y: 20 },
  { label: 'LDT', sub: '저차 테스트', color: '#10b981', x: 110, y: 60 },
  { label: 'BCS', sub: 'Fiat-Shamir', color: '#f59e0b', x: 200, y: 40 },
  { label: 'Merkle', sub: '오라클 커밋', color: '#ec4899', x: 280, y: 20 },
  { label: 'zkSNARK', sub: '비상호작용', color: '#3b82f6', x: 360, y: 40 },
];

const EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 5]];

const STEP_ACTIVE = [
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2],
  [1, 2, 3],
  [3, 4, 5],
];

const STEPS = [
  { label: 'libiop 아키텍처', body: 'R1CS 제약을 IOP로 변환하고 BCS를 거쳐 zkSNARK로 만듭니다.' },
  { label: 'R1CS -> IOP', body: 'R1CS 제약 시스템을 다항식 IOP로 변환합니다.' },
  { label: 'LDT + BCS', body: '저차 테스트(LDT)와 BCS 변환으로 비상호작용화합니다.' },
  { label: 'zkSNARK 출력', body: '머클 트리 커밋과 Fiat-Shamir로 최종 증명을 생성합니다.' },
];

export default function IOPArchViz() {
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
                  x1={na.x + 22} y1={na.y} x2={nb.x - 22} y2={nb.y}
                  stroke="var(--border)" strokeWidth={0.7}
                  animate={{ opacity: vis ? 0.5 : 0.08 }} transition={sp} />
              );
            })}
            {NODES.map((n, i) => {
              const active = activeSet.has(i);
              return (
                <g key={n.label}>
                  <motion.rect x={n.x - 26} y={n.y - 14} width={52} height={28} rx={4}
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
