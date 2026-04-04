import { motion } from 'framer-motion';
import { C, XOR_POINTS } from '../XORVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const M = 80, S = 180;
const cx = (v: number) => M + v * S;
const cy = (v: number) => M + (1 - v) * S;

const clip = (id: string) => (
  <defs><clipPath id={id}>
    <rect x={cx(-0.15)} y={cy(1.35)} width={cx(1.35) - cx(-0.15)} height={cy(-0.15) - cy(1.35)} />
  </clipPath></defs>
);

function Axes() {
  return (
    <g>
      <line x1={cx(-0.15)} y1={cy(0)} x2={cx(1.2)} y2={cy(0)} stroke="var(--border)" strokeWidth={0.5} />
      <line x1={cx(0)} y1={cy(-0.15)} x2={cx(0)} y2={cy(1.2)} stroke="var(--border)" strokeWidth={0.5} />
      <text x={cx(1.2) + 5} y={cy(0) + 5} fontSize={13} fontWeight={600} fill="var(--foreground)">x₁</text>
      <text x={cx(0) + 8} y={cy(1.2) - 2} fontSize={13} fontWeight={600} fill="var(--foreground)">x₂</text>
    </g>
  );
}

function Pts() {
  return (
    <g>{XOR_POINTS.map((p, i) => {
      const x = cx(p.x), y = cy(p.y);
      const color = p.val ? C.on : C.off;
      return (
        <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
          <circle cx={x} cy={y} r={16} fill={p.val ? `${color}20` : 'none'} stroke={color} strokeWidth={1.5} />
          <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fontWeight={600} fill={color}>{p.val}</text>
          <text x={x} y={y - 22} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">({p.x}, {p.y})</text>
        </motion.g>
      );
    })}</g>
  );
}

export function Step0() {
  return <g><Axes /><Pts /></g>;
}

export function Step1() {
  return (
    <g>
      <Axes /><Pts />
      {/* 분리 불가 배지 */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={cx(0.5) - 56} y={cy(0.5) - 15} width={112} height={30} rx={15}
          fill={`${C.off}14`} stroke={C.off} strokeWidth={1.2} />
        <text x={cx(0.5)} y={cy(0.5) + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.off}>
          선형 분리 불가
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const l1 = (x: number) => 0.4 - x;   // OR 경계
  const l2 = (x: number) => 1.4 - x;   // NAND 경계
  return (
    <g>
      {clip('xc2')}<Axes />
      {/* 활성 영역 (두 선 사이 띠) */}
      <motion.polygon clipPath="url(#xc2)"
        points={`${cx(-0.5)},${cy(l2(-0.5))} ${cx(1.5)},${cy(l2(1.5))} ${cx(1.5)},${cy(l1(1.5))} ${cx(-0.5)},${cy(l1(-0.5))}`}
        fill={`${C.on}10`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }} />
      <motion.line clipPath="url(#xc2)" x1={cx(-0.5)} y1={cy(l1(-0.5))} x2={cx(1.5)} y2={cy(l1(1.5))}
        stroke={C.line} strokeWidth={1.5} opacity={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
      <motion.line clipPath="url(#xc2)" x1={cx(-0.5)} y1={cy(l2(-0.5))} x2={cx(1.5)} y2={cy(l2(1.5))}
        stroke={C.line2} strokeWidth={1.5} opacity={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
      <Pts />
      {/* 결정 경계 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={cx(0.15)} y={cy(l1(0.15)) + 14} fontSize={9} fill={C.line} fontWeight={500}>h₁ (OR)</text>
        <text x={cx(0.15)} y={cy(l2(0.15)) - 6} fontSize={9} fill={C.line2} fontWeight={500}>h₂ (NAND)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={cx(0.27)} y={cy(0.57)} width={90} height={22} rx={4} fill={`${C.on}18`} stroke={C.on} strokeWidth={1} />
        <text x={cx(0.27) + 45} y={cy(0.57) + 15} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.on}>다층으로 해결!</text>
      </motion.g>
    </g>
  );
}
