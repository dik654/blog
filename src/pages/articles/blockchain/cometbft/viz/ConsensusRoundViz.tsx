import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './ConsensusRoundVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.Proposer}>cs.enterPropose() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.Proposer}>Line 1: proposal := cs.createProposalBlock()  // 블록 생성</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.Proposer}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.sendInternalMessage(msgInfo{'{'}Msg: &ProposalMessage{'{'}Proposal: proposal{'}'}{'}'})
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 라운드 로빈으로 선출된 Proposer가 모든 검증자에게 브로드캐스트
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={92} w={120} h={22} label="ProposalMsg" sub="block + parts" color={C.Proposer} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.Validator}>cs.enterPrevote() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.Validator}>Line 1: if cs.isProposalComplete() {'{'} blockID = cs.Proposal.BlockID {'}'}</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.Validator}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: else {'{'} blockID = types.BlockID{'{'}{'}'} {'}'}  // nil 투표
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: cs.signAddVote(types.PrevoteType, blockID)  // 각 검증자 브로드캐스트
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.Committed}>Polka 달성 — +2/3 Prevote</text>
    <text x={20} y={44} fontSize={10} fill={C.Validator}>Line 1: voteSet.HasTwoThirdsMajority()  // sum {'>'} totalPower*2/3</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.Validator}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.LockedRound = round  // 해당 블록에 Lock
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: cs.LockedBlock = block  // Lock 이후 다른 블록 투표 불가
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="+2/3 Polka" sub="Lock 확보" color={C.Committed} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.Committed}>cs.enterPrecommit() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.Committed}>Line 1: if cs.LockedBlock != nil {'{'} blockID = cs.LockedBlock.Hash {'}'}  </text>
    <motion.text x={20} y={64} fontSize={10} fill={C.Committed}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.signAddVote(types.PrecommitType, blockID)
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Lock된 블록에 대해 Precommit 투표 전송
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.Committed}>cs.enterCommit() — 즉시 최종성</text>
    <text x={20} y={44} fontSize={10} fill={C.Committed}>Line 1: precommits.HasTwoThirdsMajority()  // +2/3 Precommit</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.Committed}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.finalizeCommit(height)  // 블록 확정 + 상태 갱신
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 포크 없이 즉시 최종성 — 되돌릴 수 없음
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={92} w={120} h={22} label="COMMITTED" sub="즉시 최종성" color={C.Committed} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function ConsensusRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
