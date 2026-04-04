import { motion } from 'framer-motion';

const C = { fp6: '#f59e0b', fp12: '#ec4899', g1: '#6366f1', g2: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Fp12 element: a + bw, and where G1/G2/GT live */
export default function Fp12Element() {
  return (
    <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.fp12} {...fade(0)}>Fp¹² 원소 구조: a + bw</motion.text>
      <motion.text x={260} y={42} textAnchor="middle" fontSize={10} fill={C.m} {...fade(0.15)}>
        규칙: w² = v (w² − v = 0의 근). a,b ∈ Fp⁶
      </motion.text>

      {/* Two Fp6 blocks */}
      {[
        { label: 'a ∈ Fp⁶', x: 40, slots: 6 },
        { label: 'b ∈ Fp⁶', x: 290, slots: 6 },
      ].map((blk, i) => (
        <motion.g key={i} {...fade(0.3 + i * 0.25)}>
          <rect x={blk.x} y={54} width={190} height={55} rx={6}
            fill={`${C.fp6}10`} stroke={`${C.fp6}35`} strokeWidth={0.7} />
          <text x={blk.x + 95} y={72} textAnchor="middle"
            fontSize={11} fontWeight={600} fill={C.fp6}>{blk.label}</text>
          {/* 6 Fp slots inside */}
          {Array.from({ length: blk.slots }).map((_, j) => (
            <motion.rect key={j} x={blk.x + 10 + j * 28} y={82} width={24} height={18} rx={2}
              fill={`${C.fp6}18`} stroke={`${C.fp6}30`} strokeWidth={0.4}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.5 + i * 0.25 + j * 0.03 }} />
          ))}
        </motion.g>
      ))}

      <motion.text x={242} y={84} fontSize={14} fill={C.m} {...fade(0.5)}>+</motion.text>
      <motion.text x={490} y={84} fontSize={10} fill={C.fp12} {...fade(0.55)}>· w</motion.text>

      {/* Dimension bar */}
      <motion.g {...fade(0.9)}>
        <rect x={40} y={120} width={440} height={24} rx={4}
          fill={`${C.fp12}10`} stroke={`${C.fp12}25`} strokeWidth={0.5} />
        <text x={260} y={136} textAnchor="middle" fontSize={10} fill={C.fp12}>
          Fp 원소 6 + 6 = 12개. 총 2 × 3 × 2 = 12차 확장 완성
        </text>
      </motion.g>

      {/* Where G1, G2, GT live */}
      <motion.g {...fade(1.2)}>
        <text x={260} y={164} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.m}>
          어디에 쓰이나
        </text>
        {[
          { label: 'G1', field: 'Fp', desc: '좌표 = 정수 1개', c: C.g1, x: 40 },
          { label: 'G2', field: 'Fp²', desc: '좌표 = Fp 2개 (a+bu)', c: C.g2, x: 200 },
          { label: 'GT', field: 'Fp¹²', desc: '원소 = Fp 12개', c: C.fp12, x: 360 },
        ].map((g, i) => (
          <motion.g key={i} {...fade(1.4 + i * 0.2)}>
            <rect x={g.x} y={174} width={140} height={44} rx={5}
              fill={`${g.c}10`} stroke={`${g.c}30`} strokeWidth={0.6} />
            <text x={g.x + 70} y={192} textAnchor="middle"
              fontSize={11} fontWeight={600} fill={g.c}>{g.label} — {g.field}</text>
            <text x={g.x + 70} y={208} textAnchor="middle"
              fontSize={9} fill={C.m}>{g.desc}</text>
          </motion.g>
        ))}
      </motion.g>
    </svg>
  );
}
