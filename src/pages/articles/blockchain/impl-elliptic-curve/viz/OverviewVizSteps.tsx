import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function CurveParamStep() {
  return (
    <g>
      <VizBox x={20} y={15} w={150} h={44} label="y² = x³ + 3" sub="BN254 (a=0, b=3)" c={CV} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={200} y={15} width={220} height={44} rx={5}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={310} y={33} textAnchor="middle" fontSize={9} fontWeight={600} fill={CE}>
          G = (1, 2)
        </text>
        <text x={310} y={47} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          2² = 1³ + 3 = 4 ✓
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={20} y={78} width={400} height={32} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={220} y={98} textAnchor="middle" fontSize={8} fill={CA} fontWeight={600}>
          a=0 → 더블링에서 +aZ⁴ 항 제거 → 곱셈 1회 절약
        </text>
      </motion.g>
    </g>
  );
}

export function AffineVsJacobianStep() {
  return (
    <g>
      <VizBox x={15} y={20} w={140} h={44} label="Affine (x, y)" sub="inv() 매번 호출" c={CV} />
      <motion.text x={170} y={46} fontSize={12} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        vs
      </motion.text>
      <VizBox x={195} y={20} w={190} h={44} label="Jacobian (X, Y, Z)"
        sub="곱셈만 — inv() 불필요" c={CE} delay={0.3} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={15} y={82} width={370} height={28} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={200} y={100} textAnchor="middle" fontSize={8} fill={CA} fontWeight={600}>
          affine (x, y) = (X/Z², Y/Z³) — Z 나누기를 최종 1회로 미룸
        </text>
      </motion.g>
    </g>
  );
}
