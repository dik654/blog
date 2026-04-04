// crates/node/builder/src/components/mod.rs — NodeComponents trait

/// 노드를 구성하는 교체 가능한 4개 컴포넌트
pub trait NodeComponents<T: FullNodeTypes>:
    Clone + Debug + Unpin + Send + Sync + 'static
{
    /// 트랜잭션 풀 — 멤풀 정책 커스텀 가능
    type Pool: TransactionPool + Unpin;
    /// EVM 설정 — revm 기반, OP Stack은 커스텀
    type Evm: ConfigureEvm;
    /// 합의 검증기 — 블록 헤더/바디 유효성
    type Consensus: FullConsensus + Clone + Unpin;
    /// 네트워크 — devp2p 스택, 피어 관리
    type Network: FullNetwork;

    fn pool(&self) -> &Self::Pool;
    fn evm_config(&self) -> &Self::Evm;
    fn consensus(&self) -> &Self::Consensus;
    fn network(&self) -> &Self::Network;
    fn payload_builder_handle(&self)
        -> &PayloadBuilderHandle<<T::Types as NodeTypes>::Payload>;
}

/// 구체 컴포넌트를 하나로 묶는 컨테이너
pub struct Components<Node, Network, Pool, EVM, Consensus> {
    pub transaction_pool: Pool,
    pub evm_config: EVM,
    pub consensus: Consensus,
    pub network: Network,
    pub payload_builder: PayloadBuilderHandle<..>,
    _node: PhantomData<Node>,
}
