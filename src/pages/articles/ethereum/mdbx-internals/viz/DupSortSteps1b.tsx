import { motion } from 'framer-motion';
import { C } from './DupSortVizData';

export function Step2() {
  const cx = 140;
  return (
    <g>
      <text x={30} y={20} fontSize={11} fontWeight={600}
        fill={C.sub}>Sub-B+tree (leaf 내부)</text>
      {/* Parent leaf node */}
      <rect x={cx - 55} y={32} width={110} height={30} rx={5}
        fill={`${C.key}10`} stroke={C.key} strokeWidth={0.8} />
      <text x={cx} y={52} textAnchor="middle" fontSize={10}
        fill={C.key}>Leaf: addr_A</text>
      <motion.line x1={cx} y1={62} x2={cx} y2={80}
        stroke={C.sub} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }} />
      {/* Sub-root */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <rect x={cx - 40} y={82} width={80} height={26} rx={4}
          fill={`${C.sub}14`} stroke={C.sub} strokeWidth={1} />
        <text x={cx} y={99} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.sub}>sub-root</text>
      </motion.g>
      {/* Sub-leaves */}
      {['slot_0..1', 'slot_2..3'].map((lbl, i) => (
        <motion.g key={lbl} initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.15 }}>
          <line x1={cx - 20 + i * 40} y1={108}
            x2={cx - 55 + i * 110} y2={128}
            stroke={C.sub} strokeWidth={0.7} />
          <rect x={cx - 70 + i * 110} y={128} width={90} height={26} rx={4}
            fill={`${C.val}10`} stroke={C.val} strokeWidth={0.6} />
          <text x={cx - 25 + i * 110} y={146} textAnchor="middle"
            fontSize={10} fill={C.val}>{lbl}</text>
        </motion.g>
      ))}
      {/* Explanation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <rect x={290} y={80} width={100} height={45} rx={5}
          fill={`${C.sub}06`} stroke={C.sub} strokeWidth={0.5}
          strokeDasharray="3 2" />
        <text x={340} y={100} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.sub}>O(log m) 검색</text>
        <text x={340} y={116} textAnchor="middle" fontSize={10}
          fill={C.dim}>m = value 개수</text>
      </motion.g>
    </g>
  );
}
