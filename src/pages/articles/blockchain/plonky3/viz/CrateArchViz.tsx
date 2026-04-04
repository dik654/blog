import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'field', sub: 'Field 트레이트', color: '#6366f1', x: 50, y: 18 },
  { label: 'baby-bear', sub: '2³¹-2²⁷+1', color: '#818cf8', x: 50, y: 50 },
  { label: 'monty-31', sub: 'Montgomery', color: '#818cf8', x: 50, y: 76 },
  { label: 'poseidon2', sub: 'ZK 해시', color: '#10b981', x: 160, y: 18 },
  { label: 'merkle', sub: 'N진 트리', color: '#10b981', x: 160, y: 50 },
  { label: 'fri', sub: 'FRI PCS', color: '#f59e0b', x: 270, y: 34 },
  { label: 'air', sub: 'AirBuilder', color: '#ec4899', x: 270, y: 70 },
  { label: 'uni-stark', sub: 'STARK 증명기', color: '#ec4899', x: 370, y: 50 },
  { label: 'challenger', sub: 'Fiat-Shamir', color: '#8b5cf6', x: 370, y: 18 },
  { label: 'dft', sub: 'Radix-2', color: '#6b7280', x: 160, y: 76 },
];

const EDGES: [number, number][] = [
  [2, 1], [1, 0], [3, 4], [4, 5], [5, 7], [6, 7], [8, 5], [8, 7], [9, 5], [0, 3],
];

const STEP_ACTIVE: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2],
  [0, 3, 4, 5, 9],
  [5, 6, 7, 8],
];

const STEPS = [
  { label: '전체 구조', body: 'Plonky3 크레이트 의존성 전체 그래프.' },
  { label: '필드 레이어', body: 'BabyBear + Montgomery 곱셈 → Field 트레이트 구현.' },
  { label: '해시 & 커밋', body: 'Poseidon2 → Merkle Tree → FRI PCS 체인.' },
  { label: 'STARK 증명', body: 'AIR 제약 + FRI PCS → uni-stark 증명기.' },
];

export default function CrateArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const actSet = new Set(STEP_ACTIVE[step]);
        return (
          <svg viewBox="0 0 570 95" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([a, b], ei) => {
              const na = NODES[a], nb = NODES[b];
              const vis = actSet.has(a) && actSet.has(b);
              return (
                <motion.line key={ei}
                  x1={na.x + 20} y1={na.y} x2={nb.x - 20} y2={nb.y}
                  stroke="var(--border)" strokeWidth={0.6}
                  animate={{ opacity: vis ? 0.45 : 0.06 }} transition={sp} />
              );
            })}
            {NODES.map((n, i) => {
              const active = actSet.has(i);
              return (
                <g key={n.label}>
                  <motion.rect x={n.x - 28} y={n.y - 10} width={56} height={20} rx={3}
                    animate={{
                      fill: active ? `${n.color}18` : `${n.color}04`,
                      stroke: n.color, strokeWidth: active ? 1.4 : 0.5,
                      opacity: active ? 1 : 0.18,
                    }} transition={sp} />
                  <motion.text x={n.x} y={n.y - 1} textAnchor="middle" fontSize={9}
                    fontWeight={600}
                    animate={{ fill: n.color, opacity: active ? 1 : 0.18 }} transition={sp}>
                    {n.label}
                  </motion.text>
                  <motion.text x={n.x} y={n.y + 7} textAnchor="middle" fontSize={9}
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
