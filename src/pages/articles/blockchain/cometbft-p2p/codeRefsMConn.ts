import type { CodeRef } from '@/components/code/types';
import connectionGo from './codebase/cometbft/p2p/conn/connection.go?raw';

export const mconnRefs: Record<string, CodeRef> = {
  'mconn-struct': {
    path: 'p2p/conn/connection.go', code: connectionGo, lang: 'go',
    highlight: [25, 52],
    desc: 'MConnection 구조체 — 단일 TCP 위 채널 다중화의 핵심 필드',
    annotations: [
      { lines: [29, 30], color: 'sky', note: 'conn/bufConn: 실제 TCP 소켓과 버퍼. bufio로 감싸 시스템콜 횟수를 줄임' },
      { lines: [31, 32], color: 'emerald', note: 'sendMonitor/recvMonitor: flowrate.Monitor로 대역폭 제한 (기본 500KB/s)' },
      { lines: [35, 36], color: 'amber', note: 'channels/channelsIdx: 채널 배열 + byte ID → *Channel 맵. O(1) 라우팅' },
      { lines: [37, 38], color: 'violet', note: 'onReceive/onError: 콜백 — Switch가 등록. 메시지 완성 시 Reactor로 전달' },
    ],
  },
  'mconn-onstart': {
    path: 'p2p/conn/connection.go', code: connectionGo, lang: 'go',
    highlight: [55, 66],
    desc: 'OnStart() — 타이머 초기화 후 sendRoutine + recvRoutine 고루틴 생성',
    annotations: [
      { lines: [56, 60], color: 'sky', note: '4개 타이머 초기화: flush(쓰기 모음), ping(생존확인), stats(채널통계), pong(응답대기)' },
      { lines: [61, 63], color: 'emerald', note: 'quit/done 채널 생성: 종료 시그널 전달용. stopServices()에서 close()' },
      { lines: [64, 65], color: 'amber', note: 'go sendRoutine() + go recvRoutine(): 여기서 실제 I/O 루프 시작' },
    ],
  },
  'mconn-send-routine': {
    path: 'p2p/conn/connection.go', code: connectionGo, lang: 'go',
    highlight: [68, 93],
    desc: 'sendRoutine — select 루프로 flush/ping/send 이벤트 처리',
    annotations: [
      { lines: [72, 73], color: 'sky', note: 'flushTimer: FlushThrottle(10ms)마다 bufConnWriter.Flush() — 쓰기 배치 처리' },
      { lines: [79, 84], color: 'emerald', note: 'pingTimer: PingInterval(60s)마다 Ping 전송 → PongTimeout(45s) 타이머 시작' },
      { lines: [85, 89], color: 'amber', note: 'c.send 채널: Send()/TrySend()가 신호 → sendSomePacketMsgs()로 채널별 전송' },
    ],
  },
  'mconn-select-channel': {
    path: 'p2p/conn/connection.go', code: connectionGo, lang: 'go',
    highlight: [96, 110],
    desc: 'selectChannelToGossipOn — recentlySent/priority 비율이 최소인 채널 선택',
    annotations: [
      { lines: [100, 102], color: 'sky', note: 'isSendPending(): sendQueue에 데이터가 있는 채널만 후보' },
      { lines: [104, 107], color: 'emerald', note: 'ratio = recentlySent / priority — 우선순위 높을수록 분모 커서 더 자주 선택됨' },
    ],
  },
  'mconn-recv-routine': {
    path: 'p2p/conn/connection.go', code: connectionGo, lang: 'go',
    highlight: [113, 139],
    desc: 'recvRoutine — 패킷 수신 → 타입별 분기 → onReceive 콜백',
    annotations: [
      { lines: [116, 117], color: 'sky', note: 'recvMonitor.Limit(): RecvRate 제한. 초과 시 블로킹으로 악의적 피어 대역폭 공격 방어' },
      { lines: [118, 120], color: 'emerald', note: 'protoReader.ReadMsg(): Protobuf 패킷 읽기. Ping/Pong/PacketMsg 3종류' },
      { lines: [127, 133], color: 'amber', note: 'PacketMsg: channelsIdx[channelID]로 채널 조회 → recvPacketMsg() 조각 재조립' },
      { lines: [134, 135], color: 'violet', note: 'onReceive(channelID, msgBytes): 메시지 완성 시 콜백 — 같은 고루틴에서 실행!' },
    ],
  },
};
