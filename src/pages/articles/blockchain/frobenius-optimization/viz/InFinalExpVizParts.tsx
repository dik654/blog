import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { sky: '#6366f1', green: '#10b981', amber: '#f59e0b', muted: '#6b7280' };

interface Props { step: number }

/** Step 0: Full exponent decomposition */
export function ExponentFormula({ step }: Props) {
  return (
    <motion.g animate={{ opacity: step === 0 ? 1 : 0.2 }} transition={sp}>
      <text x={260} y={40} textAnchor="middle" fontSize={12}
        fill="var(--foreground)" fontWeight={700}>
        지수 분해
      </text>
      <rect x={40} y={55} width={440} height={32} rx={5}
        fill={`${C.sky}10`} stroke={C.sky} strokeWidth={0.8} />
      <text x={260} y={75} textAnchor="middle" fontSize={11} fill={C.sky} fontWeight={600}>
        (p12-1)/r = (p6-1) * (p2+1) * (p4-p2+1)/r
      </text>
      {/* Labels */}
      <text x={140} y={105} textAnchor="middle" fontSize={10} fill={C.green}>Easy Part 1</text>
      <text x={260} y={105} textAnchor="middle" fontSize={10} fill={C.green}>Easy Part 2</text>
      <text x={400} y={105} textAnchor="middle" fontSize={10} fill={C.amber}>Hard Part</text>
    </motion.g>
  );
}

/** Step 1: Easy Part 1 */
export function EasyPart1({ step }: Props) {
  return (
    <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }} transition={sp}>
      <rect x={40} y={130} width={200} height={70} rx={6}
        fill={`${C.green}10`} stroke={C.green} strokeWidth={1} />
      <text x={140} y={150} textAnchor="middle" fontSize={11}
        fill={C.green} fontWeight={600}>
        Easy Part 1: f^(p6-1)
      </text>
      <text x={140} y={168} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        f^(p6) = Frobenius 6회 = conjugate
      </text>
      <text x={140} y={186} textAnchor="middle" fontSize={10} fill={C.green}>
        비용: conj + inv + mul = Fp12곱 2회
      </text>
    </motion.g>
  );
}

/** Step 2: Easy Part 2 */
export function EasyPart2({ step }: Props) {
  return (
    <motion.g animate={{ opacity: step === 2 ? 1 : 0.15 }} transition={sp}>
      <rect x={260} y={130} width={220} height={70} rx={6}
        fill={`${C.green}10`} stroke={C.green} strokeWidth={1} />
      <text x={370} y={150} textAnchor="middle" fontSize={11}
        fill={C.green} fontWeight={600}>
        Easy Part 2: g^(p2+1)
      </text>
      <text x={370} y={168} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        g^(p2) = Frobenius 2회 (상수 스케일링)
      </text>
      <text x={370} y={186} textAnchor="middle" fontSize={10} fill={C.green}>
        비용: frobenius + mul = Fp12곱 1회
      </text>
    </motion.g>
  );
}

/** Step 3: Hard Part */
export function HardPart({ step }: Props) {
  return (
    <motion.g animate={{ opacity: step === 3 ? 1 : 0.15 }} transition={sp}>
      <rect x={80} y={215} width={360} height={55} rx={6}
        fill={`${C.amber}10`} stroke={C.amber} strokeWidth={1} />
      <text x={260} y={235} textAnchor="middle" fontSize={11}
        fill={C.amber} fontWeight={600}>
        Hard Part: d = c0 + c1*p + c2*p2 + c3*p3
      </text>
      <text x={260} y={253} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        각 p^k = Frobenius k회(무료). 실제 곱셈은 c 계수 체인에서만 발생
      </text>
    </motion.g>
  );
}
