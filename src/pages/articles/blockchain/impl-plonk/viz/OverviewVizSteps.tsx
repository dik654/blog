import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function R1CSvsPlonkStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={170} h={50} label="R1CS" sub="(a*s)(b*s) = (c*s)" c={CV} />
      <VizBox x={250} y={20} w={170} h={50} label="PLONKish"
        sub="q_L*a + q_R*b + q_O*c + q_M*a*b + q_C = 0" c={CE} delay={0.15} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={205} y={50} textAnchor="middle" fontSize={10} fill={CA}>vs</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={50} y={90} width={130} height={24} rx={3} fill={`${CV}08`} stroke={CV} strokeWidth={0.5} />
        <text x={115} y={105} textAnchor="middle" fontSize={8} fill={CV}>곱셈 전용 (행렬 3개)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={260} y={90} width={150} height={24} rx={3} fill={`${CE}08`} stroke={CE} strokeWidth={0.5} />
        <text x={335} y={105} textAnchor="middle" fontSize={8} fill={CE}>범용 게이트 (selector 조합)</text>
      </motion.g>
    </g>
  );
}

export function GateTypesStep() {
  const gates = [
    { label: 'Add', eq: 'a + b = c', sel: 'q_L=1, q_R=1, q_O=-1', c: CV, y: 14 },
    { label: 'Mul', eq: 'a * b = c', sel: 'q_M=1, q_O=-1', c: CE, y: 46 },
    { label: 'Bool', eq: 'a(1-a) = 0', sel: 'q_L=1, q_M=-1', c: CA, y: 78 },
    { label: 'Dummy', eq: '0 = 0', sel: '모두 0', c: '#94a3b8', y: 110 },
  ];
  return (
    <g>
      {gates.map((g, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <rect x={20} y={g.y} width={60} height={24} rx={3}
            fill={`${g.c}15`} stroke={g.c} strokeWidth={0.8} />
          <text x={50} y={g.y + 15} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={g.c}>{g.label}</text>
          <text x={100} y={g.y + 15} fontSize={9} fill="var(--foreground)">{g.eq}</text>
          <text x={240} y={g.y + 15} fontSize={8}
            fill="var(--muted-foreground)">{g.sel}</text>
        </motion.g>
      ))}
    </g>
  );
}
