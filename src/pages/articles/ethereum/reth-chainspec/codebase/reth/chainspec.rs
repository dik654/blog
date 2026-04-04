// crates/chainspec/src/spec.rs — ChainSpec 핵심 구조체

/// 체인 전체 설정 — chain_id, genesis, hardforks를 하나로 묶음
pub struct ChainSpec<H = Header> {
    pub chain: Chain,                          // mainnet, sepolia, holesky 등
    pub genesis_header: SealedHeader<H>,       // 제네시스 블록 헤더 (해시 포함)
    pub genesis: Genesis,                      // genesis.json 파싱 결과
    pub paris_block_and_final_difficulty:       // PoW→PoS 전환 지점
        Option<(u64, U256)>,
    pub hardforks: ChainHardforks,             // BTreeMap 기반 하드포크 관리
    pub deposit_contract: Option<DepositContract>,
    pub base_fee_params: BaseFeeParamsKind,    // EIP-1559 파라미터
    pub blob_params: BlobScheduleBlobParams,   // EIP-4844 blob 파라미터
    pub prune_delete_limit: usize,             // 프루닝 배치 크기
}

// crates/ethereum-forks/src/hardfork.rs

/// 하드포크 활성화 조건 — 타입 안전한 enum
pub enum ForkCondition {
    Block(BlockNumber),          // Frontier~Istanbul: 블록 번호
    TTD {                        // The Merge: 누적 난이도
        total_difficulty: U256,
        fork_block: Option<BlockNumber>,
    },
    Timestamp(u64),              // Shanghai~: Unix 타임스탬프
    Never,                       // 비활성화
}

// crates/chainspec/src/api.rs

/// EthChainSpec trait — 모든 체인 설정의 공통 인터페이스
pub trait EthChainSpec: Send + Sync + Unpin + Debug {
    type Header: BlockHeader;
    fn chain(&self) -> Chain;
    fn chain_id(&self) -> u64 { self.chain().id() }
    fn base_fee_params_at_timestamp(&self, ts: u64) -> BaseFeeParams;
    fn genesis_hash(&self) -> B256;
    fn genesis_header(&self) -> &Self::Header;
    fn genesis(&self) -> &Genesis;
    fn bootnodes(&self) -> Option<Vec<NodeRecord>>;
}
