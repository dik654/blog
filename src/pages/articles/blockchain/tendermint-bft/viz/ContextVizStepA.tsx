import { motion } from 'framer-motion';
import { AlertBox, ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: PBFT O(n²) 문제 */
export function StepPBFTProblem() {
  const pos = [{ x: 40, y: 25 }, { x: 140, y: 25 }, { x: 40, y: 75 }, { x: 140, y: 75 }];
  const lines: [number, number][] = [];
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) lines.push([a, b]);
  return (<g>
    {lines.map(([a, b], i) => (
      <motion.line key={i} x1={pos[a].x + 25} y1={pos[a].y + 12} x2={pos[b].x + 25} y2={pos[b].y + 12}
        stroke={C.err} strokeWidth={0.7} initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }} transition={{ delay: i * 0.04 }} />
    ))}
    {pos.map((p, i) => (
      <circle key={i} cx={p.x + 25} cy={p.y + 12} r={12} fill={`${C.pbft}15`}
        stroke={C.pbft} strokeWidth={1} />
    ))}
    <AlertBox x={230} y={30} w={150} h={42}
      label="O(n²) 정상경로" sub="O(n³) View Change" color={C.err} />
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      블록체인에는 비효율적
    </motion.text>
  </g>);
}

/* Step 1: Tendermint 간소화 */
export function StepTendermint() {
  const stages = [
    { label: 'Propose', color: C.tm },
    { label: 'Prevote', color: C.lock },
    { label: 'Precommit', color: C.pbft },
    { label: 'Commit', color: C.tm },
  ];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12, type: 'spring' }}>
        <ModuleBox x={10 + i * 103} y={25} w={88} h={42}
          label={s.label} sub={i < 3 ? `Step ${i + 1}` : '확정'} color={s.color} />
        {i < 3 && (
          <motion.line x1={98 + i * 103} y1={46} x2={113 + i * 103} y2={46}
            stroke={C.tm} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.12 + 0.2 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.tm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      라운드 기반 투표 — View Change 단순화
    </motion.text>
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 타임아웃 시 자동으로 Round+1 진행'}
    </motion.text>
  </g>);
}
