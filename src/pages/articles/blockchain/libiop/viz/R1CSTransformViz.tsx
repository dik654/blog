import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'R1CS', sub: 'A,B,C 행렬', color: '#6366f1', x: 50, y: 40 },
  { label: '다항식', sub: 'z(x) 보간', color: '#8b5cf6', x: 140, y: 20 },
  { label: 'RS 인코딩', sub: '평가 도메인 L', color: '#10b981', x: 140, y: 60 },
  { label: '오라클', sub: '머클 커밋', color: '#f59e0b', x: 240, y: 20 },
  { label: 'LDT', sub: '저차 검증', color: '#ec4899', x: 240, y: 60 },
  { label: 'IOP 증명', sub: '라운드 완료', color: '#3b82f6', x: 340, y: 40 },
];

const EDGES = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]];

const STEP_ACTIVE = [
  [0, 1, 2, 3, 4, 5],
  [0, 1],
  [1, 2, 3],
  [3, 4, 5],
];

const STEPS = [
  { label: 'R1CS -> IOP 변환', body: 'R1CS 제약을 다항식 IOP로 변환하는 전체 흐름입니다.' },
  { label: '다항식 인코딩', body: '변수 할당을 라그랑주 보간으로 다항식화합니다.' },
  { label: 'RS 인코딩 & 커밋', body: 'Reed-Solomon 코드워드로 확장하고 머클 트리에 커밋합니다.' },
  { label: 'LDT 검증', body: '저차 테스트(LDT)로 다항식의 차수 제한을 검증합니다.' },
];

export default function R1CSTransformViz() {
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
                  <motion.rect x={n.x - 28} y={n.y - 14} width={56} height={28} rx={4}
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
