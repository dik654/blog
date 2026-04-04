export const C = { conn: '#6366f1', switch: '#10b981', reactor: '#f59e0b', err: '#ef4444', ok: '#8b5cf6' };

export const STEPS = [
  {
    label: '합의·TX·블록을 노드 간 전파해야 함',
    body: '합의 메시지, TX, 증거를 P2P 네트워크로 교환하는 통신 스택',
  },
  {
    label: '문제: 여러 프로토콜을 하나의 TCP에',
    body: '하나의 TCP에 채널 다중화 — 각 채널에 ID와 우선순위 부여',
  },
  {
    label: 'MConnection — 채널 다중화',
    body: 'sendRoutine이 우선순위로 채널 선택·전송, recvRoutine이 channelID로 라우팅',
  },
  {
    label: 'Switch — 피어 연결 관리',
    body: 'Reactor 등록 후 reactorsByCh로 매핑, DialPeersAsync로 피어 비동기 연결',
  },
  {
    label: 'Reactor — 서브시스템 메시지 핸들러',
    body: 'Consensus(vote), Mempool(TX), Evidence(증거) — 서브시스템별 Reactor',
  },
];

/** step index → codeRef key (null = no code for that step) */
export const STEP_KEYS: (string | null)[] = [null, null, 'mconn-struct', 'switch-struct', 'peer-struct'];

/** step index → code label */
export const STEP_LABELS: string[] = [
  '', '', 'connection.go — MConnection', 'switch.go — Switch', 'peer.go — peer',
];
