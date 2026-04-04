import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', tw: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Step3 bottom: G1 vs G2 comparison + efficiency */
export default function Step3G2Bottom({ delay = 0 }: { delay?: number }) {
  return (
    <g>
      <motion.g {...fade(delay)}>
        <rect x={20} y={354} width={240} height={58} rx={6}
          fill={`${C.g1}10`} stroke={`${C.g1}25`} strokeWidth={0.6} />
        <text x={140} y={374} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.g1}>
          G1 (E 위, Fp 좌표)
        </text>
        <text x={140} y={396} textAnchor="middle" fontSize={11} fill={C.m}>
          점 = 정수 2개
        </text>
      </motion.g>

      <motion.g {...fade(delay + 0.2)}>
        <rect x={280} y={354} width={240} height={58} rx={6}
          fill={`${C.g2}10`} stroke={`${C.g2}25`} strokeWidth={0.6} />
        <text x={400} y={374} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.g2}>
          G2 (E' 위, Fp² 좌표)
        </text>
        <text x={400} y={396} textAnchor="middle" fontSize={11} fill={C.m}>
          점 = (a+bu) 2개 = 정수 4개
        </text>
      </motion.g>

      <motion.text x={270} y={426} textAnchor="middle" fontSize={11} fill={C.tw} {...fade(delay + 0.4)}>
        서로 다른 곡선, 서로 다른 좌표 공간 → 독립적인 두 군으로 페어링 가능
      </motion.text>
    </g>
  );
}
