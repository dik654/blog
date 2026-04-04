import { motion } from 'framer-motion';

const C = { a: '#6366f1', b: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Fp2 element structure: a + bu, like complex number */
export default function Fp2Element() {
  return (
    <svg viewBox="0 0 520 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.a} {...fade(0)}>Fp² 원소 구조: a + bu</motion.text>

      {/* Two-slot representation */}
      <motion.g {...fade(0.3)}>
        <rect x={140} y={38} width={100} height={40} rx={6}
          fill={`${C.a}15`} stroke={C.a} strokeWidth={1} />
        <text x={190} y={55} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.a}>a</text>
        <text x={190} y={72} textAnchor="middle" fontSize={9} fill={C.m}>∈ Fp (정수)</text>
      </motion.g>

      <motion.text x={252} y={62} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.m} {...fade(0.4)}>+</motion.text>

      <motion.g {...fade(0.5)}>
        <rect x={270} y={38} width={100} height={40} rx={6}
          fill={`${C.b}15`} stroke={C.b} strokeWidth={1} />
        <text x={320} y={55} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.b}>b</text>
        <text x={320} y={72} textAnchor="middle" fontSize={9} fill={C.m}>∈ Fp (정수)</text>
      </motion.g>

      <motion.text x={382} y={62} textAnchor="middle" fontSize={12} fontWeight={500}
        fill={C.b} {...fade(0.5)}>· u</motion.text>

      {/* Rule box */}
      <motion.g {...fade(0.7)}>
        <rect x={140} y={90} width={240} height={30} rx={5}
          fill={`${C.b}10`} stroke={`${C.b}30`} strokeWidth={0.6} />
        <text x={260} y={109} textAnchor="middle" fontSize={11} fill={C.b}>
          규칙: u² = −1 (u² + 1 = 0의 근)
        </text>
      </motion.g>

      {/* Complex number analogy */}
      <motion.g {...fade(1.0)}>
        <line x1={140} y1={134} x2={380} y2={134} stroke={`${C.m}20`} strokeWidth={0.5} />
        <text x={260} y={152} textAnchor="middle" fontSize={11} fontWeight={500} fill={C.m}>
          복소수와 정확히 같은 구조
        </text>
        <text x={170} y={174} textAnchor="middle" fontSize={10} fill={C.a}>
          ℂ: a + bi (i² = −1)
        </text>
        <text x={350} y={174} textAnchor="middle" fontSize={10} fill={C.b}>
          Fp²: a + bu (u² = −1)
        </text>
        <text x={260} y={196} textAnchor="middle" fontSize={10} fill={C.m}>
          덧셈·곱셈 공식이 동일, 단 모든 계산을 mod p로 수행
        </text>
      </motion.g>
    </svg>
  );
}
