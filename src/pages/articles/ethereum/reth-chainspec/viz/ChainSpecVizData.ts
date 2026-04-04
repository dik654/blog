export const STEPS = [
  { label: 'ChainSpec 전체 흐름', body: 'Genesis JSON 파싱부터\n하드포크 활성화 체크까지' },
  { label: 'genesis.json 파싱', body: 'alloc(초기 계정) + config(하드포크 설정)\n→ ChainSpec 구조체 생성' },
  { label: 'Hardfork 타임라인', body: 'BTreeMap에 정렬된 순서로 저장\n키 순서 = 하드포크 시간순' },
  { label: 'ForkCondition 분기', body: 'Block / Timestamp / TTD\nenum variant로 타입 안전 분기' },
  { label: '활성화 체크', body: 'is_cancun_active_at_timestamp(now)\n→ now >= 1710338135 → true' },
];

export const FORKS = [
  { name: 'Frontier', block: '0', color: '#94a3b8', type: 'Block' },
  { name: 'London', block: '12,965,000', color: '#6366f1', type: 'Block' },
  { name: 'Paris', block: 'TTD', color: '#8b5cf6', type: 'TTD' },
  { name: 'Shanghai', block: '1681338455', color: '#10b981', type: 'Timestamp' },
  { name: 'Cancun', block: '1710338135', color: '#f59e0b', type: 'Timestamp' },
];

export const STEP_REFS: Record<number, string> = {
  1: 'mainnet-spec', 2: 'chainspec-struct', 3: 'fork-condition',
  4: 'fork-condition',
};
