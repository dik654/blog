import type { CodeRef } from './codeRefsTypes';

export const precommitCodeRef: Record<string, CodeRef> = {
  'enter-precommit': {
    path: 'cometbft/consensus/state.go — enterPrecommit()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'enterPrecommit은 +2/3 Prevote(Polka) 결과에 따라 Lock/Unlock을 결정합니다.\nPolka가 특정 블록이면 Lock & Precommit, nil이면 Unlock & nil Precommit.\nPolka 없으면 무조건 nil Precommit 합니다.',
    code: `func (cs *State) enterPrecommit(height int64, round int32) {
    logger := cs.Logger.With("height", height, "round", round)
    if cs.Height != height || round < cs.Round ||
       (cs.Round == round && cstypes.RoundStepPrecommit <= cs.Step) {
        return
    }
    defer func() {
        cs.updateRoundStep(round, cstypes.RoundStepPrecommit)
        cs.newStep()
    }()

    // check for a polka
    blockID, ok := cs.Votes.Prevotes(round).TwoThirdsMajority()

    // No polka → precommit nil
    if !ok {
        cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
        return
    }

    // +2/3 prevoted nil → unlock and precommit nil
    if len(blockID.Hash) == 0 {
        if cs.LockedBlock != nil {
            cs.LockedRound = -1
            cs.LockedBlock = nil
            cs.LockedBlockParts = nil
        }
        cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
        return
    }

    // Already locked on that block → relock
    if cs.LockedBlock.HashesTo(blockID.Hash) {
        cs.LockedRound = round
        cs.signAddVote(cmtproto.PrecommitType,
            blockID.Hash, blockID.PartSetHeader, cs.LockedBlock)
        return
    }

    // +2/3 prevoted proposal block → lock and precommit
    if cs.ProposalBlock.HashesTo(blockID.Hash) {
        cs.blockExec.ValidateBlock(cs.state, cs.ProposalBlock)
        cs.LockedRound = round
        cs.LockedBlock = cs.ProposalBlock
        cs.LockedBlockParts = cs.ProposalBlockParts
        cs.signAddVote(cmtproto.PrecommitType,
            blockID.Hash, blockID.PartSetHeader, cs.ProposalBlock)
        return
    }

    // Polka for unknown block → unlock and nil
    cs.LockedRound = -1
    cs.LockedBlock = nil
    cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
}`,
    annotations: [
      { lines: [12, 13], color: 'sky', note: 'Polka 확인: Prevotes에서 +2/3 다수결 블록 조회' },
      { lines: [15, 19], color: 'emerald', note: 'Polka 미달성 → nil Precommit (다음 라운드로)' },
      { lines: [21, 29], color: 'amber', note: '+2/3이 nil에 투표 → 기존 Lock 해제 후 nil Precommit' },
      { lines: [32, 37], color: 'violet', note: '이미 Lock된 블록에 Polka → Relock 후 Precommit' },
      { lines: [40, 48], color: 'rose', note: '새 블록에 Polka → Lock 설정 & Precommit (핵심 경로)' },
    ],
  },
};
