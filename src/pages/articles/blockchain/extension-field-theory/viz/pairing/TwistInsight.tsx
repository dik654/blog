import { motion } from 'framer-motion';

const C = { g2: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Reusable: why twist works + efficiency */
export default function TwistInsight({ delay = 0 }: { delay?: number }) {
  return (
    <motion.g {...fade(delay)}>
      <rect x={220} y={254} width={300} height={84} rx={6}
        fill={`${C.g2}10`} stroke={`${C.g2}30`} strokeWidth={0.6} />
      <text x={232} y={276} fontSize={12} fontWeight={600} fill={C.g2}>왜 이것이 작동하는가</text>
      <text x={232} y={296} fontSize={11} fill={C.m}>
        3/ξ는 Fp에 없다 → Fp 위에서 이 곡선은 성립 불가
      </text>
      <text x={232} y={314} fontSize={11} fill={C.m}>
        Fp²로 올라가야 점이 존재 → G1과 다른 공간에 산다
      </text>
      <text x={232} y={332} fontSize={11} fill={C.g2}>
        서로 다른 군 확보 + Fp¹² 대신 Fp² 연산 → 6배 효율
      </text>
    </motion.g>
  );
}
