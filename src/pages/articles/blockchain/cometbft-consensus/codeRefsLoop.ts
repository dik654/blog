import type { CodeRef } from "@/components/code/types";

export const loopRefs: Record<string, CodeRef> = {
  "receive-routine": {
    path: "consensus/state.go — receiveRoutine()",
    lang: "go",
    highlight: [1, 5],
    desc: "receiveRoutine — RoundState를 바꾸는 주요 합의 이벤트를 한 loop에서 직렬 처리.\npeer·internal·timeout 채널의 메시지를 받아 handleMsg/handleTimeout으로 디스패치한다.",
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
      {
        lines: [2, 7],
        color: "sky",
        note: "panic을 기록하고 loop를 종료하는 장애 경계. 서명 안전성 자체를 대신하지는 않는다",
      },
      {
        lines: [17, 21],
        color: "emerald",
        note: "peerMsgQueue: P2P에서 수신한 Proposal/Vote/BlockPart. WAL 비동기 기록",
      },
      {
        lines: [23, 26],
        color: "amber",
        note: "internalMsgQueue: 로컬 메시지를 상태 전이 전에 동기 WAL 기록해 crash recovery를 돕는다",
      },
      {
        lines: [28, 31],
        color: "violet",
        note: "timeoutTicker: Propose/Prevote/Precommit 타임아웃 → 다음 단계 전환",
      },
    ],
  },
};
