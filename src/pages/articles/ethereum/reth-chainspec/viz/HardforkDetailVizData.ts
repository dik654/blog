export const C = {
  block: '#6366f1', ttd: '#8b5cf6', ts: '#10b981',
  check: '#f59e0b', ok: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'ChainHardforks — BTreeMap 기반 관리',
    body: 'BTreeMap 키가 정렬되어 Frontier → Cancun까지 하드포크 순서를 자연 유지합니다.',
  },
  {
    label: 'ForkCondition::Block (Frontier~Istanbul)',
    body: '특정 블록 번호에 도달하면 활성화됩니다 (예: London = Block(12,965,000)).',
  },
  {
    label: 'ForkCondition::TTD (The Merge)',
    body: '누적 난이도(TTD)로 PoW → PoS 전환 지점을 판단합니다.',
  },
  {
    label: 'ForkCondition::Timestamp (Shanghai~)',
    body: '블록 타임스탬프 기준으로 활성화됩니다 (예: Cancun = Timestamp(1710338135)).',
  },
  {
    label: 'is_cancun_active(ts) → true/false',
    body: 'BTreeMap에서 Cancun의 ForkCondition을 조회하여 EIP-4844 활성 여부를 판단합니다.',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'chainspec-struct', 1: 'fork-condition', 2: 'fork-condition',
  3: 'fork-condition', 4: 'fork-condition',
};
