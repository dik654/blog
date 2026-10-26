// Reth v2.8.1 축약 발췌
// crates/node/builder/src/components/mod.rs

/// 노드를 구성하는 핵심 부품의 형식 계약입니다.
pub trait NodeComponents<T: FullNodeTypes>:
    Clone + Debug + Unpin + Send + Sync + 'static
{
    // 거래 형식이 노드의 합의 거래 형식과 일치해야 합니다.
    type Pool: TransactionPool<
        Transaction: PoolTransaction<Consensus = TxTy<T::Types>>,
    > + Unpin;

    // EVM 설정은 같은 노드 primitive를 사용해야 합니다.
    type Evm: ConfigureEvm<Primitives = <T::Types as NodeTypes>::Primitives>;
    type Consensus: FullConsensus<<T::Types as NodeTypes>::Primitives>
        + Clone + Unpin + 'static;
    type Network: FullNetwork<
        Primitives: NetPrimitivesFor<<T::Types as NodeTypes>::Primitives>,
    >;

    fn pool(&self) -> &Self::Pool;
    fn evm_config(&self) -> &Self::Evm;
    fn consensus(&self) -> &Self::Consensus;
    fn network(&self) -> &Self::Network;
    fn payload_builder_handle(
        &self,
    ) -> &PayloadBuilderHandle<<T::Types as NodeTypes>::Payload>;
}

/// 실행 중인 부품과 페이로드 서비스 핸들을 한 컨테이너에 보관합니다.
pub struct Components<Node, Network, Pool, EVM, Consensus>
where
    Node: FullNodeTypes,
{
    pub transaction_pool: Pool,
    pub evm_config: EVM,
    pub consensus: Consensus,
    pub network: Network,
    pub payload_builder_handle:
        PayloadBuilderHandle<<Node::Types as NodeTypes>::Payload>,
}
