export const C = { chain: '#6366f1', sig: '#0ea5e9', nonce: '#f59e0b', bal: '#10b981', gas: '#8b5cf6', err: '#ef4444' };

export const STEPS = [
  {
    label: 'validate() 검증 체인 시작',
    body: 'TX 풀 추가 전 TransactionValidator::validate()로 6단계 검증을 통과해야 합니다.',
  },
  {
    label: '체인ID → 서명 → nonce',
    body: '체인 ID 일치, ecrecover 서명자 복구, nonce 유효성을 순서대로 검증합니다.',
  },
  {
    label: '잔액 → intrinsic gas → base fee',
    body: '잔액 충분성, 최소 가스, max_fee >= base_fee를 검증합니다.',
  },
  {
    label: '검증 결과 반환',
    body: 'Valid(풀 삽입+propagate) 또는 Invalid(거부)를 반환하며 trait으로 L2 검증 확장 가능합니다.',
  },
];
