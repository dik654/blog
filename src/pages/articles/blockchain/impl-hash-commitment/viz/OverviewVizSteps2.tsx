import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function SpongeStep() {
  const slots = [
    { label: '0', sub: 'capacity', c: '#94a3b8', x: 100 },
    { label: 'left', sub: 'rate₀', c: CV, x: 200 },
    { label: 'right', sub: 'rate₁', c: CE, x: 300 },
  ];
  return (
    <g>
      <motion.text x={220} y={22} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        state = [capacity, rate₀, rate₁]
      </motion.text>
      {slots.map((s, i) => (
        <VizBox key={i} x={s.x} y={32} w={80} h={40} label={s.label} sub={s.sub} c={s.c} delay={i * 0.15} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={80} y={88} width={280} height={30} rx={5}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={220} y={107} textAnchor="middle" fontSize={9} fontWeight={600} fill={CA}>Permutation (65 rounds)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={180} y={132} width={120} height={24} rx={4}
          fill={`${CV}15`} stroke={CV} strokeWidth={1} />
        <text x={240} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={CV}>state[1] = hash</text>
      </motion.g>
      <motion.line x1={220} y1={118} x2={240} y2={132} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    </g>
  );
}

export function FullPipelineStep() {
  const boxes = [
    { label: 'Poseidon Hash', sub: 'H(a, b)', c: CV, x: 20 },
    { label: 'Merkle Tree', sub: 'parent = H(L, R)', c: CE, x: 140 },
    { label: 'Commitment', sub: 'C = H(v, r)', c: CA, x: 260 },
  ];
  return (
    <g>
      {boxes.map((b, i) => (
        <VizBox key={i} x={b.x} y={25} w={105} h={45} label={b.label} sub={b.sub} c={b.c} delay={i * 0.15} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={125} y1={48} x2={140} y2={48} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#pArr)" />
        <line x1={245} y1={48} x2={260} y2={48} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#pArr)" />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={90} width={310} height={45} rx={5}
          fill={`${CV}08`} stroke={CV} strokeWidth={1} strokeDasharray="4 2" />
        <text x={215} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={CV}>R1CS Circuit</text>
        <text x={215} y={122} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          전부 회로로 → Groth16/PLONK 증명 가능
        </text>
      </motion.g>
      <defs>
        <marker id="pArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}
