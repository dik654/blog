import type { CodeRef } from './codeRefsTypes';

export const commitCodeRef: Record<string, CodeRef> = {
  'finalize-commit': {
    path: 'cometbft/consensus/state.go — enterCommit() + finalizeCommit()',
    lang: 'go',
    highlight: [1, 3],
    desc: '+2/3 Precommit 달성 시 enterCommit → tryFinalizeCommit → finalizeCommit 체인으로\n블록을 blockStore에 저장하고 ABCI ApplyBlock을 호출하여 상태를 전이합니다.',
    code: `// Enter: +2/3 precommits for block
func (cs *State) enterCommit(height int64, commitRound int32) {
    defer func() {
        cs.updateRoundStep(cs.Round, cstypes.RoundStepCommit)
        cs.CommitRound = commitRound
        cs.CommitTime = cmttime.Now()
        cs.newStep()
        // Maybe finalize immediately.
        cs.tryFinalizeCommit(height)
    }()

    blockID, ok := cs.Votes.Precommits(commitRound).TwoThirdsMajority()
    if !ok { panic("expects +2/3 precommits") }

    // Move LockedBlock to ProposalBlock if they match
    if cs.LockedBlock.HashesTo(blockID.Hash) {
        cs.ProposalBlock = cs.LockedBlock
        cs.ProposalBlockParts = cs.LockedBlockParts
    }
}

func (cs *State) finalizeCommit(height int64) {
    blockID, ok := cs.Votes.Precommits(cs.CommitRound).TwoThirdsMajority()
    block, blockParts := cs.ProposalBlock, cs.ProposalBlockParts

    // Save to blockStore
    seenCommit := cs.Votes.Precommits(cs.CommitRound).
        MakeExtendedCommit(cs.state.ConsensusParams.ABCI)
    cs.blockStore.SaveBlockWithExtendedCommit(
        block, blockParts, seenCommit)

    // Write EndHeight to WAL (crash recovery point)
    cs.wal.WriteSync(EndHeightMessage{height})

    // Apply block via ABCI
    stateCopy, err := cs.blockExec.ApplyBlock(
        cs.state, blockID, block)
    // Update state and schedule next height
    cs.updateToState(stateCopy)
    cs.scheduleRound0(&cs.RoundState)
}`,
    annotations: [
      { lines: [3, 10], color: 'sky', note: 'defer: CommitRound/Time 기록 후 tryFinalizeCommit 호출' },
      { lines: [12, 13], color: 'emerald', note: '+2/3 Precommit 다수결 확인 — 없으면 panic' },
      { lines: [27, 30], color: 'amber', note: 'blockStore에 블록 영구 저장 (ExtendedCommit 포함)' },
      { lines: [32, 33], color: 'violet', note: 'WAL에 EndHeight 기록 — 크래시 복구의 기준점' },
      { lines: [35, 39], color: 'rose', note: 'ABCI ApplyBlock: 앱 상태 전이 → 새 height로 이동' },
    ],
  },
};
