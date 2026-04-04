import type { CodeRef } from '@/components/code/types';

export const precommitRefs: Record<string, CodeRef> = {
  'enter-precommit': {
    path: 'consensus/state.go — enterPrecommit()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'enterPrecommit — +2/3 Prevote(Polka) 결과로 Lock/Unlock 결정.\nPolka for block → Lock, Polka for nil → Unlock.',
    code: `func (cs *State) enterPrecommit(height int64, round int32) {
    defer func() {
        cs.updateRoundStep(round, cstypes.RoundStepPrecommit)
        cs.newStep()
    }()

    blockID, ok := cs.Votes.Prevotes(round).TwoThirdsMajority()

    // Polka 미달성 → nil precommit
    if !ok {
        cs.signAddVote(cmtproto.PrecommitType,
            nil, types.PartSetHeader{}, nil)
        return
    }

    // +2/3이 nil에 투표 → 기존 Lock 해제
    if len(blockID.Hash) == 0 {
        if cs.LockedBlock != nil {
            cs.LockedRound = -1
            cs.LockedBlock = nil
            cs.LockedBlockParts = nil
        }
        cs.signAddVote(cmtproto.PrecommitType,
            nil, types.PartSetHeader{}, nil)
        return
    }

    // 이미 Lock된 블록에 Polka → Relock
    if cs.LockedBlock.HashesTo(blockID.Hash) {
        cs.LockedRound = round
        cs.signAddVote(cmtproto.PrecommitType,
            blockID.Hash, blockID.PartSetHeader, cs.LockedBlock)
        return
    }

    // 새 블록에 Polka → Lock 설정 & Precommit
    if cs.ProposalBlock.HashesTo(blockID.Hash) {
        cs.blockExec.ValidateBlock(cs.state, cs.ProposalBlock)
        cs.LockedRound = round
        cs.LockedBlock = cs.ProposalBlock
        cs.LockedBlockParts = cs.ProposalBlockParts
        cs.signAddVote(cmtproto.PrecommitType,
            blockID.Hash, blockID.PartSetHeader,
            cs.ProposalBlock)
    }
}`,
    annotations: [
      { lines: [6, 6], color: 'sky',
        note: 'TwoThirdsMajority: Prevotes에서 +2/3 다수결 블록 조회' },
      { lines: [9, 14], color: 'emerald',
        note: 'Polka 미달성 → nil Precommit' },
      { lines: [16, 26], color: 'amber',
        note: '+2/3 nil → Lock 해제. 다음 라운드에서 다른 블록 투표 가능' },
      { lines: [37, 45], color: 'violet',
        note: '새 블록 Polka → ValidateBlock → Lock & Precommit (핵심 경로)' },
    ],
  },
};
