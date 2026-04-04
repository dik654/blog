export const CREATE_STEPS = [
  {
    label: '① 주소 생성 — CREATE vs CREATE2',
    body: 'CREATE: keccak256(rlp(sender, nonce))[12:] — nonce에 의존하여 비결정적',
  },
  {
    label: '② init code 실행',
    body: '새 주소에 빈 계정 생성 후, 전달받은 init code를 Run()으로 실행',
  },
  {
    label: '③ 코드 크기 제한 & 배포',
    body: 'EIP-170: 런타임 코드 최대 24,576 바이트 (24KB)',
  },
  {
    label: '④ 에러 시 롤백',
    body: 'init code 실행 실패 → Snapshot으로 롤백, 계정 삭제',
  },
];

export const DELEGATE_STEPS = [
  {
    label: '① DelegateCall — 호출자 컨텍스트 유지',
    body: 'Call()과 거의 동일하지만 핵심 차이:',
  },
  {
    label: '② AsDelegate() — Contract 설정',
    body: 'NewContract 후 contract.AsDelegate() 호출',
  },
  {
    label: '③ StaticCall — 읽기 전용',
    body: 'readOnly = true로 Run() 호출',
  },
  {
    label: '④ opSelfdestruct — EIP-6780',
    body: 'Cancun 이후: 같은 트랜잭션에서 생성된 컨트랙트만 파괴 가능',
  },
];
