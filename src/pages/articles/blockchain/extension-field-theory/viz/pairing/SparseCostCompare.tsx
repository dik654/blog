import { motion } from 'framer-motion';

const C = { sp: '#6366f1', full: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Cost comparison: full vs sparse multiplication */
export default function SparseCostCompare({ baseDelay = 0 }: { baseDelay?: number }) {
  return (
    <g>
      <motion.g {...fade(baseDelay)}>
        <rect x={30} y={236} width={210} height={44} rx={5}
          fill={`${C.full}08`} stroke={`${C.full}20`} strokeWidth={0.5} />
        <text x={135} y={254} textAnchor="middle" fontSize={10} fontWeight={500}
          fill={C.full}>full 곱셈: 12×12 = 144</text>
        <text x={135} y={272} textAnchor="middle" fontSize={9} fill={C.m}>
          Fp 곱 54번 (Karatsuba)
        </text>
      </motion.g>
      <motion.g {...fade(baseDelay + 0.2)}>
        <rect x={270} y={236} width={220} height={44} rx={5}
          fill={`${C.sp}12`} stroke={`${C.sp}30`} strokeWidth={0.7} />
        <text x={380} y={254} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={C.sp}>sparse 곱셈: 12×3 = 36</text>
        <text x={380} y={272} textAnchor="middle" fontSize={9} fill={C.sp}>
          Fp 곱 ~18번 — 비용 1/3!
        </text>
      </motion.g>
    </g>
  );
}
