export const STEPS = [
  { label: 'NodeBuilder 전체 흐름', body: 'CLI 파싱부터\ntokio 런타임 실행까지' },
  { label: 'CLI 인수 파싱 (clap)', body: 'Cli::<EthereumChainSpecParser>::parse()\nChainSpec 로드 + DB 경로 결정' },
  { label: 'builder.node(EthereumNode)', body: 'with_types + with_components + with_add_ons\n타입 안전한 3단계 체이닝' },
  { label: '각 컴포넌트는 trait impl로 교체', body: 'Evm → OpEvm\nPool → CustomPool\n커스텀 노드 구성' },
  { label: 'launch() → tokio runtime', body: '컴포넌트 빌드 후\ntokio에서 FullNode 시작' },
];

export const COMPONENTS = [
  { name: 'Pool', desc: 'TX 풀', color: '#6366f1' },
  { name: 'Evm', desc: 'revm', color: '#f59e0b' },
  { name: 'Consensus', desc: '검증', color: '#ef4444' },
  { name: 'Network', desc: 'devp2p', color: '#10b981' },
];

export const STEP_REFS: Record<number, string> = {
  1: 'cli-main', 2: 'builder-node', 3: 'node-components', 4: 'cli-main',
};
