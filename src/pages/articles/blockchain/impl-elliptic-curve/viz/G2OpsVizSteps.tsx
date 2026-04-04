import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './G2OpsVizData';

export function TwistMotivationStep() {
  return (
    <g>
      <VizBox x={15} y={15} w={130} h={44} label="E(Fp12)" sub="12차원 → 느림" c={CV} />
      <motion.path d="M 145 37 L 185 37" stroke={CA} strokeWidth={1.5}
        markerEnd="url(#g2Arr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
      <motion.text x={165} y={27} textAnchor="middle" fontSize={7} fill={CA} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        twist
      </motion.text>
      <VizBox x={190} y={15} w={130} h={44} label="E'(Fp2)" sub="2차원 → 빠름" c={CE} delay={0.4} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <rect x={340} y={8} width={95} height={55} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={387} y={28} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>~36x</text>
        <text x={387} y={42} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Fp12 곱셈</text>
        <text x={387} y={54} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">vs Fp2 곱셈</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <text x={220} y={90} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          Fp12 곱셈 = Fp 곱셈 ~144회 | Fp2 곱셈 = Fp 곱셈 3회 (Karatsuba)
        </text>
      </motion.g>
      <defs>
        <marker id="g2Arr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function TwistParamStep() {
  return (
    <g>
      <VizBox x={15} y={15} w={120} h={40} label="y² = x³ + 3" sub="원본 (b=3)" c={CV} />
      <motion.path d="M 135 35 L 175 35" stroke={CA} strokeWidth={1}
        markerEnd="url(#g2Arr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
      <VizBox x={180} y={15} w={140} h={40} label="y² = x³ + b'"
        sub="b' = 3/(9+u)" c={CE} delay={0.3} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={340} y={10} width={95} height={50} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={387} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>
          ξ = 9 + u
        </text>
        <text x={387} y={44} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Fp6 non-residue
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={15} y={75} width={420} height={28} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={225} y={93} textAnchor="middle" fontSize={8} fill={CE} fontWeight={600}>
          twist_b() = Fp2::from(3) * Fp2(9,1).inv() — 런타임 1회 계산
        </text>
      </motion.g>
    </g>
  );
}
