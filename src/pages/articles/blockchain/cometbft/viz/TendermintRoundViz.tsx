import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { propose: '#6366f1', prevote: '#10b981', precommit: '#f59e0b', commit: '#10b981' };

const STEPS = [
  { label: 'Propose 단계', body: '리더가 블록을 생성하여 브로드캐스트합니다.' },
  { label: 'Prevote 단계', body: '각 검증자가 1차 투표를 합니다.' },
  { label: 'Precommit 단계', body: '+2/3 달성 후 2차 투표를 합니다.' },
  { label: 'Commit 단계', body: '+2/3 Precommit → 블록 확정입니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.propose}>cs.decideProposal() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.propose}>Line 1: block, parts := cs.createProposalBlock()</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.propose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: proposal := types.NewProposal(height, round, cs.ValidRound, blockID)
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: cs.privValidator.SignProposal(chainID, proposal)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={110} h={22} label="SignedProposal" sub="리더 전용" color={C.propose} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.prevote}>cs.enterPrevote() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.prevote}>Line 1: cs.doPrevote(height, round)  // 블록 검증</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.prevote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.signAddVote(PrevoteType, blockID)  // 유효 → blockID 투표
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 제안 미수신/무효 → nil 투표 (types.BlockID{'{'}{'}'})
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.precommit}>cs.enterPrecommit() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.precommit}>Line 1: blockID, ok := cs.Votes.Prevotes(round).TwoThirdsMajority()</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.precommit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if ok {'{'} cs.LockedRound, cs.LockedBlock = round, block {'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: cs.signAddVote(PrecommitType, blockID)  // Lock 후 투표
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={110} h={22} label="Locked" sub="다른 블록 불가" color={C.precommit} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.commit}>cs.finalizeCommit() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.commit}>Line 1: blockParts := cs.ProposalBlockParts  // 완전한 블록</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: state.ApplyBlock(block, blockID, commit)  // 상태 전이
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: cs.StartNewHeight()  // height++ → 다음 라운드 시작
    </motion.text>
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}>
      <DataBox x={340} y={92} w={120} h={22} label="COMMITTED" sub="포크 없음" color={C.commit} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function TendermintRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
