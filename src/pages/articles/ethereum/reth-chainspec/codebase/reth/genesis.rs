// crates/chainspec/src/spec.rs — Genesis 초기화 & MAINNET 정의

/// 메인넷 ChainSpec — LazyLock으로 한 번만 초기화
pub static MAINNET: LazyLock<Arc<ChainSpec>> = LazyLock::new(|| {
    let genesis = serde_json::from_str(
        include_str!("../res/genesis/mainnet.json") // 컴파일 타임 임베딩
    ).expect("Can't deserialize Mainnet genesis json");
    let hardforks = EthereumHardfork::mainnet().into();
    ChainSpec {
        chain: Chain::mainnet(),
        genesis_header: SealedHeader::new(
            make_genesis_header(&genesis, &hardforks),
            MAINNET_GENESIS_HASH,
        ),
        genesis,
        paris_block_and_final_difficulty: Some((
            15_537_394,  // The Merge 블록
            U256::from(58_750_003_716_598_352_816_469u128),
        )),
        hardforks,
        deposit_contract: Some(MAINNET_DEPOSIT_CONTRACT),
        base_fee_params: BaseFeeParamsKind::Constant(
            BaseFeeParams::ethereum()  // EIP-1559 기본 파라미터
        ),
        ..Default::default()
    }.into()
});

/// 제네시스 헤더 생성 — 하드포크별 조건부 필드 설정
pub fn make_genesis_header(
    genesis: &Genesis,
    hardforks: &ChainHardforks,
) -> Header {
    // London 활성 → base_fee 초기값
    let base_fee_per_gas = hardforks
        .fork(EthereumHardfork::London)
        .active_at_block(0)
        .then(|| INITIAL_BASE_FEE);
    // Shanghai 활성 → 빈 withdrawals root
    let withdrawals_root = hardforks
        .fork(EthereumHardfork::Shanghai)
        .active_at_timestamp(genesis.timestamp)
        .then_some(EMPTY_WITHDRAWALS);

    Header {
        state_root: state_root_ref_unhashed(&genesis.alloc),
        timestamp: genesis.timestamp,
        gas_limit: genesis.gas_limit,
        base_fee_per_gas,
        withdrawals_root,
        ..Default::default()
    }
}
