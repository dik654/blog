export const C = {
  pool: '#6366f1', evm: '#f59e0b', consensus: '#ef4444',
  network: '#10b981', ok: '#10b981',
};

export const STEPS = [
  {
    label: 'NodeComponents trait — 4개 associated type',
    body: 'Pool / Evm / Consensus / Network\n각각 trait bound로 제약\n교체 시 해당 타입만 새 impl 제공',
  },
  {
    label: 'Pool — 트랜잭션 풀',
    body: 'type Pool: TransactionPool + Unpin\n멤풀 정책을 커스텀 가능\n기본값: EthTransactionPool (nonce 기반 정렬)',
  },
  {
    label: 'Evm — EVM 설정',
    body: 'type Evm: ConfigureEvm\nrevm 기반 블록 실행기\nop-reth는 OpExecutor로 교체하여 L1→L2 deposit TX 처리',
  },
  {
    label: 'Consensus — 합의 검증',
    body: 'type Consensus: FullConsensus + Clone\n블록 헤더/바디 유효성 검증\n기본값: EthBeaconConsensus (Beacon Chain)',
  },
  {
    label: 'Components struct — 컨테이너',
    body: 'Components<Node, Network, Pool, EVM, Consensus>\n5개 필드를 하나로 묶음\nNodeComponents trait impl이 자동 생성됨\n💡 FullNodeComponentsAdapter로 다운스트림 타입 전파',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'node-components', 1: 'node-components', 2: 'node-components',
  3: 'node-components', 4: 'components-struct',
};
