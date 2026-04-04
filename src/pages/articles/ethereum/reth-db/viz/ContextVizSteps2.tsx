import { motion } from 'framer-motion';
import { ModuleBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: MDBX B+tree */
export function StepMDBX() {
  const nodes = [
    { label: 'Root', x: 160, y: 12 },
    { label: 'Branch', x: 80, y: 52 },
    { label: 'Branch', x: 240, y: 52 },
    { label: 'Leaf', x: 30, y: 92 },
    { label: 'Leaf', x: 130, y: 92 },
    { label: 'Leaf', x: 240, y: 92 },
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (<g>
    {edges.map(([a, b], i) => (
      <motion.line key={i} x1={nodes[a].x} y1={nodes[a].y + 16}
        x2={nodes[b].x} y2={nodes[b].y}
        stroke={C.db} strokeWidth={0.8} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ delay: i * 0.05 }} />
    ))}
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring', bounce: 0.3 }}>
        <rect x={n.x - 35} y={n.y} width={70} height={22} rx={5}
          fill={`${C.db}15`} stroke={C.db} strokeWidth={0.8} />
        <text x={n.x} y={n.y + 15} textAnchor="middle" fontSize={10}
          fontWeight={i === 0 ? 600 : 400} fill={C.db}>{n.label}</text>
      </motion.g>
    ))}
    <ModuleBox x={340} y={40} w={80} h={45} label="MVCC" sub="읽기 비차단" color={C.ok} />
    <text x={200} y={130} textAnchor="middle" fontSize={11} fill={C.ok}>
      읽기 O(log n) 보장 + 동시 읽기/쓰기
    </text>
  </g>);
}

/* Step 4: StaticFiles 분리 */
export function StepStaticFiles() {
  return (<g>
    <motion.line x1={220} y1={18} x2={220} y2={105} stroke={C.hot} strokeWidth={1.5}
      strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.6 }} />
    <text x={220} y={12} textAnchor="middle" fontSize={10} fill={C.hot} fontWeight={600}>
      finalized 경계
    </text>
    <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <StatusBox x={30} y={30} w={160} h={60} label="StaticFiles"
        sub="Headers · TXs · Receipts" color={C.cold} progress={1} />
    </motion.g>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <StatusBox x={250} y={30} w={160} h={60} label="MDBX"
        sub="최신 데이터만" color={C.ok} progress={0.3} />
    </motion.g>
    <text x={220} y={120} textAnchor="middle" fontSize={11} fill={C.ok}>
      DB 크기 감소 → B+tree 얕게 유지
    </text>
  </g>);
}
