import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 비잔틴 장애 시나리오 */
export function StepByzantine() {
  const nodes = [
    { x: 50, y: 20, ok: true }, { x: 160, y: 20, ok: true },
    { x: 270, y: 20, ok: false }, { x: 105, y: 80, ok: true },
  ];
  return (<g>
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.3 }}>
        <circle cx={n.x} cy={n.y + 10} r={16} fill="var(--card)"
          stroke={n.ok ? C.hs : C.byz} strokeWidth={1.2} />
        <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={n.ok ? C.hs : C.byz}>
          {n.ok ? `N${i + 1}` : '💀'}
        </text>
      </motion.g>
    ))}
    <AlertBox x={230} y={55} w={140} h={42}
      label="비잔틴 노드" sub="거짓 메시지 · 이중 전송" color={C.byz} />
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11} fill={C.byz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      정직 노드끼리 합의에 도달해야 함 (n ≥ 3f+1)
    </motion.text>
  </g>);
}

/* Step 1: PBFT O(n²) 메시지 폭발 */
export function StepPBFTBroadcast() {
  const pos = [{ x: 50, y: 35 }, { x: 150, y: 35 }, { x: 50, y: 85 }, { x: 150, y: 85 }];
  const lines: [number, number][] = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) lines.push([i, j]);
  return (<g>
    {lines.map(([a, b], i) => (
      <motion.line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
        stroke={C.byz} strokeWidth={0.8} initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }} transition={{ delay: i * 0.06 }} />
    ))}
    {pos.map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r={14} fill={`${C.pbft}15`}
        stroke={C.pbft} strokeWidth={1} />
    ))}
    {pos.map((p, i) => (
      <text key={`t${i}`} x={p.x} y={p.y + 4} textAnchor="middle"
        fontSize={10} fontWeight={600} fill={C.pbft}>R{i}</text>
    ))}
    <AlertBox x={210} y={25} w={160} h={42}
      label="O(n²) 메시지" sub="n=100 → 10,000 메시지/라운드" color={C.byz} />
    <motion.text x={290} y={95} textAnchor="middle" fontSize={11} fill={C.byz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      ⚠ 검증자 확장 불가
    </motion.text>
  </g>);
}

/* Step 2: View Change O(n³) */
export function StepViewChange() {
  return (<g>
    <AlertBox x={30} y={18} w={160} h={45}
      label="리더 장애 발생" sub="View Change 시작" color={C.byz} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={220} y={18} w={160} h={45}
        label="O(n³) View Change" sub="전체 시스템 멈춤" color={C.byz} />
    </motion.g>
    <motion.text x={200} y={88} textAnchor="middle" fontSize={11} fill={C.byz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      ⚠ 복구 후에도 Hangover — 성능 점진 회복
    </motion.text>
    <motion.text x={200} y={108} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      💡 이더리움은 fork choice로 View Change 자체가 불필요
    </motion.text>
  </g>);
}
