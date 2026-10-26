// Reth v2.8.1 축약 발췌
// crates/node/builder/src/builder/states.rs

/// 노드 형식은 정했지만 핵심 부품은 아직 붙이지 않은 상태입니다.
pub struct NodeBuilderWithTypes<T: FullNodeTypes> {
    config: NodeConfig<<T::Types as NodeTypes>::ChainSpec>,
    adapter: NodeTypesAdapter<T>,
    rocksdb_provider: Option<RocksDBProvider>,
}

impl<T: FullNodeTypes> NodeBuilderWithTypes<T> {
    /// 호환되는 부품 빌더만 받아 다음 형식 상태로 넘어갑니다.
    pub fn with_components<CB>(
        self,
        components_builder: CB,
    ) -> NodeBuilderWithComponents<T, CB, ()>
    where
        CB: NodeComponentsBuilder<T>,
    {
        NodeBuilderWithComponents {
            config: self.config,
            adapter: self.adapter,
            rocksdb_provider: self.rocksdb_provider,
            components_builder,
            add_ons: AddOns {
                hooks: NodeHooks::default(),
                exexs: Vec::new(),
                add_ons: (),
            },
        }
    }
}

/// 핵심 부품까지 정해져 부가 기능과 실행 훅을 붙일 수 있는 상태입니다.
pub struct NodeBuilderWithComponents<T, CB, AO>
where
    T: FullNodeTypes,
    CB: NodeComponentsBuilder<T>,
    AO: NodeAddOns<NodeAdapter<T, CB::Components>>,
{
    pub config: NodeConfig<<T::Types as NodeTypes>::ChainSpec>,
    pub adapter: NodeTypesAdapter<T>,
    pub rocksdb_provider: Option<RocksDBProvider>,
    pub components_builder: CB,
    pub add_ons: AddOns<NodeAdapter<T, CB::Components>, AO>,
}

impl<T, CB, AO> NodeBuilderWithComponents<T, CB, AO> {
    /// 핵심 부품 초기화 직후 실행할 훅입니다.
    pub fn on_component_initialized(
        self,
        hook: impl FnOnce(NodeAdapter<T, CB::Components>),
    ) -> Self;

    /// 노드 전체가 시작된 뒤 실행할 훅입니다.
    pub fn on_node_started(
        self,
        hook: impl FnOnce(FullNode<NodeAdapter<T, CB::Components>, AO>),
    ) -> Self;
}
