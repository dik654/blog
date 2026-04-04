export interface TraitDetail {
  id: string;
  trait: string;
  assocType: string;
  bound: string;
  role: string;
  defaultImpl: string;
  customExample: string;
  color: string;
}

export const TRAIT_DETAILS: TraitDetail[] = [
  {
    id: 'pool',
    trait: 'PoolBuilder',
    assocType: 'Pool',
    bound: 'TransactionPool + Unpin',
    role: '멤풀 정책 결정 -- 트랜잭션 정렬, 수수료 필터링, nonce 관리',
    defaultImpl: 'EthTransactionPool -- nonce 기반 정렬 + EIP-1559 우선순위',
    customExample: '프라이빗 풀 -- MEV 보호를 위해 외부 전파 차단',
    color: '#6366f1',
  },
  {
    id: 'evm',
    trait: 'ConfigureEvm',
    assocType: 'Evm',
    bound: 'ConfigureEvm',
    role: 'revm 인스턴스 설정 -- 프리컴파일 등록, 커스텀 옵코드 주입',
    defaultImpl: 'EthEvmConfig -- 메인넷 프리컴파일 + EIP-4844 지원',
    customExample: 'op-reth의 OpEvmConfig -- L1 deposit TX 처리 + L1Block 프리컴파일',
    color: '#f59e0b',
  },
  {
    id: 'consensus',
    trait: 'FullConsensus',
    assocType: 'Consensus',
    bound: 'FullConsensus + Clone',
    role: '블록 헤더/바디 유효성 검증 -- 난이도, 가스 한도, PoS 규칙',
    defaultImpl: 'EthBeaconConsensus -- Beacon Chain PoS 검증',
    customExample: 'NoopConsensus -- 테스트용, 모든 블록 무조건 통과',
    color: '#ef4444',
  },
  {
    id: 'network',
    trait: 'NetworkBuilder',
    assocType: 'Network',
    bound: 'FullNetwork',
    role: 'devp2p P2P 네트워크 -- 피어 탐색, 블록/TX 전파',
    defaultImpl: 'EthNetworkBuilder -- eth/66+67 프로토콜',
    customExample: 'L2에서는 시퀀서만 블록 생성하므로 네트워크 변경 불필요',
    color: '#10b981',
  },
];
