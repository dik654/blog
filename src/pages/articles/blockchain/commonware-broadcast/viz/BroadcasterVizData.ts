export const STEPS = [
  { label: 'Broadcaster trait: 전파 인터페이스',
    body: 'Recipients · Message · Response 세 연관 타입으로 비동기 broadcast 추상화' },
  { label: 'Buffered Engine: select_loop!',
    body: 'select_loop!로 Mailbox + 네트워크 + 피어 변경을 동시 처리, LRU 캐시 관리' },
  { label: 'Mailbox: Broadcaster 구현체',
    body: 'Engine의 외부 API — Mailbox가 Broadcaster trait 구현, 소비자는 trait만 의존' },
];

export const STEP_REFS: Record<number, string> = {
  0: 'broadcaster-trait',
  1: 'buffered-engine',
  2: 'buffered-ingress',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'lib.rs — Broadcaster trait',
  1: 'engine.rs — Buffered Engine',
  2: 'ingress.rs — Mailbox',
};
