import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'gadgets', label: 'Gadgets', color: P, x: 155, y: 10 },
  { id: 'iszero', label: 'IsZero', color: S, x: 30, y: 60 },
  { id: 'isequal', label: 'IsEqual', color: S, x: 110, y: 60 },
  { id: 'lt', label: 'Lt', color: A, x: 190, y: 60 },
  { id: 'comp', label: 'Comparator', color: A, x: 280, y: 60 },
  { id: 'muladd', label: 'MulAdd', color: P, x: 30, y: 115 },
  { id: 'addword', label: 'AddWords', color: P, x: 120, y: 115 },
  { id: 'binary', label: 'BinaryNum', color: P, x: 220, y: 115 },
  { id: 'batch', label: 'BatchIsZero', color: P, x: 310, y: 115 },
];

const EDGES = [
  { s: 0, t: 1 }, { s: 0, t: 2 }, { s: 0, t: 3 }, { s: 0, t: 4 },
  { s: 0, t: 5 }, { s: 0, t: 6 }, { s: 0, t: 7 }, { s: 0, t: 8 },
  { s: 1, t: 2 }, { s: 3, t: 4 },
];

const ACTIVE: number[][] = [
  [0,1,2,3,4,5,6,7,8], [0,1,2], [0,3,4], [0,5,6,7,8],
];

const STEPS = [
  { label: 'Gadget 시스템 전체', body: 'gadgets/ 크레이트가 재사용 가능한 회로 컴포넌트를 제공합니다.' },
  { label: '기본 검증 Gadget', body: 'IsZero -> IsEqual로 확장. 값이 0인지, 두 값이 같은지 검증합니다.' },
  { label: '비교 Gadget', body: 'Lt(바이트 분해) + IsEqual = Comparator. LT/EQ/GT를 한 번에 계산합니다.' },
  { label: '산술 & 배치', body: 'MulAdd(256비트 곱셈), AddWords(덧셈), BinaryNumber, BatchIsZero.' },
];

export default function GadgetTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const s = NODES[e.s], t = NODES[e.t];
            const on = ACTIVE[step].includes(e.s) && ACTIVE[step].includes(e.t);
            return (
              <motion.line key={i} x1={s.x + 25} y1={s.y + 14} x2={t.x + 25} y2={t.y}
                stroke="var(--muted-foreground)" strokeWidth={1}
                animate={{ opacity: on ? 0.4 : 0.06 }} transition={{ duration: 0.3 }} />
            );
          })}
          {NODES.map((n, i) => {
            const on = ACTIVE[step].includes(i);
            const w = i === 0 ? 60 : i === 4 || i === 8 ? 58 : 48;
            return (
              <motion.g key={n.id} animate={{ opacity: on ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
                <rect x={n.x} y={n.y} width={w} height={22} rx={5}
                  fill={on ? n.color + '12' : '#fff0'} stroke={n.color}
                  strokeWidth={on ? 1.5 : 1} />
                <text x={n.x + w / 2} y={n.y + 14} textAnchor="middle" fontSize={9}
                  fontWeight={500} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
