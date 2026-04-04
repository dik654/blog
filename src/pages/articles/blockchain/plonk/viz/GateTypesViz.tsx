import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const GATES = [
  { id: 'arith', label: '산술', color: '#6366f1', x: 120, y: 5 },
  { id: 'range', label: '범위', color: '#10b981', x: 20, y: 60 },
  { id: 'logic', label: '논리', color: '#f59e0b', x: 100, y: 60 },
  { id: 'ecc', label: 'ECC', color: '#8b5cf6', x: 180, y: 60 },
  { id: 'lookup', label: '룩업', color: '#ec4899', x: 260, y: 60 },
];

const LINKS = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 0, to: 3 }, { from: 0, to: 4 },
  { from: 4, to: 1 }, { from: 4, to: 2 },
];

const ACTIVE: number[][] = [
  [0, 1, 2, 3, 4, 5], [0], [1], [2, 3], [4, 5],
];

const BW = 60, BH = 28;
const mid = (i: number) => ({ x: GATES[i].x + BW / 2, y: GATES[i].y + BH / 2 });

const STEPS = [
  { label: '게이트 타입 관계도', body: '산술 게이트가 기본이며, 특수 게이트들이 이를 확장한다.' },
  { label: '산술 → 범위', body: '범위 게이트는 산술 게이트를 이용해 4비트 쿼드를 검증.' },
  { label: '산술 → 논리', body: 'AND/XOR 연산도 산술 제약으로 표현 가능.' },
  { label: '산술 → ECC', body: '타원곡선 점 덧셈은 4개의 산술 제약으로 구성.' },
  { label: '룩업 → 범위/논리', body: 'Plookup으로 범위·논리 게이트를 1개 제약으로 대체 가능.' },
];

export default function GateTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LINKS.map((l, i) => {
            const f = mid(l.from), t = mid(l.to);
            const show = ACTIVE[step].includes(i);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1} strokeDasharray="4 2"
                animate={{ opacity: show ? 0.6 : 0.06 }} transition={sp} />
            );
          })}
          {GATES.map((g, i) => {
            const active = step === 0 || ACTIVE[step].some(li =>
              LINKS[li]?.from === i || LINKS[li]?.to === i) || (step === 0);
            return (
              <g key={g.id}>
                <motion.rect x={g.x} y={g.y} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${g.color}20` : `${g.color}06`,
                    stroke: g.color, strokeWidth: active ? 1.5 : 0.4 }}
                  transition={sp} />
                <text x={g.x + BW / 2} y={g.y + BH / 2 + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={g.color}>{g.label}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
