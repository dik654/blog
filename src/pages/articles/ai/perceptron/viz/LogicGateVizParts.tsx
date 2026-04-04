import { motion } from 'framer-motion';
import { C, GATES } from '../LogicGateVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const M = 80, S = 180;
const cx = (v: number) => M + v * S;
const cy = (v: number) => M + (1 - v) * S;

export function GateStep({ step }: { step: number }) {
  const g = GATES[step];
  const slope = g.lineY2 - g.lineY1;

  // 결정 경계가 축과 만나는 점 (x₂ = lineY1 + slope*x₁ = 0 → x₁절편, x₁=0 → x₂절편)
  const xIntercept = -g.lineY1 / slope; // x₂=0일 때 x₁ 값
  const yIntercept = g.lineY1;           // x₁=0일 때 x₂ 값

  return (
    <g>
      <defs><clipPath id={`c${step}`}>
        <rect x={cx(-0.15)} y={cy(1.35)} width={cx(1.35) - cx(-0.15)} height={cy(-0.15) - cy(1.35)} />
      </clipPath></defs>

      {/* 활성 영역 */}
      <motion.polygon clipPath={`url(#c${step})`}
        points={`${cx(-0.5)},${cy(g.lineY1 + slope * -0.5)} ${cx(1.5)},${cy(g.lineY1 + slope * 1.5)} ${cx(1.5)},${cy(2)} ${cx(-0.5)},${cy(2)}`}
        fill={`${C.active}10`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />

      {/* 결정 경계 선 */}
      <motion.line clipPath={`url(#c${step})`}
        x1={cx(-0.5)} y1={cy(g.lineY1 + slope * -0.5)}
        x2={cx(1.5)} y2={cy(g.lineY1 + slope * 1.5)}
        stroke={C.boundary} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />

      {/* 축 — 절편 위치까지 연장 */}
      <line x1={cx(-0.15)} y1={cy(0)} x2={cx(Math.max(xIntercept, 1) + 0.2)} y2={cy(0)}
        stroke="var(--border)" strokeWidth={0.5} />
      <line x1={cx(0)} y1={cy(-0.15)} x2={cx(0)} y2={cy(Math.max(yIntercept, 1) + 0.2)}
        stroke="var(--border)" strokeWidth={0.5} />

      {/* 축 이름 */}
      <text x={cx(Math.max(xIntercept, 1) + 0.2) + 5} y={cy(0) + 5}
        fontSize={13} fontWeight={600} fill="var(--foreground)">x₁</text>
      <text x={cx(0) + 8} y={cy(Math.max(yIntercept, 1) + 0.2) - 2}
        fontSize={13} fontWeight={600} fill="var(--foreground)">x₂</text>


      {/* 영역 라벨 */}
      <motion.text x={cx(g.label1[0])} y={cy(g.label1[1])} textAnchor="middle"
        fontSize={10} fontWeight={500} fill={C.active}
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.5 }}>출력 1</motion.text>
      <motion.text x={cx(g.label0[0])} y={cy(g.label0[1])} textAnchor="middle"
        fontSize={10} fontWeight={500} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.5 }}>출력 0</motion.text>

      {/* 결정 경계 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={cx(g.eqPos[0])} y={cy(g.eqPos[1])} fontSize={9} fill={C.boundary} fontWeight={500}>결정 경계</text>
        <text x={cx(g.eqPos[0])} y={cy(g.eqPos[1]) + 13} fontSize={9} fill={C.boundary}>{g.equation}</text>
      </motion.g>

      {/* 점 */}
      {g.points.map((p, i) => {
        const x = cx(p.x), y = cy(p.y);
        const color = p.active ? C.active : C.inactive;
        return (
          <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
            <circle cx={x} cy={y} r={16} fill={p.active ? `${color}20` : 'none'}
              stroke={color} strokeWidth={1.5} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={12}
              fontWeight={600} fill={color}>{p.active ? '1' : '0'}</text>
            <text x={x} y={y - 22} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)">({p.x}, {p.y})</text>
          </motion.g>
        );
      })}
    </g>
  );
}
