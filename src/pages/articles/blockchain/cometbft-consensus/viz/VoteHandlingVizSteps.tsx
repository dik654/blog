import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { C } from './VoteHandlingVizData';

export function StepTryAdd() {
  return (<g>
    <ModuleBox x={15} y={10} w={100} h={45} label="tryAddVote" sub="투표 추가" color={C.vote} />
    <motion.line x1={120} y1={32} x2={160} y2={22} stroke={C.vote} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1={120} y1={32} x2={160} y2={55} stroke={C.evidence} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={165} y={8} w={100} h={28} label="addVote()" sub="서명 검증·집계" color={C.transition} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <AlertBox x={165} y={42} w={115} h={28} label="이중 투표 감지" sub="evpool.Report" color={C.evidence} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <text x={295} y={22} fontSize={10} fill={C.transition}>정상 경로</text>
      <text x={295} y={62} fontSize={10} fill={C.evidence}>자체 이중 서명 → panic</text>
    </motion.g>
  </g>);
}

export function StepPrevoteThreshold() {
  return (<g>
    <DataBox x={10} y={12} w={95} h={28} label="Prevotes(r)" sub="투표 수집" color={C.vote} />
    <motion.line x1={110} y1={26} x2={150} y2={18} stroke={C.threshold} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1={110} y1={26} x2={150} y2={50} stroke={C.transition} strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={155} y={5} w={128} h={25} label="HasTwoThirdsAny" sub="timeoutPrevote" color={C.timer} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ActionBox x={155} y={38} w={128} h={25} label="TwoThirdsMajority" sub="Polka → enterPrecommit" color={C.transition} />
    </motion.g>
    <motion.text x={300} y={82} textAnchor="middle" fontSize={10} fill={C.transition}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      Polka 달성 = enterPrecommit 트리거
    </motion.text>
  </g>);
}
