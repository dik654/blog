import type { CodeRef } from './codeRefsTypes';

export const proposeCodeRef: Record<string, CodeRef> = {
  'enter-propose': {
    path: 'cometbft/consensus/state.go — enterPropose()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'enterPropose는 새 라운드의 Propose 단계 진입 함수입니다.\n현재 노드가 제안자(proposer)면 블록을 생성하고, 아니면 타임아웃을 기다립니다.\n제안 완료 후 isProposalComplete()이면 즉시 Prevote로 전환합니다.',
    code: `func (cs *State) enterPropose(height int64, round int32) {
    logger := cs.Logger.With("height", height, "round", round)

    if cs.Height != height || round < cs.Round ||
       (cs.Round == round && cstypes.RoundStepPropose <= cs.Step) {
        logger.Debug("entering propose step with invalid args",
            "current", log.NewLazySprintf("%v/%v/%v", cs.Height, cs.Round, cs.Step))
        return
    }

    defer func() {
        // Done enterPropose:
        cs.updateRoundStep(round, cstypes.RoundStepPropose)
        cs.newStep()

        // If we have the whole proposal + POL, then goto Prevote now.
        if cs.isProposalComplete() {
            cs.enterPrevote(height, cs.Round)
        }
    }()

    // If we don't get the proposal quick enough, enterPrevote
    cs.scheduleTimeout(cs.config.Propose(round), height, round,
        cstypes.RoundStepPropose)

    // Nothing more to do if we're not a validator
    if cs.privValidator == nil {
        logger.Debug("node is not a validator")
        return
    }

    address := cs.privValidatorPubKey.Address()

    if !cs.Validators.HasAddress(address) {
        logger.Debug("node is not a validator", "addr", address)
        return
    }

    if cs.isProposer(address) {
        logger.Debug("propose step; our turn to propose")
        cs.decideProposal(height, round)
    } else {
        logger.Debug("propose step; not our turn to propose",
            "proposer", cs.Validators.GetProposer().Address)
    }
}`,
    annotations: [
      { lines: [4, 8], color: 'sky', note: '가드절: Height/Round/Step 검증 — 이미 진행된 단계면 무시' },
      { lines: [11, 20], color: 'emerald', note: 'defer: Propose 완료 후 Step 갱신 → proposal 완성 시 즉시 Prevote 진입' },
      { lines: [23, 25], color: 'amber', note: 'timeoutPropose 스케줄링 — 제안이 늦으면 타임아웃으로 Prevote 진입' },
      { lines: [38, 44], color: 'violet', note: '제안자 판별: isProposer이면 decideProposal()로 블록 생성 및 브로드캐스트' },
    ],
  },
};
