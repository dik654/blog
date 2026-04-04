import type { CodeRef } from '@/components/code/types';
import serviceRaw from './codebase/prysm/beacon-chain/p2p/service.go?raw';
import scorerRaw from './codebase/prysm/beacon-chain/p2p/peers/scorers/service.go?raw';

export const p2pStartCodeRefs: Record<string, CodeRef> = {
  'p2p-start': {
    path: 'beacon-chain/p2p/service.go — Start()',
    lang: 'go', code: serviceRaw, highlight: [3, 31],
    desc: 'Start — libp2p 호스트 시작, Discv5 리스너 초기화, 토픽 구독',
    annotations: [
      { lines: [8, 13], color: 'sky', note: 'Discv5 UDP 리스너 초기화' },
      { lines: [16, 23], color: 'emerald', note: 'libp2p.New: Noise 전송 + ConnectionGater' },
      { lines: [26, 27], color: 'amber', note: 'RPC 핸들러 등록 + GossipSub 토픽 구독' },
      { lines: [30, 30], color: 'violet', note: '피어 매니저 루프 (스코어링 + 프루닝)' },
    ],
  },
  'discv5-init': {
    path: 'beacon-chain/p2p/service.go — initDiscoveryV5()',
    lang: 'go', code: serviceRaw, highlight: [34, 41],
    desc: 'initDiscoveryV5 — UDP 기반 Discv5 리스너를 생성하고 부트노드로 탐색 시작',
    annotations: [
      { lines: [36, 38], color: 'sky', note: '로컬 키 + 부트노드 설정' },
      { lines: [40, 40], color: 'emerald', note: 'ListenV5: UDP 소켓 바인딩 + 탐색 시작' },
    ],
  },
  'peer-score': {
    path: 'beacon-chain/p2p/peers/scorers/service.go — Score()',
    lang: 'go', code: scorerRaw, highlight: [3, 18],
    desc: 'Score — Gossip·Block·Status·BadResponse 4가지 스코어를 합산',
    annotations: [
      { lines: [10, 10], color: 'sky', note: 'GossipSub 토픽 스코어' },
      { lines: [12, 12], color: 'emerald', note: '블록 제공 속도 & 정확도' },
      { lines: [14, 14], color: 'amber', note: '체인 헤드, Finalized 에폭 일치도' },
      { lines: [16, 16], color: 'rose', note: '잘못된 응답 패널티' },
    ],
  },
  'peer-decay': {
    path: 'beacon-chain/p2p/peers/scorers/service.go — Decay()',
    lang: 'go', code: scorerRaw, highlight: [21, 28],
    desc: 'Decay — 시간 경과에 따라 스코어를 지수적으로 감쇠',
    annotations: [
      { lines: [24, 27], color: 'violet', note: '모든 스코어러에 Decay 적용' },
    ],
  },
};
