export const ARCH_STEPS = [
  {
    label: 'Highway — 저지연 합의 레이어',
    body: 'HotStuff 유사 리더 기반 합의',
  },
  {
    label: 'Lanes — 고처리량 데이터 레이어',
    body: 'DAG 구조로 트랜잭션 병렬 전파 — Reliable Broadcast로 가용성 보장',
  },
  {
    label: 'Ride-Sharing — 메시지 피기백',
    body: '합의 메시지(Highway)를 데이터 메시지(Lane cars)에 피기백',
  },
];

export const BLIP_STEPS = [
  {
    label: '전통적 BFT (PBFT, HotStuff)',
    body: '정상 시: 저지연 합의 — Blip 발생 → View Change 프로토콜 → 긴 복구 시간 (Hangover)',
  },
  {
    label: 'DAG 기반 BFT (Bullshark)',
    body: '정상 시: DAG 오버헤드로 지연 높음',
  },
  {
    label: 'Autobahn — 두 장점 결합',
    body: '정상 시: Highway로 저지연 (3 msg delays)',
  },
];
