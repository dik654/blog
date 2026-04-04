import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './MontVizData';

export function REDCStep() {
  const iters = [0, 1, 2, 3];
  return (
    <g>
      <text x={15} y={14} fontSize={8} fill={CV} fontWeight={600}>[u64; 8] 입력</text>
      {iters.map((i) => (
        <motion.g key={i} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}>
          <rect x={15 + i * 100} y={24} width={88} height={44} rx={4}
            fill={`${CE}10`} stroke={CE} strokeWidth={0.8} />
          <text x={59 + i * 100} y={42} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={CE}>반복 {i}</text>
          <text x={59 + i * 100} y={58} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">r[{i}] → 0</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={60} y={84} width={300} height={30} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={210} y={98} textAnchor="middle" fontSize={8}
          fill={CA} fontWeight={600}>m = r[i] * INV → r += m * p → 하위 limb 소멸</text>
        <text x={210} y={110} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">4번 후 → [r4, r5, r6, r7]이 최종 결과</text>
      </motion.g>
    </g>
  );
}

export function InvPowStep() {
  return (
    <g>
      <VizBox x={15} y={20} w={110} h={36} label="square()" sub="a * a (mont_mul)" c={CV} />
      <VizBox x={145} y={20} w={130} h={36} label="pow(exp)" sub="square-and-multiply" c={CE} delay={0.15} />
      <VizBox x={295} y={20} w={120} h={36} label="inv()" sub="a^(p-2) (Fermat)" c={CA} delay={0.3} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={15} y={76} width={400} height={38} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={215} y={93} textAnchor="middle" fontSize={8}
          fill={CA} fontWeight={600}>mont_mul 하나로 세 연산 모두 구현</text>
        <text x={215} y={107} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">
          inv = pow(p-2) = 256번 square + 조건부 mul
        </text>
      </motion.g>
    </g>
  );
}
