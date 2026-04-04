import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '전체 구조', body: 'Fp → Fp2 확장, G1/G2 타원곡선 군, Jacobian/Affine 좌표 변환, 페어링 연산.' },
  { label: '체 계층', body: 'Fp(256-bit)가 모든 연산의 기초. Fp2 = Fp[u]/(u²+1)로 2차 확장.' },
  { label: 'G1 / G2 점 연산', body: 'G1은 Fp 위, G2는 Fp2 위. 동일한 더블링/덧셈 코드를 Jacobian 좌표로 처리.' },
  { label: '페어링 연결', body: 'e: G1 × G2 → GT. Miller loop + Final Exponentiation.' },
];

/* 레이아웃:
   Fp → Fp2       Fr 스칼라
   ↓     ↓        ↓    ↓
   G1    G2 → Jacobian → Affine
   └──┬──┘
    Pairing */
const NODES = [
  { label: 'Fp (256-bit)', sub: '기본 소수체', color: '#6366f1', x: 10, y: 4 },
  { label: 'Fp2', sub: 'Fp[u]/(u²+1)', color: '#10b981', x: 130, y: 4 },
  { label: 'Fr 스칼라', sub: '스칼라 곱', color: '#0ea5e9', x: 370, y: 4 },
  { label: 'G1 ∈ E(Fp)', sub: '512-bit 점', color: '#8b5cf6', x: 10, y: 52 },
  { label: "G2 ∈ E'(Fp2)", sub: '1024-bit 점', color: '#f59e0b', x: 130, y: 52 },
  { label: 'Jacobian', sub: '(X,Y,Z)', color: '#ec4899', x: 260, y: 52 },
  { label: 'Affine', sub: '(x,y)', color: '#ef4444', x: 370, y: 52 },
  { label: 'e(G1,G2)→GT', sub: '페어링', color: '#a855f7', x: 130, y: 100 },
];

const ARROWS: [number, number][] = [
  [0, 3], [0, 1], [1, 4], [3, 5], [4, 5], [5, 6], [2, 3], [2, 4], [3, 7], [4, 7],
];

const ACTIVE: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7], [0, 1], [2, 3, 4, 5, 6, 0, 1], [3, 4, 7],
];

export default function G1G2ArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 620 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="g-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0 0L6 3L0 6z" fill="#888" />
            </marker>
          </defs>
          {ARROWS.map(([a, b], i) => {
            const na = NODES[a], nb = NODES[b];
            const on = ACTIVE[step].includes(a) && ACTIVE[step].includes(b);
            const x1 = na.x + 55, y1 = na.y + 38;
            const x2 = nb.x + 55, y2 = nb.y + 2;
            return (
              <motion.line key={i}
                x1={x1} y1={Math.min(y1, na.y + 40)}
                x2={x2} y2={Math.max(y2, nb.y)}
                stroke="#888" strokeWidth={1.2} markerEnd="url(#g-arr)"
                animate={{ opacity: on ? 0.7 : 0.06 }} />
            );
          })}
          {NODES.map((n, i) => {
            const on = ACTIVE[step].includes(i);
            return (
              <g key={i}>
                <motion.rect x={n.x} y={n.y} width={108} height={38} rx={7}
                  fill={n.color} animate={{ opacity: on ? 1 : 0.1 }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + 54} y={n.y + 15} textAnchor="middle"
                  className="fill-white text-[7.5px] font-bold"
                  style={{ opacity: on ? 1 : 0.2 }}>{n.label}</text>
                <text x={n.x + 54} y={n.y + 28} textAnchor="middle"
                  className="fill-white/60 text-[6.5px]"
                  style={{ opacity: on ? 0.8 : 0.15 }}>{n.sub}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
