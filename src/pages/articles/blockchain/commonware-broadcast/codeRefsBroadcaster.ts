import type { CodeRef } from '@/components/code/types';
import traitRs from './codebase/commonware/broadcast_traits.rs?raw';
import engineRs from './codebase/commonware/buffered_engine.rs?raw';
import ingressRs from './codebase/commonware/buffered_ingress.rs?raw';

export const codeRefsBroadcaster: Record<string, CodeRef> = {
  'broadcaster-trait': {
    path: 'broadcast/src/lib.rs', code: traitRs, lang: 'rust',
    highlight: [4, 24],
    desc: 'Broadcaster trait: Recipients/Message/Response 세 연관 타입.\n메시지 전파의 최소 인터페이스 — 구현체가 네트워크 전송 방식 결정.',
    annotations: [
      { lines: [4, 7], color: 'sky', note: 'Broadcaster trait — 세 연관 타입: Recipients(수신자), Message(직렬화), Response(응답)' },
      { lines: [18, 24], color: 'emerald', note: 'broadcast() → oneshot::Receiver<Response> 반환. 비동기 결과 수신' },
    ],
  },
  'buffered-engine': {
    path: 'broadcast/src/buffered/engine.rs', code: engineRs, lang: 'rust',
    highlight: [5, 18],
    desc: 'Engine — 메시지 캐싱 + 네트워크 수신 + 요청 처리의 핵심 런루프.\n피어별 LRU deque로 메모리 제한, refcount로 중복 제거.',
    annotations: [
      { lines: [5, 18], color: 'sky', note: 'Engine 필드: items(전역 캐시) + deques(피어별 LRU) + counts(refcount)' },
      { lines: [21, 42], color: 'emerald', note: 'select_loop! — mailbox(Broadcast/Subscribe/Get) + network + peer 변경 동시 처리' },
    ],
  },
  'buffered-ingress': {
    path: 'broadcast/src/buffered/ingress.rs', code: ingressRs, lang: 'rust',
    highlight: [2, 20],
    desc: 'Mailbox — Engine의 외부 API. Broadcaster trait를 구현.\n메시지 타입 3종: Broadcast(전파), Subscribe(대기), Get(조회).',
    annotations: [
      { lines: [2, 20], color: 'sky', note: 'Message enum — Broadcast/Subscribe/Get 세 종류. 각각 oneshot 응답 채널 포함' },
      { lines: [28, 42], color: 'amber', note: 'Mailbox가 Broadcaster trait 구현 — 외부에서는 trait만 보면 됨' },
    ],
  },
};
