import { motion } from 'framer-motion';

const NODES = [
  { x: 230, y: 30, label: '루트', color: '#6366f1' },
  { x: 120, y: 90, label: '경로 A', color: '#10b981' },
  { x: 230, y: 90, label: '경로 B', color: '#f59e0b' },
  { x: 340, y: 90, label: '경로 C', color: '#10b981' },
  { x: 120, y: 150, label: '평가: 0.3', color: '#10b981' },
  { x: 230, y: 150, label: '평가: 0.8', color: '#f59e0b' },
  { x: 340, y: 150, label: '평가: 0.5', color: '#10b981' },
];

export default function TreeView() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={230} y={20} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="var(--foreground)">Tree-of-Thought</text>
      {/* Edges */}
      <line x1={230} y1={52} x2={120} y2={82} stroke="#6366f1" strokeWidth={0.8} opacity={0.4} />
      <line x1={230} y1={52} x2={230} y2={82} stroke="#6366f1" strokeWidth={0.8} opacity={0.4} />
      <line x1={230} y1={52} x2={340} y2={82} stroke="#6366f1" strokeWidth={0.8} opacity={0.4} />
      <line x1={120} y1={112} x2={120} y2={142} stroke="#10b981" strokeWidth={0.8} opacity={0.4} />
      <line x1={230} y1={112} x2={230} y2={142} stroke="#f59e0b" strokeWidth={0.8} opacity={0.4} />
      <line x1={340} y1={112} x2={340} y2={142} stroke="#10b981" strokeWidth={0.8} opacity={0.4} />
      {/* Nodes */}
      {NODES.map((n, i) => (
        <g key={i}>
          <rect x={n.x - 40} y={n.y} width={80} height={22} rx={4}
            fill={i === 5 ? `${n.color}25` : `${n.color}10`}
            stroke={n.color} strokeWidth={i === 5 ? 2 : 1} />
          <text x={n.x} y={n.y + 15} textAnchor="middle" fontSize={9}
            fontWeight={i === 5 ? 700 : 500} fill={n.color}>{n.label}</text>
        </g>
      ))}
      <text x={230} y={190} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#f59e0b">최선 경로 선택</text>
    </motion.g>
  );
}
