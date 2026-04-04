export const C = { nonce: '#6366f1', funds: '#f59e0b', sig: '#10b981' };

export const STEPS = [
  {
    label: 'require(op.nonce == account.nonce, "AA25")',
    body: 'UserOp의 nonce와 EntryPoint에 저장된 계정 nonce를 비교합니다.\n불일치하면 AA25 에러로 거부합니다.',
  },
  {
    label: 'account.nonce++ (7 → 8)',
    body: 'nonce를 즉시 증가시켜 같은 UserOp의 재사용을 방지합니다.\n검증 실패해도 nonce는 증가된 상태를 유지합니다.',
  },
  {
    label: 'missingFunds = maxFee * gasLimit - deposit',
    body: '실행에 필요한 최대 가스비에서 기존 예치금을 뺀 부족분을 계산합니다.\n부족분이 있으면 스마트 계정이 추가 입금해야 합니다.',
  },
  {
    label: 'validationData = account.validateUserOp(op, hash, funds)',
    body: '스마트 계정의 validateUserOp()에 검증을 위임합니다.\nPQ 계정은 여기서 ECDSA + Dilithium 하이브리드 서명을 검증합니다.',
  },
  {
    label: 'require(validationData == 0, "AA24") — 서명 유효',
    body: '반환값 0은 서명이 유효함을 의미합니다.\n0이 아니면 AA24 에러로 해당 UserOp를 거부합니다.',
  },
];
