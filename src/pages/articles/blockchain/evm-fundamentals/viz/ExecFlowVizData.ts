export const FLOW_STEPS = [
  {
    label: '① preCheck — 트랜잭션 유효성 검증',
    body: 'nonce가 StateDB의 값과 일치하는지 확인',
  },
  {
    label: '② IntrinsicGas — 기본 가스 차감',
    body: '일반 전송 21,000 / 컨트랙트 생성 53,000',
  },
  {
    label: '③ EVM.Call() — 실행 프레임 생성',
    body: '호출 깊이 1024 제한 확인 — StateDB.Snapshot()으로 현재 상태 저장',
  },
  {
    label: '④ Run() — 인터프리터 메인 루프',
    body: 'ScopeContext(Memory, Stack, Contract) 생성',
  },
  {
    label: '⑤ Refund — 가스 환불 & 수수료 정산',
    body: '환불량 = min(누적 환불, 사용 가스의 1/5) — EIP-3529',
  },
];
