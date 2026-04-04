import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function DualReprStep() {
  const arrow = (x1: number, y1: number, x2: number, y2: number, d: number) => (
    <motion.path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={CA} strokeWidth={1}
      markerEnd="url(#oArr)" initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }} transition={{ delay: d, duration: 0.3 }} />
  );
  return (
    <g>
      <VizBox x={15} y={15} w={130} h={40} label="G1Affine" sub="(x, y, infinity)" c={CV} />
      {arrow(145, 35, 175, 35, 0.2)}
      <VizBox x={180} y={15} w={130} h={40} label="G1" sub="(x, y, z) Jacobian" c={CE} delay={0.3} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={80} y={80} textAnchor="middle" fontSize={7.5} fill={CV}>to_projective()</text>
        <text x={80} y={92} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Z = 1 설정</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={245} y={80} textAnchor="middle" fontSize={7.5} fill={CE}>to_affine()</text>
        <text x={245} y={92} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          X/Z², Y/Z³ (inv 1회)
        </text>
      </motion.g>
      <VizBox x={330} y={35} w={90} h={30} label="저장/직렬화" sub="Affine 사용" c={CA} delay={0.7} />
      <defs>
        <marker id="oArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function OnCurveStep() {
  return (
    <g>
      <VizBox x={15} y={20} w={175} h={40} label="Affine 검증"
        sub="y² == x³ + 3" c={CV} />
      <VizBox x={220} y={20} w={200} h={40} label="Jacobian 검증"
        sub="Y² == X³ + 3·Z⁶" c={CE} delay={0.2} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={15} y={80} width={405} height={28} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={217} y={98} textAnchor="middle" fontSize={8} fill={CA} fontWeight={600}>
          infinity=true 또는 Z=0 → 무한원점 → 항상 커브 위
        </text>
      </motion.g>
    </g>
  );
}
