import { motion } from 'framer-motion';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './VoteHandlingVizData';

export function StepPrecommitThreshold() {
  return (<g>
    <DataBox x={10} y={12} w={105} h={28} label="Precommits(r)" sub="투표 수집" color={C.vote} />
    <motion.line x1={120} y1={26} x2={155} y2={18} stroke={C.timer} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1={120} y1={26} x2={155} y2={50} stroke={C.transition} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={160} y={5} w={135} h={25} label="HasTwoThirdsAny" sub="timeoutPrecommit" color={C.timer} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ActionBox x={160} y={38} w={135} h={25} label="TwoThirdsMajority" sub="blockID → enterCommit" color={C.transition} />
    </motion.g>
    <motion.text x={300} y={82} textAnchor="middle" fontSize={10} fill={C.transition}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      +2/3 Precommit + 블록 해시 → 블록 확정
    </motion.text>
  </g>);
}

export function StepValidBlock() {
  return (<g>
    <ModuleBox x={15} y={15} w={110} h={42} label="Polka 달성" sub="특정 블록 +2/3" color={C.vote} />
    <motion.line x1={130} y1={36} x2={175} y2={22} stroke={C.vote} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1={130} y1={36} x2={175} y2={52} stroke={C.threshold} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={180} y={8} w={115} h={26} label="ValidRound = r" color={C.vote} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={180} y={40} w={140} h={26} label="ValidBlock = Proposal" color={C.threshold} />
    </motion.g>
    <motion.text x={230} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      다음 라운드 제안자가 ValidBlock을 재사용 가능
    </motion.text>
  </g>);
}
