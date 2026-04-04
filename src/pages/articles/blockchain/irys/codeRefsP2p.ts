import type { CodeRef } from '@/components/code/types';

import peerServiceRs from './codebase/irys/crates/p2p/src/peer_network_service.rs?raw';

export const p2pRefs: Record<string, CodeRef> = {
  'irys-peer-service': {
    path: 'crates/p2p/src/peer_network_service.rs',
    code: peerServiceRs,
    lang: 'rust',
    highlight: [1, 26],
    desc: 'PeerNetworkService는 피어 연결, 핸드셰이크, 헬스 체크를 관리합니다. Tokio 비동기 채널 기반으로 메시지를 수신하며, PeerList와 GossipClient를 조합합니다.',
    annotations: [
      { lines: [1, 14], color: 'sky', note: '주요 임포트 — GossipClient, PeerList 등' },
      { lines: [28, 30], color: 'emerald', note: '상수 — 플러시/헬스체크 주기' },
    ],
  },
  'irys-peer-handshake': {
    path: 'crates/p2p/src/peer_network_service.rs',
    code: peerServiceRs,
    lang: 'rust',
    highlight: [32, 48],
    desc: '피어 핸드셰이크와 메시지 전송 유틸리티입니다. VersionRequest 기반 프로토콜 호환성 확인 후 피어를 등록합니다.',
    annotations: [
      { lines: [32, 34], color: 'sky', note: '에러 로깅 유틸 함수' },
      { lines: [44, 48], color: 'emerald', note: 'ServiceHandleWithShutdownSignal 패턴' },
    ],
  },
};
