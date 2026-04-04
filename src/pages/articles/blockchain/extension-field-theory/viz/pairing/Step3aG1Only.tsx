import { motion } from 'framer-motion';

const C = { g1: '#6366f1', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

const pts = [[2, 3], [4, 1], [5, 2], [6, 5], [3, 4], [1, 6], [5, 5]];

/** Step 3a: E(Fp) only has G1 */
export default function Step3aG1Only() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.g1} {...fade(0)}>① 현재: Fp 위 곡선에는 G1만 존재</motion.text>

      {/* Curve box with scatter points */}
      <motion.g {...fade(0.3)}>
        <rect x={80} y={42} width={360} height={140} rx={6}
          fill={`${C.g1}06`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <text x={100} y={64} fontSize={13} fontWeight={500} fill={C.g1}>곡선 E: y² = x³ + 3</text>
        <text x={100} y={82} fontSize={11} fill={C.m}>좌표 (x, y) — 각각 Fp 원소 (정수 하나)</text>
      </motion.g>

      {/* Points appearing one by one */}
      {pts.map(([x, y], i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.6 + i * 0.08 }}>
          <circle cx={120 + x * 36} cy={90 + y * 12} r={6} fill={C.g1} />
        </motion.g>
      ))}

      <motion.text x={260} y={178} textAnchor="middle" fontSize={12} fontWeight={600}
        fill={C.g1} {...fade(1.2)}>
        이 점들 = G1 (위수 r ≈ 10⁷⁶)
      </motion.text>

      {/* Problem */}
      <motion.g {...fade(1.5)}>
        <rect x={80} y={194} width={360} height={32} rx={5}
          fill="#ef444410" stroke="#ef444430" strokeWidth={0.6} />
        <text x={260} y={215} textAnchor="middle" fontSize={12} fill="#ef4444">
          페어링에는 두 번째 군 G2가 필요한데, Fp 위에는 G1 하나뿐
        </text>
      </motion.g>
    </svg>
  );
}
