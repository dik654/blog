import type { CodeRef } from '@/components/code/types';
import validateRaw from './codebase/prysm/beacon-chain/sync/validate_beacon_blocks.go?raw';
import subscriberRaw from './codebase/prysm/beacon-chain/sync/subscriber.go?raw';

export const gossipsubCodeRefs: Record<string, CodeRef> = {
  'validate-block-pubsub': {
    path: 'beacon-chain/sync/validate_beacon_blocks.go — validateBeaconBlockPubSub()',
    lang: 'go', code: validateRaw, highlight: [3, 38],
    desc: 'validateBeaconBlockPubSub — 가십으로 수신된 블록의 6단계 검증',
    annotations: [
      { lines: [7, 10], color: 'sky', note: 'SSZ-Snappy 압축 해제 + 디코딩' },
      { lines: [12, 14], color: 'emerald', note: '슬롯 범위 확인 (너무 오래된 블록 무시)' },
      { lines: [16, 19], color: 'amber', note: '제안자 서명 검증' },
      { lines: [21, 25], color: 'violet', note: '부모 블록 존재 여부 확인' },
      { lines: [27, 29], color: 'rose', note: '제안자 인덱스 검증' },
      { lines: [31, 34], color: 'sky', note: '이중 제안(equivocation) 방지' },
    ],
  },
  'subscribe-topics': {
    path: 'beacon-chain/sync/subscriber.go — subscribeStaticTopics()',
    lang: 'go', code: subscriberRaw, highlight: [3, 21],
    desc: 'subscribeStaticTopics — 블록, 어테스테이션, 싱크커미티 토픽 구독',
    annotations: [
      { lines: [5, 9], color: 'sky', note: 'beacon_block 토픽 구독' },
      { lines: [10, 14], color: 'emerald', note: 'attestation 서브넷 구독' },
      { lines: [15, 20], color: 'amber', note: 'sync_committee 서브넷 구독' },
    ],
  },
  'message-handler': {
    path: 'beacon-chain/sync/subscriber.go — subscribe()',
    lang: 'go', code: subscriberRaw, highlight: [23, 41],
    desc: 'subscribe — 포크 다이제스트 프리픽스 + 토픽 등록 + 메시지 핸들러 루프',
    annotations: [
      { lines: [29, 32], color: 'sky', note: '현재 포크 다이제스트 조회' },
      { lines: [34, 34], color: 'emerald', note: '토픽 이름 = format + digest' },
      { lines: [35, 39], color: 'amber', note: '구독 + 메시지 핸들러 고루틴 시작' },
    ],
  },
};
