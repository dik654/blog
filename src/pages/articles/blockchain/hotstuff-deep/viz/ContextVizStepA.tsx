import { motion } from 'framer-motion';
import { AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: PBFT View Change 문제 */
export function StepPBFTVC() {
  return (<g>
    <AlertBox x={30} y={15} w={150} h={42}
      label="PBFT View Change" sub="O(n³) 복잡도" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <AlertBox x={230} y={15} w={150} h={42}
        label="Hangover 현상" sub="복구 후에도 성능 저하" color={C.err} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      n=100 → View Change에 100만 메시지
    </motion.text>
    <motion.text x={210} y={110} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 이 문제가 HotStuff 탄생의 직접적 동기'}
    </motion.text>
  </g>);
}

/* Step 1: HotStuff Star Topology */
export function StepStar() {
  const reps = [{ x: 55, y: 85 }, { x: 165, y: 85 }, { x: 275, y: 85 }, { x: 345, y: 85 }];
  return (<g>
    <ModuleBox x={140} y={8} w={130} h={38}
      label="Leader" sub="QC 수집 · Threshold Sig" color={C.hs} />
    {reps.map((r, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, type: 'spring' }}>
        <circle cx={r.x} cy={r.y} r={14} fill={`${C.pbft}12`}
          stroke={C.pbft} strokeWidth={1} />
        <text x={r.x} y={r.y + 4} textAnchor="middle"
          fontSize={10} fontWeight={600} fill={C.pbft}>R{i + 1}</text>
        <motion.line x1={205} y1={46} x2={r.x} y2={r.y - 14}
          stroke={C.hs} strokeWidth={1} initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: i * 0.08 + 0.3 }} />
      </motion.g>
    ))}
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11} fill={C.hs}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      {'💡 O(n) 통신 — 정상 경로 = View Change'}
    </motion.text>
  </g>);
}
