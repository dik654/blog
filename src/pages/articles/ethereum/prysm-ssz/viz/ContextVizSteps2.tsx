import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: SSZ + HashTreeRoot */
export function Step3() {
  const mods = [
    { label: '고정/가변', sub: '오프셋 분리', color: C.ssz },
    { label: 'HashTreeRoot', sub: '결정적 루트', color: C.merkle },
    { label: 'GenIndex', sub: '상태 증명', color: C.proof },
  ];
  return (<g>
    {mods.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={15 + i * 138} y={20} w={118} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      32B 청크 → 바이너리 머클 트리 → 상태 증명
    </motion.text>
  </g>);
}

/* Step 4: GeneralizedIndex 증명 — 7노드 완전 이진 트리 */
export function Step4() {
  /* BFS 인덱스 1~7, 리프 4~7이 실제 필드 */
  const nodes = [
    { x: 210, y: 5, label: '1', sub: 'Root' },
    { x: 130, y: 38, label: '2', sub: '' },
    { x: 290, y: 38, label: '3', sub: '' },
    { x: 90, y: 70, label: '4', sub: 'slot' },
    { x: 170, y: 70, label: '5', sub: 'root' },
    { x: 250, y: 70, label: '6', sub: 'pk' },
    { x: 330, y: 70, label: '7', sub: 'bal' },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  /* 증명 경로: 리프 4(slot) → 형제 5, 노드 3 */
  const proofPath = [3, 4, 1];
  return (<g>
    {edges.map(([a, b], i) => {
      const f = nodes[a], t = nodes[b];
      const isProof = proofPath.includes(b);
      return (
        <motion.line key={i} x1={f.x} y1={f.y + 10} x2={t.x} y2={t.y}
          stroke={isProof ? C.proof : 'var(--border)'} strokeWidth={isProof ? 1.2 : 0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.25, delay: i * 0.06 }} />
      );
    })}
    {nodes.map((n, i) => {
      const isTarget = i === 3;
      const isProof = [4, 2].includes(i);
      const col = isTarget ? C.merkle : isProof ? C.proof : C.ssz;
      return (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}>
          <circle cx={n.x} cy={n.y + 5} r={12} fill="var(--card)"
            stroke={col} strokeWidth={isTarget || isProof ? 1.5 : 0.8} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight={600} fill={col}>{n.label}</text>
          {n.sub && <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{n.sub}</text>}
        </motion.g>
      );
    })}
    <motion.text x={210} y={100} textAnchor="middle" fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      slot(4) 증명 = 형제 5 + 노드 3 해시만 필요
    </motion.text>
  </g>);
}
