import { motion } from 'framer-motion';
import { C } from './BTreeVizData';

export function Step3() {
  return (
    <g>
      <text x={20} y={28} fontSize={10} fontWeight={600}
        fill={C.overflow}>Overflow Page</text>
      {/* Leaf with pointer */}
      <rect x={20} y={40} width={140} height={36} rx={5}
        fill={`${C.leaf}10`} stroke={C.leaf} strokeWidth={0.8} />
      <text x={40} y={56} fontSize={9} fill={C.leaf}>Leaf</text>
      <rect x={70} y={46} width={80} height={22} rx={3}
        fill={`${C.overflow}10`} stroke={C.overflow} strokeWidth={0.6} />
      <text x={110} y={61} textAnchor="middle" fontSize={8}
        fill={C.overflow}>ptr → ovfl pg</text>
      {/* Arrow */}
      <motion.line x1={160} y1={58} x2={200} y2={58}
        stroke={C.overflow} strokeWidth={1} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }} />
      {/* Overflow pages */}
      {[0, 1].map(i => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.2 }}>
          <rect x={210} y={40 + i * 44} width={140} height={36}
            rx={5} fill={`${C.overflow}12`} stroke={C.overflow}
            strokeWidth={1} />
          <text x={280} y={62 + i * 44} textAnchor="middle"
            fontSize={10} fill={C.overflow}>
            Overflow #{i + 1}
          </text>
        </motion.g>
      ))}
      <text x={20} y={150} fontSize={10} fill="var(--muted-foreground)">
        4KB 초과 value → 연속 Overflow 페이지에 저장
      </text>
    </g>
  );
}

export function Step4() {
  const nodes = [
    { label: 'Root', x: 175, y: 20, c: C.internal },
    { label: '0x3F..7B', x: 105, y: 80, c: C.internal },
    { label: '0x5A..5F', x: 105, y: 140, c: C.leaf },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={10} fontWeight={600}
        fill={C.path}>key = 0x5C 검색</text>
      {nodes.map((n, i) => (
        <motion.g key={n.label} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.25 }}>
          {i > 0 && (
            <motion.line
              x1={nodes[i - 1].x + 30} y1={nodes[i - 1].y + 28}
              x2={n.x + 30} y2={n.y}
              stroke={C.path} strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.25, duration: 0.3 }} />
          )}
          <rect x={n.x} y={n.y} width={100} height={28} rx={5}
            fill={`${n.c}14`} stroke={i === 2 ? C.path : n.c}
            strokeWidth={i === 2 ? 1.6 : 0.8} />
          <text x={n.x + 50} y={n.y + 18} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={n.c}>{n.label}</text>
        </motion.g>
      ))}
      {/* Found marker */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}>
        <rect x={230} y={140} width={80} height={28} rx={5}
          fill={`${C.path}18`} stroke={C.path} strokeWidth={1.2} />
        <text x={270} y={158} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={C.path}>0x5C found</text>
      </motion.g>
    </g>
  );
}
