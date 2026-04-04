import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { sky: '#6366f1', green: '#10b981', amber: '#f59e0b' };

interface Props { step: number }

/** Step 0: Fp2 concrete example */
export function Fp2Example({ step }: Props) {
  return (
    <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }} transition={sp}>
      <text x={260} y={30} textAnchor="middle" fontSize={12}
        fill="var(--foreground)" fontWeight={700}>F7-squared 위의 Frobenius</text>
      <rect x={60} y={50} width={120} height={36} rx={5}
        fill={`${C.sky}15`} stroke={C.sky} strokeWidth={1} />
      <text x={120} y={64} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">원소</text>
      <text x={120} y={78} textAnchor="middle" fontSize={12} fill={C.sky} fontWeight={600}>
        (3, 5) = 3 + 5u</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 0 ? 0.7 : 0 }} transition={sp}>
        <line x1={190} y1={68} x2={260} y2={68}
          stroke="var(--muted-foreground)" strokeWidth={0.8} />
        <polygon points="258,64 266,68 258,72" fill="var(--muted-foreground)" />
        <text x={225} y={60} textAnchor="middle" fontSize={10} fill={C.amber} fontWeight={500}>Frob</text>
      </motion.g>
      <rect x={270} y={50} width={140} height={36} rx={5}
        fill={`${C.green}15`} stroke={C.green} strokeWidth={1} />
      <text x={340} y={64} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">결과</text>
      <text x={340} y={78} textAnchor="middle" fontSize={12} fill={C.green} fontWeight={600}>
        (3, 2) = 3 + 2u</text>
      <text x={260} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        5u -&gt; -5u = 2u (mod 7). u^7 = -u 이므로 부호 반전</text>
    </motion.g>
  );
}

/** Step 1: Generalized Fp2 rule */
export function Fp2Generalized({ step }: Props) {
  return (
    <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }} transition={sp}>
      <rect x={80} y={130} width={360} height={50} rx={6}
        fill={`${C.sky}10`} stroke={C.sky} strokeWidth={0.8} />
      <text x={260} y={150} textAnchor="middle" fontSize={12}
        fill={C.sky} fontWeight={600}>
        일반화: (a, b) -&gt; (a, -b mod p)
      </text>
      <text x={260} y={168} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        Fp2 Frobenius = 두 번째 계수 부호 반전 (conjugate)
      </text>
    </motion.g>
  );
}

/** Step 2: Extension to Fp12 slots */
export function Fp12Extension({ step }: Props) {
  const colors = (i: number) => i < 6 ? C.sky : C.amber;
  return (
    <motion.g animate={{ opacity: step === 2 ? 1 : 0.15 }} transition={sp}>
      <text x={260} y={210} textAnchor="middle" fontSize={11}
        fill="var(--foreground)" fontWeight={600}>
        Fp12: 하위 6개 유지 / 상위 6개에 gamma 곱
      </text>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 50 + i * 36;
        const c = colors(i);
        const isLower = i < 6;
        return (
          <motion.g key={i} initial={{ scale: 0 }}
            animate={{ scale: step === 2 ? 1 : 0 }}
            transition={{ ...sp, delay: i * 0.03 }}>
            <rect x={x} y={224} width={30} height={26} rx={3}
              fill={`${c}18`} stroke={c} strokeWidth={0.8} />
            <text x={x + 15} y={241} textAnchor="middle"
              fontSize={10} fill={c} fontWeight={500}>
              {isLower ? `c${i}` : `c${i}\u00B7\u03B3`}
            </text>
          </motion.g>
        );
      })}
      <text x={155} y={268} textAnchor="middle" fontSize={10} fill={C.sky}>
        Fp6 부분 (유지)
      </text>
      <text x={375} y={268} textAnchor="middle" fontSize={10} fill={C.amber}>
        Fp6*w 부분 (gamma 곱)
      </text>
    </motion.g>
  );
}
