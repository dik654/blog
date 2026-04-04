export interface DesignChoice {
  id: string;
  title: string;
  problem: string;
  solution: string;
  color: string;
}

export const DESIGN_CHOICES: DesignChoice[] = [
  {
    id: 'nonce-gap',
    title: 'nonce gap 관리',
    problem: '계정의 현재 nonce가 5인데 nonce=7인 TX가 도착한다. nonce=6이 없으므로 바로 실행할 수 없지만, 나중에 gap이 해소될 수 있으므로 보관해야 한다.',
    solution: 'Queued 서브풀이 nonce gap TX를 보관한다. gap이 해소되면 자동으로 Pending이나 BaseFee 서브풀로 승격한다.',
    color: '#ef4444',
  },
  {
    id: 'basefee-shift',
    title: 'base fee 변동 대응',
    problem: 'base fee가 블록마다 바뀌면 TX의 실행 가능성이 달라진다. max_fee >= base_fee였던 TX가 다음 블록에서 부족해질 수 있다.',
    solution: 'BaseFee 서브풀이 "nonce OK, fee 부족" TX를 보관한다. base fee 하락 시 Pending으로 승격, 상승 시 Pending에서 BaseFee로 강등한다.',
    color: '#f59e0b',
  },
  {
    id: 'trait-design',
    title: 'trait 기반 교체',
    problem: 'Geth는 TX 풀의 검증과 정렬이 하드코딩되어 있다. L2 체인이나 MEV 빌더가 로직을 변경하려면 포크해야 한다.',
    solution: 'TransactionValidator와 TransactionOrdering을 trait으로 추상화한다. L2는 추가 검증(L1 fee 확인)을, MEV 빌더는 자체 정렬 로직을 주입할 수 있다.',
    color: '#10b981',
  },
];

export interface PoolStat {
  metric: string;
  value: string;
  note: string;
}

export const POOL_DEFAULTS: PoolStat[] = [
  { metric: 'Pending 풀 크기', value: '10,000 TX', note: '즉시 실행 가능한 TX 상한' },
  { metric: 'BaseFee 풀 크기', value: '10,000 TX', note: 'fee 부족으로 대기 중인 TX 상한' },
  { metric: 'Queued 풀 크기', value: '10,000 TX', note: 'nonce gap TX 상한' },
  { metric: 'BlobPool 한도', value: '~128KB/blob', note: 'EIP-4844 blob TX 별도 관리' },
];
