// crates/node/builder/src/builder/mod.rs — NodeBuilder 코어

/// 노드 빌더 — 제네릭으로 DB, ChainSpec 타입을 추적
pub struct NodeBuilder<DB, ChainSpec> {
    config: NodeConfig<ChainSpec>,   // CLI 파싱 결과
    database: DB,                     // MDBX 인스턴스
    rocksdb_provider: Option<RocksDBProvider>,
}

impl<DB, ChainSpec> NodeBuilder<DB, ChainSpec>
where
    DB: Database + DatabaseMetrics + Clone + Unpin + 'static,
    ChainSpec: EthChainSpec + EthereumHardforks,
{
    /// types + components를 한 번에 설정하는 편의 메서드
    pub fn node<N>(self, node: N)
        -> NodeBuilderWithComponents<
            RethFullAdapter<DB, N>,
            N::ComponentsBuilder,
            N::AddOns,
        >
    where
        N: Node<RethFullAdapter<DB, N>, ChainSpec = ChainSpec>,
    {
        self.with_types()                   // NodeBuilderWithTypes 전이
            .with_components(               // → NodeBuilderWithComponents
                node.components_builder(),
            )
            .with_add_ons(node.add_ons())   // ExEx·RPC add-ons
    }
}
