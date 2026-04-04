import type { CodeRef } from '@/components/code/types';

export const loopRefs: Record<string, CodeRef> = {
  'receive-routine': {
    path: 'consensus/state.go — receiveRoutine()',
    lang: 'go',
    highlight: [1, 5],
    desc: 'receiveRoutine — 합의 전체를 하나의 goroutine에서 직렬 처리.\n3개 채널(peer·internal·timeout)에서 메시지를 받아 handleMsg/handleTimeout으로 디스패치.',
    code: `func (cs *State) receiveRoutine(maxSteps int) {
    defer func() {
        if r := recover(); r != nil {
            cs.Logger.Error("CONSENSUS FAILURE!!!",
                "err", r, "stack", string(debug.Stack()))
        }
    }()

    for {
        rs := cs.RoundState
        var mi msgInfo

        select {
        case <-cs.txNotifier.TxsAvailable():
            cs.handleTxsAvailable()

        case mi = <-cs.peerMsgQueue:
            // P2P 수신 메시지 — WAL 비동기 기록 후 디스패치
            cs.wal.Write(mi)
            cs.handleMsg(mi)

        case mi = <-cs.internalMsgQueue:
            // 자신의 투표 — WAL 동기 기록(fsync) 후 디스패치
            cs.wal.WriteSync(mi)
            cs.handleMsg(mi)

        case ti := <-cs.timeoutTicker.Chan():
            // 타임아웃 이벤트 → handleTimeout
            cs.wal.Write(ti)
            cs.handleTimeout(ti, rs)

        case <-cs.Quit():
            return
        }
    }
}`,
    annotations: [
      { lines: [2, 7], color: 'sky',
        note: 'panic 복구: 합의 실패 시 체인을 안전하게 중단 — 비잔틴 서명 방지' },
      { lines: [17, 21], color: 'emerald',
        note: 'peerMsgQueue: P2P에서 수신한 Proposal/Vote/BlockPart. WAL 비동기 기록' },
      { lines: [23, 26], color: 'amber',
        note: 'internalMsgQueue: 자신의 투표. WriteSync로 fsync — 크래시 후 이중 서명 방지' },
      { lines: [28, 31], color: 'violet',
        note: 'timeoutTicker: Propose/Prevote/Precommit 타임아웃 → 다음 단계 전환' },
    ],
  },
};
