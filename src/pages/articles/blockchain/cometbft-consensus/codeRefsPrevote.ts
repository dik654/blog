import type { CodeRef } from '@/components/code/types';

export const prevoteRefs: Record<string, CodeRef> = {
  'enter-prevote': {
    path: 'consensus/state.go — defaultDoPrevote()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'defaultDoPrevote — Lock 우선, 없으면 제안 블록 검증 후 투표.\nABCI ProcessProposal로 앱 레벨 검증도 수행.',
    code: `func (cs *State) defaultDoPrevote(height int64, round int32) {
    // Lock된 블록이 있으면 해당 블록에 prevote
    if cs.LockedBlock != nil {
        cs.signAddVote(cmtproto.PrevoteType,
            cs.LockedBlock.Hash(),
            cs.LockedBlockParts.Header(), nil)
        return
    }

    // 제안 블록이 없으면 nil prevote
    if cs.ProposalBlock == nil {
        cs.signAddVote(cmtproto.PrevoteType,
            nil, types.PartSetHeader{}, nil)
        return
    }

    // 블록 구조 검증
    err := cs.blockExec.ValidateBlock(cs.state, cs.ProposalBlock)
    if err != nil {
        cs.signAddVote(cmtproto.PrevoteType,
            nil, types.PartSetHeader{}, nil)
        return
    }

    // ABCI ProcessProposal: 앱에 블록 검증 위임
    isAppValid, err := cs.blockExec.ProcessProposal(
        cs.ProposalBlock, cs.state)
    if !isAppValid {
        cs.signAddVote(cmtproto.PrevoteType,
            nil, types.PartSetHeader{}, nil)
        return
    }

    // 모든 검증 통과 → 제안 블록에 prevote
    cs.signAddVote(cmtproto.PrevoteType,
        cs.ProposalBlock.Hash(),
        cs.ProposalBlockParts.Header(), nil)
}`,
    annotations: [
      { lines: [2, 8], color: 'sky',
        note: 'Lock 우선: Lock된 블록 있으면 반드시 해당 블록에 투표' },
      { lines: [10, 15], color: 'emerald',
        note: '제안 없음: 타임아웃 경로 — nil에 투표' },
      { lines: [17, 23], color: 'amber',
        note: '합의 레벨 검증: ValidateBlock으로 구조적 유효성 확인' },
      { lines: [25, 32], color: 'violet',
        note: 'ABCI ProcessProposal: 앱이 블록 거부 시 nil 투표' },
    ],
  },
};
