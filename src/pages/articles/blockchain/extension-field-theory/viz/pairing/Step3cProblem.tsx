import { motion } from 'framer-motion';

const C = { g2: '#10b981', big: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Step 3c: Using G2 directly requires Fp12 — too expensive */
export default function Step3cProblem() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.big} {...fade(0)}>③ 문제: G2 후보를 직접 쓰면?</motion.text>

      {/* G2 point representation */}
      <motion.g {...fade(0.3)}>
        <text x={40} y={56} fontSize={12} fill={C.m}>G2 후보 점의 좌표 하나 =</text>
        <text x={260} y={56} fontSize={12} fontWeight={500} fill={C.g2}>a + bu (Fp² 원소)</text>
      </motion.g>

      {/* But in pairing... */}
      <motion.g {...fade(0.7)}>
        <rect x={40} y={70} width={440} height={50} rx={6}
          fill={`${C.big}08`} stroke={`${C.big}25`} strokeWidth={0.6} />
        <text x={260} y={92} textAnchor="middle" fontSize={12} fill={C.m}>
          페어링 계산 과정에서 이 점의 좌표가 Fp¹² 공간으로 확장된다
        </text>
        <text x={260} y={110} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.big}>
          좌표 하나 = Fp 원소 12개. 점 하나 (x,y) = Fp 원소 24개
        </text>
      </motion.g>

      {/* Size comparison: visual blocks */}
      <motion.g {...fade(1.2)}>
        <text x={40} y={146} fontSize={12} fontWeight={500} fill={C.g2}>G1 점:</text>
        {[0, 1].map(i => (
          <rect key={i} x={110 + i * 30} y={132} width={24} height={22} rx={3}
            fill="#6366f120" stroke="#6366f140" strokeWidth={0.5} />
        ))}
        <text x={180} y={148} fontSize={11} fill={C.m}>Fp 원소 2개</text>
      </motion.g>

      <motion.g {...fade(1.5)}>
        <text x={40} y={182} fontSize={12} fontWeight={500} fill={C.big}>G2 점 (직접):</text>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.rect key={i} x={160 + i * 22} y={168} width={18} height={22} rx={3}
            fill={`${C.big}15`} stroke={`${C.big}35`} strokeWidth={0.5}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.15, delay: 1.6 + i * 0.04 }} />
        ))}
      </motion.g>
      <motion.text x={160 + 12 * 22 + 10} y={184} fontSize={11} fill={C.big} {...fade(2.1)}>
        ×2 = 24개!
      </motion.text>

      {/* Bottom: this is 12x more expensive */}
      <motion.g {...fade(2.4)}>
        <rect x={40} y={204} width={440} height={28} rx={5}
          fill={`${C.big}10`} stroke={`${C.big}25`} strokeWidth={0.5} />
        <text x={260} y={222} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.big}>
          G1 대비 12배 비싼 연산 — 실용적이지 않다
        </text>
      </motion.g>
    </svg>
  );
}
