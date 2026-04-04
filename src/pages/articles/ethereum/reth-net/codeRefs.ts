import type { CodeRef } from '@/components/code/types';

import sessionRs from './codebase/reth/session.rs?raw';
import ethWireRs from './codebase/reth/eth_wire.rs?raw';
import discoveryRs from './codebase/reth/discovery.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'net-session': {
    path: 'reth/crates/net/network/src/session/mod.rs',
    code: sessionRs,
    lang: 'rust',
    highlight: [8, 17],
    desc: 'SessionManager — 모든 피어 TCP 세션을 관리. tokio 비동기 런타임 위에서 수천 세션을 단일 이벤트 루프로 처리.',
    annotations: [
      { lines: [10, 13], color: 'sky', note: 'active + pending 세션 맵' },
      { lines: [14, 17], color: 'emerald', note: 'mpsc 채널 + max_sessions 제한' },
      { lines: [20, 26], color: 'amber', note: 'SessionEvent — 연결/해제/메시지 이벤트' },
    ],
  },
  'net-eth-wire': {
    path: 'reth/crates/net/eth-wire-types/src/message.rs',
    code: ethWireRs,
    lang: 'rust',
    highlight: [8, 34],
    desc: 'EthMessage enum — eth/68 프로토콜 전체 메시지 타입. Status, NewBlockHashes, Transactions 등 RLP 인코딩 자동 지원.',
    annotations: [
      { lines: [11, 12], color: 'sky', note: 'Status — 피어 상태 교환 (체인 ID, 제네시스)' },
      { lines: [14, 17], color: 'emerald', note: 'TX 전파 — 전체 데이터 또는 해시만 전송' },
      { lines: [19, 28], color: 'amber', note: '블록/TX/영수증 요청-응답 쌍' },
    ],
  },
  'net-discovery': {
    path: 'reth/crates/net/discv4/src/lib.rs',
    code: discoveryRs,
    lang: 'rust',
    highlight: [8, 15],
    desc: 'Discv4 — UDP 기반 Kademlia DHT 노드 디스커버리. FIND_NODE 반복으로 새 피어 탐색.',
    annotations: [
      { lines: [10, 15], color: 'sky', note: 'UdpSocket + KBucketsTable + bootnodes' },
      { lines: [18, 25], color: 'emerald', note: 'lookup — target에 가까운 노드 반복 탐색' },
      { lines: [28, 31], color: 'amber', note: 'refresh_buckets — 주기적 랜덤 lookup' },
    ],
  },
};
