import { motion } from 'framer-motion';
import { C } from './MVCCVizData';

export function Step2() {
  return (
    <g>
      <text x={20} y={28} fontSize={10} fontWeight={600}
        fill={C.writer}>Single Writer Lock</text>
      <rect x={140} y={40} width={100} height={34} rx={5}
        fill={`${C.writer}14`} stroke={C.writer} strokeWidth={1.4} />
      <text x={190} y={62} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={C.writer}>Write Mutex</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x={30} y={100} width={110} height={28} rx={4}
          fill={`${C.writer}14`} stroke={C.writer}
          strokeWidth={1} />
        <text x={85} y={118} textAnchor="middle" fontSize={10}
          fill={C.writer}>Writer A (활성)</text>
        <line x1={85} y1={100} x2={160} y2={74}
          stroke={C.writer} strokeWidth={0.8} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
        transition={{ delay: 0.3 }}>
        <rect x={220} y={100} width={110} height={28} rx={4}
          fill={`${C.dim}10`} stroke={C.dim} strokeWidth={1}
          strokeDasharray="4 3" />
        <text x={275} y={118} textAnchor="middle" fontSize={10}
          fill={C.dim}>Writer B (대기)</text>
        <line x1={275} y1={100} x2={220} y2={74}
          stroke={C.dim} strokeWidth={0.6} strokeDasharray="3 3" />
      </motion.g>
      <text x={190} y={160} textAnchor="middle" fontSize={10}
        fill={C.dim}>WAL 불필요 — 단일 쓰기 직렬화</text>
    </g>
  );
}
