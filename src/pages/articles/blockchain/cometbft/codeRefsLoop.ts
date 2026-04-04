import type { CodeRef } from './codeRefsTypes';

export const loopCodeRef: Record<string, CodeRef> = {
  'receive-routine': {
    path: 'cometbft/consensus/state.go — receiveRoutine()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'receiveRoutine은 합의 상태 머신의 메인 이벤트 루프입니다.\npeerMsgQueue(P2P), internalMsgQueue(자체 투표), timeoutTicker(타임아웃)\n세 채널에서 메시지를 직렬 처리하여 상태 전이를 수행합니다.',
    code: `func (cs *State) receiveRoutine(maxSteps int) {
    defer func() {
        if r := recover(); r != nil {
            cs.Logger.Error("CONSENSUS FAILURE!!!", "err", r)
            // stop gracefully — halt chain on unexpected panic
        }
    }()

    for {
        rs := cs.RoundState
        var mi msgInfo

        select {
        case <-cs.txNotifier.TxsAvailable():
            cs.handleTxsAvailable()

        case mi = <-cs.peerMsgQueue:
            // P2P에서 수신한 메시지 (Proposal, BlockPart, Vote)
            if err := cs.wal.Write(mi); err != nil {
                cs.Logger.Error("failed writing to WAL", "err", err)
            }
            cs.handleMsg(mi)

        case mi = <-cs.internalMsgQueue:
            // 자체 생성 메시지 (서명된 투표, 검증 블록)
            if err := cs.wal.WriteSync(mi); err != nil {
                panic(fmt.Errorf("failed to write to WAL: %w", err))
            }
            cs.handleMsg(mi)

        case ti := <-cs.timeoutTicker.Chan():
            // 타임아웃 이벤트 → 다음 단계로 전환
            if err := cs.wal.Write(ti); err != nil {
                cs.Logger.Error("failed writing to WAL", "err", err)
            }
            cs.handleTimeout(ti, rs)

        case <-cs.Quit():
            return
        }
    }
}`,
    annotations: [
      { lines: [2, 6], color: 'sky', note: 'panic 복구: 합의 실패 시 체인을 안전하게 중단 (비잔틴 서명 방지)' },
      { lines: [14, 15], color: 'emerald', note: 'Mempool 알림: 새 트랜잭션 도착 시 빈 블록 대기 해제' },
      { lines: [17, 22], color: 'amber', note: 'P2P 메시지: WAL 기록 후 handleMsg()로 Proposal/Vote 처리' },
      { lines: [24, 29], color: 'violet', note: '내부 메시지: 자체 투표를 WAL에 fsync 후 처리 (크래시 안전)' },
      { lines: [31, 36], color: 'rose', note: '타임아웃: Propose/Prevote/Precommit 타임아웃 → 다음 단계 전환' },
    ],
  },
};
