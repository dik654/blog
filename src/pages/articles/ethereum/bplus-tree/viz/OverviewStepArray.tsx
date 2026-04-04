import { motion } from 'framer-motion';

const C1 = '#6366f1', C4 = '#ef4444';

export default function ArrayStep() {
  const vals = [3, 7, 12, 15, 22, 30, 41];
  return (
    <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={C1}>정렬 배열</text>
      {vals.map((v, i) => (
        <g key={i}>
          <rect x={60 + i * 44} y={30} width={40} height={30} rx={4}
            fill={`${C1}12`} stroke={C1} strokeWidth={0.8} />
          <text x={80 + i * 44} y={50} textAnchor="middle" fontSize={11} fill="var(--foreground)">{v}</text>
        </g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={110} y={85} textAnchor="middle" fontSize={10} fill={C4}>삽입 10</text>
        <text x={110} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          뒤 원소 전부 이동 O(n)
        </text>
        <path d="M148,75 L340,75" stroke={C4} strokeWidth={0.8} strokeDasharray="3,3" markerEnd="url(#arrA)" />
      </motion.g>
      <defs>
        <marker id="arrA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C4} />
        </marker>
      </defs>
    </svg>
  );
}
