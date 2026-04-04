import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { ok: '#10b981', byz: '#f59e0b', ev: '#8b5cf6', slash: '#ef4444' };

const STEPS = [
  { label: '정상 투표 수집', body: '밸리데이터 V1~V4가 동일 블록 A에 투표합니다.' },
  { label: '이중 서명 탐지', body: 'V3가 블록 A와 B 모두에 투표하여 비잔틴 행위가 발생합니다.' },
  { label: 'Evidence 수집', body: 'EvidencePool에 DuplicateVoteEvidence를 저장합니다.' },
  { label: '슬래싱 실행', body: '다음 블록 제안자가 Evidence를 블록에 포함하여 처벌합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ok}>voteSet.AddVote() — 정상 경로</text>
    <text x={20} y={44} fontSize={10} fill={C.ok}>Line 1: existing := voteSet.getVote(idx, blockID)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if existing == nil {'{'} voteSet.addVerifiedVote(vote) {'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: voteSet.sum += votingPower  // 누적 투표력 갱신
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={110} h={22} label="sum=+2/3" sub="Polka 달성" color={C.ok} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.byz}>conflictingVote 감지</text>
    <text x={20} y={44} fontSize={10} fill={C.byz}>Line 1: existing := voteSet.getVote(v3.Idx, blockA)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.byz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if existing != nil && !existing.BlockID.Equals(vote.BlockID) {'{'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.slash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:   return ErrVoteConflictingVotes  // A, B 모두 투표!
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 동일 인덱스에 다른 BlockID → 이중 서명
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ev}>evpool.AddEvidence() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.ev}>Line 1: ev := DuplicateVoteEvidence{'{'}VoteA: voteA, VoteB: voteB{'}'}</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.ev}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if err := ev.Verify(chainID, valSet); err != nil {'{'} return {'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: evpool.evidenceStore.Set(key, ev)  // 서명 검증 후 저장
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={92} w={120} h={22} label="evidenceStore" sub="BoltDB 저장" color={C.ev} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.slash}>app.FinalizeBlock() — 슬래싱</text>
    <text x={20} y={44} fontSize={10} fill={C.slash}>Line 1: for _, ev := range req.ByzantineValidators {'{'}</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.slash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   slashing.HandleDoubleSign(ctx, ev.Validator)
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.slash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:   staking.Jail(ev.Validator.Address)  // 감옥 + 토큰 삭감
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 5% 스테이크 슬래싱 + Jailing
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ByzantineDetectViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
