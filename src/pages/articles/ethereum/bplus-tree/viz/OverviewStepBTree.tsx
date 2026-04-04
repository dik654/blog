import { motion } from 'framer-motion';

const C2 = '#10b981', C4 = '#ef4444';

const children = [
  { x: 55, lbl: '3,7' }, { x: 155, lbl: '12,15' },
  { x: 255, lbl: '22,25' }, { x: 340, lbl: '35,41' },
];

export default function BTreeStep() {
  return (
    <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={210} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C4}>B-tree</text>
      <rect x={140} y={28} width={140} height={28} rx={5} fill={`${C4}10`} stroke={C4} strokeWidth={1} />
      <text x={210} y={46} textAnchor="middle" fontSize={10} fill="var(--foreground)">10 | 20 | 30</text>
      {children.map((c, i) => (
        <g key={i}>
          <line x1={140 + i * 45} y1={56} x2={c.x + 25} y2={72}
            stroke="var(--border)" strokeWidth={0.7} />
          <rect x={c.x} y={72} width={50} height={24} rx={4}
            fill={`${C4}08`} stroke={C4} strokeWidth={0.6} />
          <text x={c.x + 25} y={88} textAnchor="middle" fontSize={9}
            fill="var(--foreground)">{c.lbl}</text>
        </g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={210} y={118} textAnchor="middle" fontSize={10} fill={C2}>
          한 노드 = 한 페이지(4KB), 높이 3~4
        </text>
      </motion.g>
    </svg>
  );
}
