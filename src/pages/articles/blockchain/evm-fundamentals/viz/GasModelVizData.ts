export const GAS_STEPS = [
  {
    label: '무한 루프 문제',
    body: '튜링 완전한 EVM에서 무한 루프 실행 시 네트워크 전체 DoS 위험',
  },
  {
    label: '가스로 실행 제한',
    body: '모든 오피코드에 가스 비용 부과 — 매 연산마다 잔여 가스 차감',
  },
  {
    label: '가스 소진 → 실행 중단',
    body: 'gasRemaining = 0이면 즉시 ErrOutOfGas — 실행 중단 + 상태 롤백',
  },
];
