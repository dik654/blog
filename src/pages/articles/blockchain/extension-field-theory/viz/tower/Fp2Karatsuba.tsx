import { motion } from 'framer-motion';

const C = { a: '#6366f1', b: '#10b981', k: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Karatsuba trick: 4 muls → 3 muls */
export default function Fp2Karatsuba() {
  const muls = [
    { label: 'M₁ = a·c', c: C.a },
    { label: 'M₂ = b·d', c: C.b },
    { label: 'M₃ = (a+b)·(c+d)', c: C.k },
  ];

  return (
    <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.k} {...fade(0)}>Karatsuba 트릭: 4곱 → 3곱</motion.text>

      {/* 3 multiplications */}
      <motion.text x={30} y={48} fontSize={10} fontWeight={500} fill={C.m} {...fade(0.2)}>
        Fp 곱셈 3번만 계산:
      </motion.text>
      {muls.map((m, i) => (
        <motion.g key={i} {...fade(0.4 + i * 0.25)}>
          <rect x={30 + i * 166} y={56} width={150} height={32} rx={5}
            fill={`${m.c}15`} stroke={`${m.c}40`} strokeWidth={0.7} />
          <text x={30 + i * 166 + 75} y={76} textAnchor="middle"
            fontSize={11} fontWeight={500} fill={m.c}>{m.label}</text>
        </motion.g>
      ))}

      {/* Derivation: real part */}
      <motion.g {...fade(1.2)}>
        <line x1={30} y1={100} x2={490} y2={100} stroke={`${C.m}15`} strokeWidth={0.5} />
        <text x={30} y={120} fontSize={10} fontWeight={500} fill={C.m}>실수부 복원:</text>
        <text x={30} y={142} fontSize={11} fill={C.a}>ac − bd</text>
        <text x={110} y={142} fontSize={11} fill={C.m}>=</text>
        <text x={125} y={142} fontSize={11} fill={C.a}>M₁</text>
        <text x={148} y={142} fontSize={11} fill={C.m}>−</text>
        <text x={163} y={142} fontSize={11} fill={C.b}>M₂</text>
        <text x={210} y={142} fontSize={9} fill={C.m}>← 곱셈 추가 없이 뺄셈만</text>
      </motion.g>

      {/* Derivation: imaginary part */}
      <motion.g {...fade(1.6)}>
        <text x={30} y={170} fontSize={10} fontWeight={500} fill={C.m}>허수부 복원:</text>
        <text x={30} y={192} fontSize={11} fill={C.b}>ad + bc</text>
        <text x={110} y={192} fontSize={11} fill={C.m}>=</text>
        <text x={125} y={192} fontSize={11} fill={C.k}>M₃</text>
        <text x={148} y={192} fontSize={11} fill={C.m}>−</text>
        <text x={163} y={192} fontSize={11} fill={C.a}>M₁</text>
        <text x={186} y={192} fontSize={11} fill={C.m}>−</text>
        <text x={201} y={192} fontSize={11} fill={C.b}>M₂</text>
        <text x={250} y={192} fontSize={9} fill={C.m}>← (a+b)(c+d) − ac − bd = ad+bc</text>
      </motion.g>

      {/* Summary */}
      <motion.g {...fade(2.0)}>
        <rect x={60} y={210} width={400} height={30} rx={5}
          fill={`${C.k}12`} stroke={`${C.k}30`} strokeWidth={0.6} />
        <text x={260} y={230} textAnchor="middle" fontSize={11} fontWeight={500} fill={C.k}>
          Fp 곱셈 3번 + 덧셈/뺄셈 5번 → Fp² 곱셈 1번 완료
        </text>
      </motion.g>
    </svg>
  );
}
