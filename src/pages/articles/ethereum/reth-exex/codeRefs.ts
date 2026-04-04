import type { CodeRef } from '@/components/code/types';
import exexSrc from './codebase/reth/exex.rs?raw';
import exampleSrc from './codebase/reth/example.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'exex-notification': {
    path: 'reth-exex/src/notification.rs', lang: 'rust', highlight: [3, 11],
    desc: 'ExExNotification — 체인 이벤트 3종: Committed, Reverted, Reorged',
    annotations: [
      { lines: [5, 5], color: 'sky', note: 'ChainCommitted — 새 블록이 정상 추가됨' },
      { lines: [7, 7], color: 'amber', note: 'ChainReverted — 리오그로 블록이 되돌려짐' },
      { lines: [9, 9], color: 'rose', note: 'ChainReorged — old 제거 + new 교체' },
    ],
    code: exexSrc,
  },
  'exex-context': {
    path: 'reth-exex/src/context.rs', lang: 'rust', highlight: [14, 22],
    desc: 'ExExContext — 노드 내부 리소스(provider, pool, notifications)에 접근',
    annotations: [
      { lines: [16, 17], color: 'sky', note: 'head, config — 현재 체인 상태' },
      { lines: [18, 19], color: 'emerald', note: 'provider, pool — 상태 조회 & TX풀 접근' },
      { lines: [20, 21], color: 'violet', note: 'notifications — 이벤트 수신 채널' },
    ],
    code: exexSrc,
  },
  'exex-manager': {
    path: 'reth-exex/src/manager.rs', lang: 'rust', highlight: [25, 42],
    desc: 'ExExManager — 등록된 ExEx들에 알림을 fan-out으로 전달',
    annotations: [
      { lines: [26, 28], color: 'sky', note: 'handles + finished_height 추적' },
      { lines: [32, 35], color: 'emerald', note: 'send_notification — 모든 ExEx에 clone 전송' },
      { lines: [38, 42], color: 'amber', note: 'min_finished_height — 프루닝 기준점' },
    ],
    code: exexSrc,
  },
  'exex-example': {
    path: 'reth-exex/examples/indexer.rs', lang: 'rust', highlight: [3, 32],
    desc: 'ExEx 예제 — 블록 이벤트를 수신하여 트랜잭션/로그 인덱싱',
    annotations: [
      { lines: [7, 8], color: 'sky', note: 'notifications 스트림에서 이벤트 대기' },
      { lines: [10, 17], color: 'emerald', note: 'ChainCommitted → 블록/TX/로그 인덱싱' },
      { lines: [19, 21], color: 'amber', note: 'ChainReverted → 인덱스 롤백' },
      { lines: [25, 29], color: 'violet', note: 'FinishedHeight 시그널 → 프루닝 허용' },
    ],
    code: exampleSrc,
  },
};
