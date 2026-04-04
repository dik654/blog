import { motion } from 'framer-motion';
import { CV, CE, CA } from './PermVizData';

export function CopyConstraintStep() {
  const cells = [
    { col: 'A', row: 0, val: '3', x: 60, y: 30 },
    { col: 'B', row: 0, val: '4', x: 130, y: 30 },
    { col: 'C', row: 0, val: '7', x: 200, y: 30 },
    { col: 'A', row: 1, val: '7', x: 60, y: 70 },
    { col: 'B', row: 1, val: '2', x: 130, y: 70 },
    { col: 'C', row: 1, val: '14', x: 200, y: 70 },
  ];
  return (
    <g>
      {['A', 'B', 'C'].map((c, i) => (
        <text key={c} x={70 + i * 70} y={18} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="var(--muted-foreground)">{c}</text>
      ))}
      {['Gate 0 (Add)', 'Gate 1 (Mul)'].map((g, i) => (
        <text key={g} x={320} y={44 + i * 40} fontSize={8}
          fill="var(--muted-foreground)">{g}</text>
      ))}
      {cells.map((c, i) => (
        <motion.g key={i} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
          <rect x={c.x - 20} y={c.y} width={40} height={24} rx={3}
            fill={i === 2 || i === 3 ? `${CA}15` : `${CV}08`}
            stroke={i === 2 || i === 3 ? CA : CV} strokeWidth={0.7} />
          <text x={c.x} y={c.y + 15} textAnchor="middle"
            fontSize={9} fill={i === 2 || i === 3 ? CA : CV}>{c.val}</text>
        </motion.g>
      ))}
      <motion.path d="M 200 54 C 240 54 240 70 200 70"
        stroke={CA} strokeWidth={1.5} fill="none" strokeDasharray="4,2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <text x={260} y={65} fontSize={8} fill={CA}>(C,0) = (A,1) = 7</text>
      </motion.g>
    </g>
  );
}

export function UnionFindStep() {
  const nodes = [
    { label: '(A,0)', x: 40, y: 30 }, { label: '(B,0)', x: 120, y: 30 },
    { label: '(C,0)', x: 200, y: 30 }, { label: '(A,1)', x: 280, y: 30 },
    { label: '(B,1)', x: 360, y: 30 }, { label: '(C,1)', x: 200, y: 90 },
  ];
  return (
    <g>
      {nodes.map((n, i) => (
        <motion.g key={i} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
          <rect x={n.x - 26} y={n.y} width={52} height={22} rx={3}
            fill={i === 2 || i === 3 ? `${CA}15` : `${CV}08`}
            stroke={i === 2 || i === 3 ? CA : CV} strokeWidth={0.7} />
          <text x={n.x} y={n.y + 14} textAnchor="middle"
            fontSize={8} fill={i === 2 || i === 3 ? CA : "var(--foreground)"}>{n.label}</text>
        </motion.g>
      ))}
      <motion.path d="M 200 52 L 280 52 L 280 30" stroke={CA} strokeWidth={1.2}
        fill="none" markerEnd="url(#pArr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <text x={220} y={128} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">cycle: (C,0) → (A,1) → (C,0)</text>
      </motion.g>
      <defs>
        <marker id="pArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
