import { motion } from 'framer-motion';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: HotStuff 3단계 필요성 */
export function StepHS1() {
  const phases = [
    { label: 'Prepare', color: C.hs1 },
    { label: 'Pre-Commit', color: C.fast },
    { label: 'Commit', color: C.hs2 },
  ];
  return (<g>
    {phases.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12, type: 'spring' }}>
        <ModuleBox x={20 + i * 130} y={25} w={110} h={40}
          label={p.label} sub={`QC${i + 1}`} color={p.color} />
        {i < 2 && (
          <motion.line x1={130 + i * 130} y1={45} x2={150 + i * 130} y2={45}
            stroke={p.color} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.12 + 0.2 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.fast}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Pre-Commit이 정말 필요한가?
    </motion.text>
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 O(n) View Change를 위해 추가한 단계'}
    </motion.text>
  </g>);
}

/* Step 1: HotStuff-2 — 2단계 */
export function StepHS2() {
  return (<g>
    <ModuleBox x={40} y={20} w={130} h={42}
      label="Prepare" sub="QC 수집" color={C.hs1} />
    <motion.line x1={170} y1={41} x2={210} y2={41}
      stroke={C.hs2} strokeWidth={1.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ModuleBox x={210} y={20} w={130} h={42}
      label="Commit" sub="TC로 안전 보장" color={C.hs2} />
    <AlertBox x={140} y={75} w={150} h={35}
      label="Pre-Commit 제거" sub="TC가 대체" color={C.fast} />
    <motion.text x={210} y={125} textAnchor="middle" fontSize={11} fill={C.hs2}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      {'💡 timeout-certificate(TC)로 3→2단계 축소'}
    </motion.text>
  </g>);
}
