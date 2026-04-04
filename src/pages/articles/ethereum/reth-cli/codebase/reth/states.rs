// crates/node/builder/src/builder/states.rs — 빌더 상태 머신

/// with_types() 호출 후 상태 — 타입이 확정되었지만 컴포넌트 미설정
pub struct NodeBuilderWithTypes<T: FullNodeTypes> {
    config: NodeConfig<<T::Types as NodeTypes>::ChainSpec>,
    adapter: NodeTypesAdapter<T>,
    rocksdb_provider: Option<RocksDBProvider>,
}

impl<T: FullNodeTypes> NodeBuilderWithTypes<T> {
    /// 컴포넌트 빌더를 설정하여 다음 상태로 전이
    pub fn with_components<CB>(self, components_builder: CB)
        -> NodeBuilderWithComponents<T, CB, ()>
    where
        CB: NodeComponentsBuilder<T>,
    {
        NodeBuilderWithComponents {
            config: self.config,
            adapter: self.adapter,
            components_builder,
            add_ons: AddOns {
                hooks: NodeHooks::default(),
                exexs: Vec::new(),
                add_ons: (),
            },
            ..
        }
    }
}

/// 컴포넌트까지 설정된 최종 상태 — launch() 호출 가능
pub struct NodeBuilderWithComponents<T, CB, AO> {
    config: NodeConfig<<T::Types as NodeTypes>::ChainSpec>,
    adapter: NodeTypesAdapter<T>,
    components_builder: CB,   // Pool+Network+Evm+Consensus 빌더
    add_ons: AddOns<T, AO>,  // ExEx, RPC, hooks
}
