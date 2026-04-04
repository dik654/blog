import type { CodeRef } from '@/components/code/types';

export const handleMsgRefs: Record<string, CodeRef> = {
  'handle-msg': {
    path: 'consensus/state.go — handleMsg()',
    lang: 'go',
    highlight: [1, 3],
    desc: 'handleMsg — 메시지 타입별 디스패치.\nProposal → 제안 저장, BlockPart → 블록 조립, Vote → tryAddVote로 집계.',
    code: `func (cs *State) handleMsg(mi msgInfo) {
    cs.mtx.Lock()
    defer cs.mtx.Unlock()

    msg, peerID := mi.Msg, mi.PeerID

    switch msg := msg.(type) {
    case *ProposalMessage:
        // 제안 저장 (높이/라운드 검증)
        err = cs.defaultSetProposal(msg.Proposal)

    case *BlockPartMessage:
        // 블록 파트 수신 → 전체 블록 조립
        added, err = cs.addProposalBlockPart(msg, peerID)
        if added && cs.Step <= cstypes.RoundStepPropose &&
           cs.isProposalComplete() {
            cs.enterPrevote(cs.Height, cs.Round)
        }

    case *VoteMessage:
        // 투표 집계 → +2/3 감지 시 상태 전이
        added, err = cs.tryAddVote(msg.Vote, peerID)
    }
}`,
    annotations: [
      { lines: [2, 3], color: 'sky',
        note: '뮤텍스 잠금: handleMsg 내 상태 변경을 직렬화' },
      { lines: [8, 10], color: 'emerald',
        note: 'Proposal: 서명·높이·라운드 검증 후 저장' },
      { lines: [12, 18], color: 'amber',
        note: 'BlockPart: PartSet 조립 → 완성 + Propose 단계면 즉시 enterPrevote' },
      { lines: [20, 23], color: 'violet',
        note: 'Vote: tryAddVote → addVote → +2/3 감지 시 enterPrecommit/enterCommit' },
    ],
  },
  'handle-timeout': {
    path: 'consensus/state.go — handleTimeout()',
    lang: 'go',
    highlight: [1, 3],
    desc: 'handleTimeout — 단계별 타임아웃 처리.\n각 타임아웃이 다음 단계 진입을 트리거.',
    code: `func (cs *State) handleTimeout(
    ti timeoutInfo, rs cstypes.RoundState,
) {
    // 현재 높이/라운드/단계와 일치하는 타임아웃만 처리
    if ti.Height != rs.Height || ti.Round < rs.Round ||
       (ti.Round == rs.Round && ti.Step < rs.Step) {
        return
    }

    cs.mtx.Lock()
    defer cs.mtx.Unlock()

    switch ti.Step {
    case cstypes.RoundStepNewHeight:
        cs.enterNewRound(ti.Height, 0)

    case cstypes.RoundStepNewRound:
        cs.enterPropose(ti.Height, 0)

    case cstypes.RoundStepPropose:
        // 제안 타임아웃 → nil prevote
        cs.enterPrevote(ti.Height, ti.Round)

    case cstypes.RoundStepPrevoteWait:
        // prevote 수집 타임아웃
        cs.enterPrecommit(ti.Height, ti.Round)

    case cstypes.RoundStepPrecommitWait:
        // precommit 수집 타임아웃 → 다음 라운드
        cs.enterPrecommit(ti.Height, ti.Round)
        cs.enterNewRound(ti.Height, ti.Round+1)
    }
}`,
    annotations: [
      { lines: [4, 8], color: 'sky',
        note: '가드절: 과거 높이/라운드의 타임아웃은 무시' },
      { lines: [15, 16], color: 'emerald',
        note: 'NewHeight: 다음 블록 높이의 첫 라운드 시작' },
      { lines: [20, 22], color: 'amber',
        note: 'Propose 타임아웃: 제안이 안 오면 nil prevote로 진행' },
      { lines: [24, 30], color: 'violet',
        note: 'PrevoteWait/PrecommitWait: 투표 수집 실패 → 다음 단계/라운드로 전환' },
    ],
  },
};
