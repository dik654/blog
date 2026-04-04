import { motion } from 'framer-motion';

const C = { fp2: '#6366f1', fp6: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Fp6 element structure: a + bv + cv² where a,b,c ∈ Fp² */
export default function Fp6Element() {
  const slots = [
    { label: 'a', sub: '∈ Fp²', delay: 0.3 },
    { label: 'b', sub: '∈ Fp²', delay: 0.5 },
    { label: 'c', sub: '∈ Fp²', delay: 0.7 },
  ];

  return (
    <svg viewBox="0 0 520 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.fp6} {...fade(0)}>Fp⁶ 원소 구조: a + bv + cv²</motion.text>
      <motion.text x={260} y={42} textAnchor="middle" fontSize={10} fill={C.m} {...fade(0.15)}>
        규칙: v³ = ξ = u+1 (v³ − (u+1) = 0의 근)
      </motion.text>

      {/* 3 Fp² blocks */}
      {slots.map((s, i) => (
        <motion.g key={i} {...fade(s.delay)}>
          <rect x={50 + i * 155} y={58} width={130} height={50} rx={6}
            fill={`${C.fp2}12`} stroke={`${C.fp2}40`} strokeWidth={0.7} />
          <text x={115 + i * 155} y={78} textAnchor="middle"
            fontSize={12} fontWeight={600} fill={C.fp2}>{s.label}</text>
          <text x={115 + i * 155} y={98} textAnchor="middle"
            fontSize={9} fill={C.m}>{s.sub}</text>
          {/* Inner 2 Fp slots */}
          <rect x={60 + i * 155} y={68} width={24} height={14} rx={2}
            fill={`${C.fp2}20`} stroke={`${C.fp2}30`} strokeWidth={0.4} opacity={0.6} />
          <rect x={88 + i * 155} y={68} width={24} height={14} rx={2}
            fill={`${C.fp2}20`} stroke={`${C.fp2}30`} strokeWidth={0.4} opacity={0.6} />
          {/* v power label */}
          {i > 0 && (
            <text x={115 + i * 155} y={122} textAnchor="middle"
              fontSize={10} fill={C.fp6}>× v{i > 1 ? '²' : ''}</text>
          )}
        </motion.g>
      ))}

      {/* + signs */}
      <motion.text x={190} y={86} fontSize={14} fill={C.m} {...fade(0.5)}>+</motion.text>
      <motion.text x={345} y={86} fontSize={14} fill={C.m} {...fade(0.7)}>+</motion.text>

      {/* Dimension summary */}
      <motion.g {...fade(1.0)}>
        <rect x={50} y={140} width={420} height={28} rx={5}
          fill={`${C.fp6}10`} stroke={`${C.fp6}25`} strokeWidth={0.6} />
        <text x={260} y={158} textAnchor="middle" fontSize={10} fill={C.fp6}>
          Fp² 원소 3개 = Fp 원소 6개. 곱셈: Karatsuba로 Fp² 곱 6번 → Fp 곱 18번
        </text>
      </motion.g>

      {/* Connection to tower */}
      <motion.g {...fade(1.3)}>
        <text x={260} y={192} textAnchor="middle" fontSize={10} fill={C.m}>
          각 Fp² 곱셈이 내부적으로 Fp 곱셈 3번 (Karatsuba) → 재귀적 구조
        </text>
      </motion.g>
    </svg>
  );
}
