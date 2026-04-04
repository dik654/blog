import type { CodeRef } from '@/components/code/types';

export const commitRefs: Record<string, CodeRef> = {
  'enter-commit': {
    path: 'consensus/state.go — enterCommit() + finalizeCommit()',
    lang: 'go',
    highlight: [1, 3],
    desc: 'enterCommit — +2/3 Precommit → 블록 확정.\nblockStore 저장 → ABCI ApplyBlock → 다음 높이.',
    code: `func (cs *State) enterCommit(height int64, commitRound int32) {
    defer func() {
        cs.updateRoundStep(cs.Round, cstypes.RoundStepCommit)
        cs.CommitRound = commitRound
        cs.CommitTime = cmttime.Now()
        cs.newStep()
        cs.tryFinalizeCommit(height)
    }()

    blockID, ok := cs.Votes.Precommits(commitRound).
        TwoThirdsMajority()
    if !ok {
        panic("enterCommit expects +2/3 precommits")
    }

    // LockedBlock이 확정 블록이면 ProposalBlock에 복사
    if cs.LockedBlock.HashesTo(blockID.Hash) {
        cs.ProposalBlock = cs.LockedBlock
        cs.ProposalBlockParts = cs.LockedBlockParts
    }
}

func (cs *State) finalizeCommit(height int64) {
    block, blockParts := cs.ProposalBlock, cs.ProposalBlockParts

    // blockStore에 블록 + ExtendedCommit 영구 저장
    seenCommit := cs.Votes.Precommits(cs.CommitRound).
        MakeExtendedCommit(cs.state.ConsensusParams.ABCI)
    cs.blockStore.SaveBlockWithExtendedCommit(
        block, blockParts, seenCommit)

    // WAL에 EndHeight 기록 (크래시 복구 기준점)
    cs.wal.WriteSync(EndHeightMessage{height})

    // ABCI ApplyBlock → 앱 상태 전이
    stateCopy, _ := cs.blockExec.ApplyBlock(
        cs.state, blockID, block)
    cs.updateToState(stateCopy)
    cs.scheduleRound0(&cs.RoundState)
}`,
    annotations: [
      { lines: [2, 8], color: 'sky',
        note: 'defer: CommitRound/Time 기록 후 tryFinalizeCommit 호출' },
      { lines: [10, 14], color: 'emerald',
        note: '+2/3 Precommit 다수결 확인 — 없으면 panic' },
      { lines: [27, 31], color: 'amber',
        note: 'blockStore 영구 저장: ExtendedCommit 포함' },
      { lines: [36, 39], color: 'violet',
        note: 'ABCI ApplyBlock → updateToState → 다음 높이' },
    ],
  },
};
