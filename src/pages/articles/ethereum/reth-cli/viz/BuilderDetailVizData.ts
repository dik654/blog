export const C = {
  cli: '#6366f1', build: '#8b5cf6', comp: '#f59e0b',
  launch: '#10b981', type: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'CLI 파싱 → NodeConfig',
    body: 'Cli::<EthereumChainSpecParser>::parse()\nclap이 CLI 인수를 파싱하여 NodeConfig 생성\nChainSpec 로드 + DB 경로 결정',
  },
  {
    label: 'NodeBuilder 생성',
    body: 'NodeBuilder { config, database: (), rocksdb_provider: None }\n제네릭: <(), ChainSpec>\nDB가 아직 () — 타입 레벨 미설정 상태',
  },
  {
    label: 'node() → 3단계 체이닝',
    body: 'self.with_types()          // → NodeBuilderWithTypes\n    .with_components(cb)  // → NodeBuilderWithComponents\n    .with_add_ons(ao)     // ExEx·RPC 등록\n한 줄로 types + components + add_ons 설정',
  },
  {
    label: 'NodeBuilderWithComponents (최종 상태)',
    body: 'components_builder: CB  // Pool+Evm+Consensus+Network\nadd_ons: AddOns<T, AO>  // ExEx, RPC hooks\n이 상태에서만 launch() 호출 가능',
  },
  {
    label: 'launch() → tokio 실행',
    body: 'launch_with_debug_capabilities()\n→ 컴포넌트 빌드 → FullNode 생성\n→ tokio runtime에서 모든 서비스 concurrent 실행\nhandle.wait_for_node_exit().await',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'cli-main', 1: 'builder-struct', 2: 'builder-node',
  3: 'builder-final', 4: 'cli-main',
};
