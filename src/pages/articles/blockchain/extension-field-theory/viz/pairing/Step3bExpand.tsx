import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

const g1Pts = [[2, 2], [4, 1], [5, 2], [6, 4], [3, 3]];
const extraPts = [[1, 1], [3, 5], [6, 2], [2, 4], [5, 3], [4, 5]];

/** Step 3b: Expanding coordinates to Fp² reveals more points */
export default function Step3bExpand() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.g2} {...fade(0)}>② 좌표를 Fp²로 넓히면 — 점이 더 많아진다</motion.text>

      {/* Curve box */}
      <motion.g {...fade(0.3)}>
        <rect x={40} y={40} width={440} height={140} rx={6}
          fill={`${C.g2}06`} stroke={`${C.g2}20`} strokeWidth={0.6} />
        <text x={60} y={62} fontSize={12} fontWeight={500} fill={C.m}>
          같은 곡선 E: y² = x³ + 3
        </text>
        <text x={60} y={80} fontSize={11} fill={C.g2}>
          좌표를 정수 → a+bu (Fp² 원소)로 허용
        </text>
      </motion.g>

      {/* G1 points */}
      {g1Pts.map(([x, y], i) => (
        <motion.circle key={`g1-${i}`} cx={80 + x * 40} cy={88 + y * 14} r={5}
          fill={C.g1} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 + i * 0.05 }} />
      ))}

      {/* Extra Fp² points */}
      {extraPts.map(([x, y], i) => (
        <motion.g key={`ex-${i}`} initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1.0 + i * 0.1 }}>
          <circle cx={80 + x * 50 + 30} cy={88 + y * 14} r={5} fill={C.g2} />
        </motion.g>
      ))}

      {/* Legend — below the box */}
      <motion.g {...fade(0.5)}>
        <circle cx={60} cy={200} r={4} fill={C.g1} />
        <text x={72} y={204} fontSize={11} fill={C.g1}>기존 G1 점 (Fp 좌표)</text>
      </motion.g>
      <motion.g {...fade(1.5)}>
        <circle cx={260} cy={200} r={4} fill={C.g2} />
        <text x={272} y={204} fontSize={11} fill={C.g2}>새로 나타난 점 (Fp² 좌표)</text>
      </motion.g>

      {/* Key insight */}
      <motion.g {...fade(2.0)}>
        <rect x={40} y={220} width={440} height={44} rx={5}
          fill={`${C.g2}10`} stroke={`${C.g2}25`} strokeWidth={0.6} />
        <text x={260} y={242} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.g2}>
          새 점들 중 위수 r인 부분군이 하나 더 있다 → G2 후보
        </text>
        <text x={260} y={258} textAnchor="middle" fontSize={11} fill={C.m}>
          G1과 독립적인 군. 하지만 이걸 바로 쓰면 문제가 있다...
        </text>
      </motion.g>
    </svg>
  );
}
