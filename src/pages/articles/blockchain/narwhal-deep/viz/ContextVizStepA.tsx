import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 순차 멤풀 병목 */
export function StepSequential() {
  return (<g>
    <ModuleBox x={140} y={8} w={130} h={38}
      label="Leader" sub="TX 수집 + 제안" color={C.seq} />
    {[0, 1, 2].map(i => (
      <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <circle cx={65 + i * 130} cy={85} r={14} fill={`${C.dag}12`}
          stroke={C.dag} strokeWidth={1} />
        <text x={65 + i * 130} y={89} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.dag}>V{i + 1}</text>
        <motion.line x1={205} y1={46} x2={65 + i * 130} y2={71}
          stroke={C.seq} strokeWidth={0.8} initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: i * 0.08 + 0.2 }} />
      </motion.g>
    ))}
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11} fill={C.seq}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      리더 대역폭이 전체 처리량 제한
    </motion.text>
  </g>);
}

/* Step 1: DAG 병렬 제안 */
export function StepDAG() {
  const nodes = [
    { x: 50, y: 15, r: 0 }, { x: 180, y: 15, r: 0 }, { x: 310, y: 15, r: 0 },
    { x: 115, y: 70, r: 1 }, { x: 245, y: 70, r: 1 },
  ];
  const edges: [number, number][] = [[0, 3], [0, 4], [1, 3], [1, 4], [2, 3], [2, 4]];
  return (<g>
    {edges.map(([a, b], i) => (
      <motion.line key={i} x1={nodes[a].x + 15} y1={nodes[a].y + 15}
        x2={nodes[b].x + 15} y2={nodes[b].y + 10}
        stroke="var(--border)" strokeWidth={0.7}
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: i * 0.05 }} />
    ))}
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring', bounce: 0.3 }}>
        <rect x={n.x} y={n.y} width={30} height={22} rx={4}
          fill={`${C.dag}15`} stroke={C.dag} strokeWidth={1} />
        <text x={n.x + 15} y={n.y + 15} textAnchor="middle"
          fontSize={10} fontWeight={600} fill={C.dag}>V{i}</text>
      </motion.g>
    ))}
    <text x={380} y={25} fontSize={10} fill="var(--muted-foreground)">Round 0</text>
    <text x={380} y={80} fontSize={10} fill="var(--muted-foreground)">Round 1</text>
    <motion.text x={210} y={115} textAnchor="middle" fontSize={11} fill={C.dag}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      {'💡 모든 노드가 동시에 제안 → 병렬 처리량'}
    </motion.text>
  </g>);
}
