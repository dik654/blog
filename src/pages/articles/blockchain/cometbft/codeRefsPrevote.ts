import type { CodeRef } from './codeRefsTypes';

export const prevoteCodeRef: Record<string, CodeRef> = {
  'enter-prevote': {
    path: 'cometbft/consensus/state.go — defaultDoPrevote()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'defaultDoPrevote는 Prevote 투표 로직의 핵심입니다.\nLockedBlock이 있으면 Lock된 블록에 투표, ProposalBlock이 없거나 무효하면 nil 투표.\nABCI ProcessProposal 호출로 앱 레벨 검증도 수행합니다.',
    code: `func (cs *State) defaultDoPrevote(height int64, round int32) {
    logger := cs.Logger.With("height", height, "round", round)

    // If a block is locked, prevote that.
    if cs.LockedBlock != nil {
        logger.Debug("already locked on a block; prevoting locked block")
        cs.signAddVote(cmtproto.PrevoteType,
            cs.LockedBlock.Hash(), cs.LockedBlockParts.Header(), nil)
        return
    }

    // If ProposalBlock is nil, prevote nil.
    if cs.ProposalBlock == nil {
        logger.Debug("prevote step: ProposalBlock is nil")
        cs.signAddVote(cmtproto.PrevoteType, nil, types.PartSetHeader{}, nil)
        return
    }

    // Validate proposal block
    err := cs.blockExec.ValidateBlock(cs.state, cs.ProposalBlock)
    if err != nil {
        logger.Error("block invalid; prevoting nil", "err", err)
        cs.signAddVote(cmtproto.PrevoteType, nil, types.PartSetHeader{}, nil)
        return
    }

    // ABCI ProcessProposal — ask application to validate
    isAppValid, err := cs.blockExec.ProcessProposal(
        cs.ProposalBlock, cs.state)
    if err != nil {
        panic(fmt.Sprintf("ProcessProposal error: %v", err))
    }
    cs.metrics.MarkProposalProcessed(isAppValid)

    // Vote nil if Application rejected the block
    if !isAppValid {
        logger.Error("app rejected block; prevoting nil")
        cs.signAddVote(cmtproto.PrevoteType, nil, types.PartSetHeader{}, nil)
        return
    }

    // Prevote cs.ProposalBlock
    logger.Debug("prevote step: ProposalBlock is valid")
    cs.signAddVote(cmtproto.PrevoteType,
        cs.ProposalBlock.Hash(), cs.ProposalBlockParts.Header(), nil)
}`,
    annotations: [
      { lines: [4, 10], color: 'sky', note: 'Lock 우선: 이전 라운드에서 Lock된 블록이 있으면 해당 블록에 Prevote' },
      { lines: [12, 17], color: 'emerald', note: 'Proposal 없음: 제안 블록을 못 받았으면 nil에 투표 (타임아웃 경로)' },
      { lines: [20, 25], color: 'amber', note: '합의 레벨 블록 검증: ValidateBlock으로 구조적 유효성 확인' },
      { lines: [28, 34], color: 'violet', note: 'ABCI ProcessProposal: 앱에 블록 검증 위임 — 거부 시 nil 투표' },
      { lines: [43, 46], color: 'rose', note: '모든 검증 통과 시 ProposalBlock 해시에 서명하여 Prevote 브로드캐스트' },
    ],
  },
};
