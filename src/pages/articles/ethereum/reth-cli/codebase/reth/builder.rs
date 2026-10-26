// Reth v2.8.1 축약 발췌
// crates/node/builder/src/builder/mod.rs

/// 아직 노드 형식을 붙이지 않은 첫 빌더 상태입니다.
pub struct NodeBuilder<DB, ChainSpec> {
    config: NodeConfig<ChainSpec>,
    database: DB,
    rocksdb_provider: Option<RocksDBProvider>,
}
impl<ChainSpec> NodeBuilder<(), ChainSpec> {
    pub const fn new(config: NodeConfig<ChainSpec>) -> Self {
        Self { config, database: (), rocksdb_provider: None }
    }
}
impl<DB, ChainSpec> NodeBuilder<DB, ChainSpec>
where
    DB: Database + DatabaseMetrics + Clone + Unpin + 'static,
    ChainSpec: EthChainSpec + EthereumHardforks,
{
    /// 노드 형식을 고르면 반환 형식도 NodeBuilderWithTypes로 바뀝니다.
    pub fn with_types<T>(self) -> NodeBuilderWithTypes<RethFullAdapter<DB, T>>
    where
        T: NodeTypesForProvider<ChainSpec = ChainSpec>,
    {
        self.with_types_and_provider()
    }

    /// 기본 Node 구현은 형식·핵심 부품·부가 기능을 순서대로 연결합니다.
    pub fn node<N>(self, node: N) -> NodeBuilderWithComponents<
        RethFullAdapter<DB, N>,
        N::ComponentsBuilder,
        N::AddOns,
    >
    where
        N: Node<RethFullAdapter<DB, N>, ChainSpec = ChainSpec>
            + NodeTypesForProvider,
    {
        self.with_types()
            .with_components(node.components_builder())
            .with_add_ons(node.add_ons())
    }
}
