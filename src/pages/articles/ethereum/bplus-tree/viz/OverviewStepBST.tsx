import { motion } from 'framer-motion';

const C3 = '#f59e0b', C4 = '#ef4444';

const nodes: [number, number][] = [[210, 35], [140, 70], [280, 70], [105, 105], [175, 105], [315, 105]];
const labels = ['15', '7', '22', '3', '12', '30'];
const edges: [number, number, number, number][] = [
  [210, 35, 140, 70], [210, 35, 280, 70],
  [140, 70, 105, 105], [140, 70, 175, 105], [280, 70, 315, 105],
];

export default function BSTStep() {
  return (
    <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={210} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C3}>BST</text>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={14} fill={`${C3}12`} stroke={C3} strokeWidth={0.8} />
          <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fill="var(--foreground)">{labels[i]}</text>
        </g>
      ))}
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1 + 14} x2={x2} y2={y2 - 14} stroke="var(--border)" strokeWidth={0.7} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={210} y={135} textAnchor="middle" fontSize={10} fill={C4}>
          노드마다 1번 I/O, 높이 = log₂n
        </text>
      </motion.g>
    </svg>
  );
}
