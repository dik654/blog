import type { CodeRef } from './codeRefsTypes';

export const receiveCodeRef: Record<string, CodeRef> = {
  'reactor-receive': {
    path: 'cometbft/consensus/reactor.go — Receive()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'Reactor.Receive는 P2P 채널별 메시지 수신 핸들러입니다.\nStateChannel(라운드 상태), DataChannel(제안/블록), VoteChannel(투표),\nVoteSetBitsChannel(투표 비트맵)로 분기하여 처리합니다.',
    code: `func (conR *Reactor) Receive(e p2p.Envelope) {
    if !conR.IsRunning() { return }

    msg, err := MsgFromProto(e.Message)
    if err != nil {
        conR.Switch.StopPeerForError(e.Src, err)
        return
    }
    if err = msg.ValidateBasic(); err != nil {
        conR.Switch.StopPeerForError(e.Src, err)
        return
    }

    ps, ok := e.Src.Get(types.PeerStateKey).(*PeerState)

    switch e.ChannelID {
    case StateChannel:
        switch msg := msg.(type) {
        case *NewRoundStepMessage:
            ps.ApplyNewRoundStepMessage(msg)
            conR.conS.statsMsgQueue <- msgInfo{msg, e.Src.ID()}
        case *HasVoteMessage:
            ps.ApplyHasVoteMessage(msg)
        case *VoteSetMaj23Message:
            votes.SetPeerMaj23(msg.Round, msg.Type, ps.peer.ID(), msg.BlockID)
        }

    case DataChannel:
        switch msg := msg.(type) {
        case *ProposalMessage:
            ps.SetHasProposal(msg.Proposal)
            conR.conS.peerMsgQueue <- msgInfo{msg, e.Src.ID()}
        case *BlockPartMessage:
            ps.SetHasProposalBlockPart(msg.Height, msg.Round, int(msg.Part.Index))
            conR.conS.peerMsgQueue <- msgInfo{msg, e.Src.ID()}
        }

    case VoteChannel:
        switch msg := msg.(type) {
        case *VoteMessage:
            ps.SetHasVoteFromPeer(msg.Vote, height, valSize, lastCommitSize)
            conR.conS.peerMsgQueue <- msgInfo{msg, e.Src.ID()}
        }

    case VoteSetBitsChannel:
        switch msg := msg.(type) {
        case *VoteSetBitsMessage:
            ps.ApplyVoteSetBitsMessage(msg, ourVotes)
        }
    }
}`,
    annotations: [
      { lines: [3, 11], color: 'sky', note: '메시지 디코딩 + 기본 검증 실패 시 피어 연결 차단' },
      { lines: [16, 26], color: 'emerald', note: 'StateChannel(0x20): 라운드 상태 동기화 — PeerState만 업데이트' },
      { lines: [28, 36], color: 'amber', note: 'DataChannel(0x21): 제안/블록파트 → peerMsgQueue로 전달' },
      { lines: [38, 43], color: 'violet', note: 'VoteChannel(0x22): 투표 메시지 → peerMsgQueue → addVote 처리' },
      { lines: [45, 49], color: 'rose', note: 'VoteSetBitsChannel(0x23): 투표 비트맵 교환 (Liveness 보조)' },
    ],
  },
};
