import type { CodeRef } from './codeRefsTypes';

export const handleMsgCodeRef: Record<string, CodeRef> = {
  'handle-msg': {
    path: 'cometbft/consensus/state.go — handleMsg()',
    lang: 'go',
    highlight: [1, 3],
    desc: 'handleMsg는 수신된 메시지를 타입별로 분기 처리합니다.\nProposal → 제안 저장, BlockPart → 블록 파트 조립, Vote → addVote로 집계.\naddVote에서 +2/3 감지 시 상태 전이가 트리거됩니다.',
    code: `func (cs *State) handleMsg(mi msgInfo) {
    cs.mtx.Lock()
    defer cs.mtx.Unlock()

    msg, peerID := mi.Msg, mi.PeerID

    switch msg := msg.(type) {
    case *ProposalMessage:
        // 제안 저장 (높이/라운드 매칭 검증)
        err = cs.defaultSetProposal(msg.Proposal)

    case *BlockPartMessage:
        // 블록 파트 수신 → 전체 블록 조립 시도
        added, err = cs.addProposalBlockPart(msg, peerID)
        if added {
            cs.statsMsgQueue <- mi
        }

    case *VoteMessage:
        // 투표 집계 → +2/3 도달 시 상태 전이 트리거
        added, err = cs.tryAddVote(msg.Vote, peerID)
        if added {
            cs.statsMsgQueue <- mi
        }

    case *ingestVerifiedBlockRequest:
        // BlockSync에서 검증된 블록 주입
        cs.handleIngestVerifiedBlockRequest(msg)
    }
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: '뮤텍스 잠금: 상태 머신은 단일 스레드 직렬 처리 보장' },
      { lines: [8, 10], color: 'emerald', note: 'Proposal: 서명 검증 후 저장 → 블록 파트 수신 대기' },
      { lines: [12, 16], color: 'amber', note: 'BlockPart: PartSet 조립 → 완성 시 handleCompleteProposal 호출' },
      { lines: [19, 23], color: 'violet', note: 'Vote: addVote → +2/3 감지 시 enterPrevote/enterPrecommit 호출' },
      { lines: [26, 28], color: 'rose', note: 'BlockSync 블록 주입: 외부에서 검증된 블록을 직접 커밋' },
    ],
  },
};
