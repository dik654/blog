export interface ValidationStep {
  order: number;
  check: string;
  failReason: string;
  detail: string;
  color: string;
}

export const VALIDATION_STEPS: ValidationStep[] = [
  {
    order: 1,
    check: '체인 ID 검증',
    failReason: 'InvalidChainId',
    detail: 'TX의 체인 ID가 현재 네트워크와 일치하는지 확인한다. EIP-155 이후 체인 ID가 서명에 포함된다. 다른 네트워크의 TX가 재전송되는 것을 방지한다.',
    color: '#6366f1',
  },
  {
    order: 2,
    check: '서명 복구 (ecrecover)',
    failReason: 'InvalidSignature',
    detail: 'secp256k1 서명에서 공개키를 복구하고 sender 주소를 도출한다. 서명이 유효하지 않으면 즉시 거부한다. 프리컴파일 0x01(ecRecover)과 동일한 연산이다.',
    color: '#0ea5e9',
  },
  {
    order: 3,
    check: 'nonce 검증',
    failReason: 'NonceTooLow / NonceTooHigh',
    detail: 'TX의 nonce가 sender의 현재 nonce 이상인지 확인한다. 이미 사용된 nonce면 거부한다. 미래 nonce면 Queued 서브풀로 보낸다.',
    color: '#f59e0b',
  },
  {
    order: 4,
    check: '잔액 검증',
    failReason: 'InsufficientFunds',
    detail: 'gas_limit * max_fee_per_gas + value가 sender 잔액 이하인지 확인한다. 잔액이 부족하면 실행 자체가 불가능하므로 즉시 거부한다.',
    color: '#10b981',
  },
  {
    order: 5,
    check: 'intrinsic gas 검증',
    failReason: 'IntrinsicGasTooLow',
    detail: 'TX 데이터 크기에 따른 최소 가스를 계산한다. 21,000(기본) + 데이터 바이트당 16(non-zero) 또는 4(zero). gas_limit가 이 값보다 작으면 거부한다.',
    color: '#8b5cf6',
  },
  {
    order: 6,
    check: 'base fee 검증',
    failReason: 'FeeCapTooLow',
    detail: 'max_fee_per_gas >= 현재 base_fee인지 확인한다. 부족하면 BaseFee 서브풀에 배치한다. base fee가 하락하면 Pending으로 승격될 수 있다.',
    color: '#ef4444',
  },
];

export interface TraitAdvantage {
  question: string;
  answer: string;
}

export const TRAIT_ADVANTAGES: TraitAdvantage[] = [
  {
    question: 'Geth 대비 trait 기반의 장점?',
    answer: 'Geth의 validateTx()는 모든 검증을 하나의 함수에 하드코딩한다. Reth는 TransactionValidator trait이므로 L2 체인에서 추가 검증(예: L1 fee 확인, 시퀀서 우선권)을 구현체 교체로 추가할 수 있다.',
  },
  {
    question: 'is_local()의 역할?',
    answer: '로컬에서 제출된 TX는 풀이 가득 찰 때 제거 우선순위가 낮다. 사용자가 직접 보낸 TX가 외부 TX에 밀려 퇴출되지 않도록 보호한다.',
  },
];
