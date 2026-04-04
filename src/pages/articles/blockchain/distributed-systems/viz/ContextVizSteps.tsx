import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 왜 분산 시스템 */
export function StepWhyDistributed() {
  const nodes = [
    { x: 60, y: 35 }, { x: 160, y: 25 }, { x: 260, y: 35 },
    { x: 110, y: 85 }, { x: 210, y: 85 },
  ];
  const links: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4]];
  return (<g>
    {links.map(([a, b], i) => (
      <motion.line key={i} x1={nodes[a].x} y1={nodes[a].y}
        x2={nodes[b].x} y2={nodes[b].y}
        stroke="var(--border)" strokeWidth={0.8}
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ delay: i * 0.05 }} />
    ))}
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring', bounce: 0.3 }}>
        <circle cx={n.x} cy={n.y} r={14} fill="var(--card)"
          stroke={C.sync} strokeWidth={1} />
        <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.sync}>N{i + 1}</text>
      </motion.g>
    ))}
    <motion.text x={320} y={55} fontSize={11} fill={C.sync}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      여러 노드가 하나의
    </motion.text>
    <motion.text x={320} y={72} fontSize={11} fill={C.sync}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      목표에 합의해야 함
    </motion.text>
  </g>);
}

/* Step 1: CAP 정리 */
export function StepCAP() {
  const pts = [{ x: 130, y: 15, l: 'C' }, { x: 60, y: 95, l: 'A' }, { x: 200, y: 95, l: 'P' }];
  return (<g>
    <motion.polygon
      points={pts.map(p => `${p.x},${p.y}`).join(' ')}
      fill="none" stroke={C.err} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.8 }} />
    {pts.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.12, type: 'spring' }}>
        <circle cx={p.x} cy={p.y} r={14} fill={`${C.err}12`}
          stroke={C.err} strokeWidth={1.2} />
        <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12}
          fontWeight={700} fill={C.err}>{p.l}</text>
      </motion.g>
    ))}
    <ActionBox x={260} y={20} w={130} h={32}
      label="CP: BFT 블록체인" sub="분할 시 멈춤" color={C.partial} />
    <AlertBox x={260} y={65} w={130} h={32}
      label="AP: Bitcoin" sub="분할 시 포크" color={C.async} />
  </g>);
}

/* Step 2: FLP 불가능성 */
export function StepFLP() {
  return (<g>
    <AlertBox x={80} y={12} w={250} h={48}
      label="FLP 불가능성 (1985)" sub="비동기 + 1 crash → 결정적 합의 불가" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}>
      <ActionBox x={50} y={78} w={120} h={32}
        label="Safety" sub="항상 보장 가능" color={C.partial} />
      <AlertBox x={230} y={78} w={120} h={32}
        label="Liveness" sub="결정적 보장 불가" color={C.err} />
    </motion.g>
  </g>);
}

/* Step 3: 해결책 */
export function StepSolution() {
  return (<g>
    <ModuleBox x={20} y={15} w={170} h={42}
      label="부분 동기 모델" sub="GST 이후 Δ 보장" color={C.partial} />
    <ModuleBox x={230} y={15} w={170} h={42}
      label="확률적 합의" sub="랜덤 코인으로 탈출" color={C.sync} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}>
      <ActionBox x={80} y={78} w={250} h={35}
        label="PBFT · HotStuff · Tendermint"
        sub="부분 동기 모델 채택 → 실용적 BFT 달성" color={C.partial} />
    </motion.g>
  </g>);
}
