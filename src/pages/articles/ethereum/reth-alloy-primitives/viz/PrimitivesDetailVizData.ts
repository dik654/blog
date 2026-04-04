export const C = {
  addr: '#6366f1', hash: '#10b981', u256: '#f59e0b',
  fixed: '#8b5cf6', copy: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'Address — FixedBytes<20> 래퍼',
    body: '20바이트 고정 크기 타입\n스택에 인라인 — 힙 할당 없음\nCopy + Eq + Hash trait 구현',
  },
  {
    label: 'B256 — FixedBytes<32> 해시 타입',
    body: '32바이트 — 블록 해시, TX 해시에 사용\nAddress와 동일한 FixedBytes<N> 기반\nconst 제네릭으로 코드 공유',
  },
  {
    label: 'U256 — 4 x u64 limb 구조',
    body: '256비트 정수를 4개 u64로 표현\nlittle-endian limb 순서\n잔액, gas_price, storage value에 사용',
  },
  {
    label: 'Geth big.Int vs alloy U256',
    body: 'big.Int: 임의 크기 → 힙 슬라이스 + GC\nU256: 고정 32B → 스택 인라인\n💡 블록당 수천 번 생성에서 성능 차이 극적',
  },
  {
    label: 'FixedBytes<N> const 제네릭',
    body: 'Address(N=20), B256(N=32)가 동일 구조체\n💡 Geth는 별도 타입 → 중복 구현 발생',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'primitives-addr', 1: 'primitives-addr', 2: 'primitives-u256',
  3: 'primitives-u256', 4: 'primitives-addr',
};
