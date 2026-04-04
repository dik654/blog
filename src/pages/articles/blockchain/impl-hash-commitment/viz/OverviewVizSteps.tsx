import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function ShaVsPoseidonStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={160} h={50} label="SHA-256" sub="AND, XOR, ROTATE" c="#ef4444" />
      <VizBox x={20} y={85} w={160} h={50} label="Poseidon" sub="add, mul, x⁵ (체 산술)" c={CE} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={220} y={20} width={180} height={50} rx={5}
          fill="#ef444410" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" />
        <text x={310} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">~25,000 R1CS</text>
        <text x={310} y={55} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">비트 연산 → 제약 폭발</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={220} y={85} width={180} height={50} rx={5}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={310} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill={CE}>~250 R1CS</text>
        <text x={310} y={120} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">체 산술 = R1CS 자연 표현</text>
      </motion.g>
      <motion.text x={310} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        100배 차이 → ZK 증명 시간 좌우
      </motion.text>
    </g>
  );
}

export function RoundStructureStep() {
  const phases = [
    { label: 'Full ×4', sub: 'S-box ALL', c: CV, x: 20, w: 100 },
    { label: 'Partial ×57', sub: 'S-box [0] only', c: CE, x: 145, w: 140 },
    { label: 'Full ×4', sub: 'S-box ALL', c: CV, x: 310, w: 100 },
  ];
  return (
    <g>
      {phases.map((p, i) => (
        <VizBox key={i} x={p.x} y={45} w={p.w} h={50} label={p.label} sub={p.sub} c={p.c} delay={i * 0.2} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <line x1={120} y1={70} x2={145} y2={70} stroke={CA} strokeWidth={1} markerEnd="url(#ovArr)" />
        <line x1={285} y1={70} x2={310} y2={70} stroke={CA} strokeWidth={1} markerEnd="url(#ovArr)" />
      </motion.g>
      <motion.text x={220} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        Full: 혼란 극대화 (양쪽) / Partial: 효율 (중앙 57회)
      </motion.text>
      <defs>
        <marker id="ovArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
