export interface DesignChoice {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
  codeRefKeys?: string[];
}

export const DESIGN_CHOICES: DesignChoice[] = [
  {
    id: 'modular',
    label: 'Modular Builder',
    role: 'trait 기반 컴포넌트 교체',
    details:
      'NodeBuilder가 Pool/Evm/Consensus/Network를 trait 제네릭으로 받는다. ' +
      '기본 impl을 제공하되, L2나 커스텀 체인에서 필요한 부분만 교체할 수 있다.',
    why: 'Geth는 하드코딩된 의존성을 사용. 새 체인 지원 시 포크 전체를 유지보수해야 한다. ' +
      'Reth는 trait impl 하나만 교체하면 된다.',
    color: '#6366f1',
    codeRefKeys: ['builder-node', 'node-components'],
  },
  {
    id: 'typestate',
    label: 'Typestate 패턴',
    role: '빌드 순서를 타입으로 강제',
    details:
      'NodeBuilder → NodeBuilderWithTypes → NodeBuilderWithComponents 순서로 상태 전이. ' +
      '각 상태가 별도 struct이므로 with_types() 전에 launch()를 호출하면 컴파일 에러.',
    why: 'Rust의 타입 시스템으로 잘못된 빌드 순서를 런타임이 아닌 컴파일 타임에 차단한다.',
    color: '#f59e0b',
    codeRefKeys: ['builder-states', 'builder-final'],
  },
  {
    id: 'opreth',
    label: 'op-reth 사례',
    role: 'OP Stack L2 노드',
    details:
      'op-reth는 EthereumNode 대신 OpNode를 사용. ' +
      'Evm과 PayloadBuilder만 교체하고, Pool/Network/Consensus는 기본값을 그대로 재사용한다.',
    why: 'L2 변경 범위를 최소화. Geth 기반 op-geth는 약 1,200줄 diff를 유지보수하지만, ' +
      'op-reth는 trait impl 교체만으로 L2를 구성한다.',
    color: '#10b981',
    codeRefKeys: ['cli-main'],
  },
];
