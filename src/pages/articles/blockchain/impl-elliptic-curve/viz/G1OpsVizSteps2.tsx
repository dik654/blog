import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './G1OpsVizData';

export function ScalarMulStep() {
  const bits = [1, 0, 1, 1, 0, 0, 1, 0];
  return (
    <g>
      <text x={20} y={14} fontSize={8} fill="var(--muted-foreground)">k의 비트 (LSB → MSB)</text>
      {bits.map((b, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <rect x={20 + i * 50} y={22} width={40} height={24} rx={3}
            fill={b ? `${CE}15` : `${CV}08`}
            stroke={b ? CE : CV} strokeWidth={0.8} />
          <text x={40 + i * 50} y={37} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={b ? CE : CV}>{b}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={20} y={68} fontSize={7.5} fill={CE} fontWeight={600}>bit=1: result += base</text>
        <text x={20} y={82} fontSize={7.5} fill={CV}>매번: base = 2·base</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={220} y={60} width={200} height={40} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={320} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>
          256 double + ~128 add
        </text>
        <text x={320} y={92} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          모두 Jacobian → inv() 0회
        </text>
      </motion.g>
    </g>
  );
}

export function ToAffineStep() {
  return (
    <g>
      <VizBox x={15} y={20} w={110} h={44} label="G1 (Jacobian)"
        sub="(X, Y, Z)" c={CV} />
      <motion.path d="M 125 42 L 165 42" stroke={CA} strokeWidth={1}
        markerEnd="url(#gArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={170} y={15} width={120} height={55} rx={5}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={230} y={34} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>
          z_inv = Z.inv()
        </text>
        <text x={230} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          z_inv2 = z_inv²
        </text>
        <text x={230} y={60} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          z_inv3 = z_inv2·z_inv
        </text>
      </motion.g>
      <motion.path d="M 290 42 L 325 42" stroke={CA} strokeWidth={1}
        markerEnd="url(#gArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
      <VizBox x={330} y={20} w={100} h={44} label="G1Affine"
        sub="(X/Z², Y/Z³)" c={CE} delay={0.6} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={15} y={85} width={415} height={24} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={222} y={100} textAnchor="middle" fontSize={8} fill={CE} fontWeight={600}>
          전체 scalar_mul 동안 유일한 inv() 호출 — Fermat p-2승
        </text>
      </motion.g>
      <defs>
        <marker id="gArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
