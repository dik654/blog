import type { CodeRef } from './codeRefsTypes';

export const gossipCodeRef: Record<string, CodeRef> = {
  'gossip-routines': {
    path: 'cometbft/consensus/reactor.go — AddPeer() + gossip',
    lang: 'go',
    highlight: [1, 3],
    desc: '새 피어 연결 시 3개의 고루틴이 생성됩니다.\ngossipDataRoutine(블록 전파), gossipVotesRoutine(투표 전파),\nqueryMaj23Routine(+2/3 다수결 쿼리 — DDoS 방어용).',
    code: `func (conR *Reactor) AddPeer(peer p2p.Peer) {
    if !conR.IsRunning() { return }

    peerState := peer.Get(types.PeerStateKey).(*PeerState)
    // Begin routines for this peer.
    go conR.gossipDataRoutine(peer, peerState)
    go conR.gossipVotesRoutine(peer, peerState)
    go conR.queryMaj23Routine(peer, peerState)

    if !conR.WaitSync() {
        conR.sendNewRoundStepMessage(peer)
    }
}

func (conR *Reactor) GetChannels() []*p2p.ChannelDescriptor {
    return []*p2p.ChannelDescriptor{
        { ID: StateChannel,       Priority: 6  },  // 0x20
        { ID: DataChannel,        Priority: 10 },  // 0x21
        { ID: VoteChannel,        Priority: 7  },  // 0x22
        { ID: VoteSetBitsChannel, Priority: 1  },  // 0x23
    }
}

func (conR *Reactor) gossipDataRoutine(peer p2p.Peer, ps *PeerState) {
    for {
        if !peer.IsRunning() || !conR.IsRunning() { return }
        rs := conR.getRoundState()
        prs := ps.GetRoundState()

        // Send block part if peer needs it
        if part, ok := pickPartToSend(logger, conR.conS.blockStore,
            &rs, ps, prs); part != nil {
            ps.SendPartSetHasPart(part, prs)
            continue
        }

        // Send proposal if peer doesn't have it
        if rs.Height == prs.Height && rs.Round == prs.Round &&
           rs.Proposal != nil && !prs.Proposal {
            ps.SendProposalSetHasProposal(logger, &rs, prs)
            continue
        }

        time.Sleep(conR.conS.config.PeerGossipSleepDuration)
    }
}`,
    annotations: [
      { lines: [5, 8], color: 'sky', note: '피어당 3개 고루틴: Data(블록), Votes(투표), Maj23(쿼리)' },
      { lines: [15, 21], color: 'emerald', note: '4개 P2P 채널: DataChannel이 최고 Priority(10)로 블록 전파 우선' },
      { lines: [25, 27], color: 'amber', note: 'gossip 루프: 피어/자신이 중지되면 고루틴 종료' },
      { lines: [30, 34], color: 'violet', note: '블록 파트 전파: 피어가 필요한 파트를 선택하여 전송' },
      { lines: [37, 41], color: 'rose', note: 'Proposal 전파: 같은 Height/Round인 피어에게 제안 전송' },
    ],
  },
};
