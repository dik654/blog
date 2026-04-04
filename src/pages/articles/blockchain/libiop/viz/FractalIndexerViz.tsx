import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'R1CS', sub: 'A, B, C', color: '#6366f1', x: 40, y: 40 },
  { label: '인덱서', sub: '전처리', color: '#8b5cf6', x: 130, y: 40 },
  { label: 'row(x)', sub: '행 다항식', color: '#10b981', x: 220, y: 15 },
  { label: 'col(x)', sub: '열 다항식', color: '#f59e0b', x: 220, y: 42 },
  { label: 'val(x)', sub: '값 다항식', color: '#ec4899', x: 220, y: 68 },
  { label: '검증자', sub: 'O(log N)', color: '#3b82f6', x: 330, y: 40 },
];

const EDGES = [[0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 5], [4, 5]];

const STEP_ACTIVE = [
  [0, 1, 2, 3, 4, 5],
  [0, 1],
  [1, 2, 3, 4],
  [2, 3, 4, 5],
];

const STEPS = [
  { label: 'Fractal 전체 흐름', body: '인덱서가 R1CS를 전처리하여 O(log N) 검증을 가능하게 합니다.' },
  { label: '인덱서 입력', body: 'R1CS 제약 시스템의 A, B, C 행렬을 인덱서에 전달합니다.' },
  { label: '행렬 분해', body: '각 행렬을 row/col/val 3개 다항식으로 분해합니다.' },
  { label: 'O(log N) 검증', body: '전처리된 인덱스를 활용하여 O(log N) 시간에 검증합니다.' },
];

export default function FractalIndexerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const activeSet = new Set(STEP_ACTIVE[step]);
        return (
          <svg viewBox="0 0 520 85" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([a, b], ei) => {
              const na = NODES[a], nb = NODES[b];
              const vis = activeSet.has(a) && activeSet.has(b);
              return (
                <motion.line key={ei}
                  x1={na.x + 24} y1={na.y} x2={nb.x - 24} y2={nb.y}
                  stroke="var(--border)" strokeWidth={0.7}
                  animate={{ opacity: vis ? 0.5 : 0.08 }} transition={sp} />
              );
            })}
            {NODES.map((n, i) => {
              const active = activeSet.has(i);
              return (
                <g key={n.label}>
                  <motion.rect x={n.x - 26} y={n.y - 13} width={52} height={26} rx={4}
                    animate={{
                      fill: active ? `${n.color}18` : `${n.color}04`,
                      stroke: n.color, strokeWidth: active ? 1.4 : 0.5,
                      opacity: active ? 1 : 0.2,
                    }} transition={sp} />
                  <motion.text x={n.x} y={n.y - 1} textAnchor="middle" fontSize={9} fontWeight={600}
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
