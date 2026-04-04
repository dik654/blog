import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './PoseidonVizData';

export function FullPartialStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={180} h={55} label="Full Round"
        sub="ARK → S-box(ALL) → MDS" c={CV} delay={0} />
      <VizBox x={230} y={20} w={180} h={55} label="Partial Round"
        sub="ARK → S-box([0]) → MDS" c={CE} delay={0.2} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        {[0, 1, 2].map((i) => (
          <rect key={`f-${i}`} x={35 + i * 55} y={88} width={40} height={22} rx={3}
            fill={`${CA}15`} stroke={CA} strokeWidth={0.8} />
        ))}
        {[0, 1, 2].map((i) => (
          <text key={`ft-${i}`} x={55 + i * 55} y={103} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={CA}>x⁵</text>
        ))}
        <text x={110} y={125} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          3개 전부 → 제약 9개
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={245} y={88} width={40} height={22} rx={3}
          fill={`${CA}15`} stroke={CA} strokeWidth={0.8} />
        <text x={265} y={103} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>x⁵</text>
        {[1, 2].map((i) => (
          <rect key={`pe-${i}`} x={245 + i * 55} y={88} width={40} height={22} rx={3}
            fill="var(--card)" stroke="#94a3b8" strokeWidth={0.6} strokeDasharray="3 2" />
        ))}
        {[1, 2].map((i) => (
          <text key={`pet-${i}`} x={265 + i * 55} y={103} textAnchor="middle"
            fontSize={8} fill="#94a3b8">skip</text>
        ))}
        <text x={320} y={125} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          1개만 → 제약 3개
        </text>
      </motion.g>
    </g>
  );
}
