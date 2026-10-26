// Reth v2.8.1 · crates/chainspec/src/spec.rs에서 관련 부분만 발췌했습니다.

pub fn make_genesis_header(genesis: &Genesis, hardforks: &ChainHardforks) -> Header {
    let base_fee_per_gas = hardforks
        .fork(EthereumHardfork::London)
        .active_at_block(0)
        .then(|| genesis.base_fee_per_gas.map(|fee| fee as u64).unwrap_or(INITIAL_BASE_FEE));

    let withdrawals_root = hardforks
        .fork(EthereumHardfork::Shanghai)
        .active_at_timestamp(genesis.timestamp)
        .then_some(EMPTY_WITHDRAWALS);

    let (parent_beacon_block_root, blob_gas_used, excess_blob_gas) =
        if hardforks.fork(EthereumHardfork::Cancun).active_at_timestamp(genesis.timestamp) {
            let blob_gas_used = genesis.blob_gas_used.unwrap_or(0);
            let excess_blob_gas = genesis.excess_blob_gas.unwrap_or(0);
            (Some(B256::ZERO), Some(blob_gas_used), Some(excess_blob_gas))
        } else {
            (None, None, None)
        };

    let requests_hash = hardforks
        .fork(EthereumHardfork::Prague)
        .active_at_timestamp(genesis.timestamp)
        .then_some(EMPTY_REQUESTS_HASH);

    let block_access_list_hash = hardforks
        .fork(EthereumHardfork::Amsterdam)
        .active_at_timestamp(genesis.timestamp)
        .then_some(EMPTY_BLOCK_ACCESS_LIST_HASH);

    let slot_number = hardforks
        .fork(EthereumHardfork::Amsterdam)
        .active_at_timestamp(genesis.timestamp)
        .then_some(genesis.slot_number.unwrap_or(0));

    Header {
        number: genesis.number.unwrap_or_default(),
        parent_hash: genesis.parent_hash.unwrap_or_default(),
        gas_limit: genesis.gas_limit,
        difficulty: genesis.difficulty,
        nonce: genesis.nonce.into(),
        extra_data: genesis.extra_data.clone(),
        state_root: state_root_ref_unhashed(&genesis.alloc),
        timestamp: genesis.timestamp,
        mix_hash: genesis.mix_hash,
        beneficiary: genesis.coinbase,
        base_fee_per_gas,
        withdrawals_root,
        parent_beacon_block_root,
        blob_gas_used,
        excess_blob_gas,
        requests_hash,
        block_access_list_hash,
        slot_number,
        ..Default::default()
    }
}

pub static MAINNET: LazyLock<Arc<ChainSpec>> = LazyLock::new(|| {
    let genesis = serde_json::from_str(include_str!("../res/genesis/mainnet.json"))
        .expect("Can't deserialize Mainnet genesis json");
    let hardforks = EthereumHardfork::mainnet().into();
    let mut spec = ChainSpec {
        chain: Chain::mainnet(),
        genesis_header: SealedHeader::new(
            make_genesis_header(&genesis, &hardforks),
            MAINNET_GENESIS_HASH,
        ),
        genesis,
        paris_block_and_final_difficulty: Some((
            MAINNET_PARIS_BLOCK,
            U256::from(58_750_003_716_598_352_816_469u128),
        )),
        hardforks,
        deposit_contract: Some(MAINNET_DEPOSIT_CONTRACT),
        base_fee_params: BaseFeeParamsKind::Constant(BaseFeeParams::ethereum()),
        prune_delete_limit: MAINNET_PRUNE_DELETE_LIMIT,
        blob_params: BlobScheduleBlobParams::default().with_scheduled([
            (mainnet::MAINNET_BPO1_TIMESTAMP, BlobParams::bpo1()),
            (mainnet::MAINNET_BPO2_TIMESTAMP, BlobParams::bpo2()),
        ]),
    };
    spec.genesis.config.dao_fork_support = true;
    spec.into()
});

pub fn build(self) -> ChainSpec {
    let paris_block_and_final_difficulty = {
        self.hardforks.get(EthereumHardfork::Paris).and_then(|cond| {
            if let ForkCondition::TTD { total_difficulty, activation_block_number, .. } = cond {
                Some((activation_block_number, total_difficulty))
            } else {
                None
            }
        })
    };
    let genesis = self.genesis.expect("The genesis is required");
    ChainSpec {
        chain: self.chain.expect("The chain is required"),
        genesis_header: SealedHeader::new_unhashed(make_genesis_header(
            &genesis,
            &self.hardforks,
        )),
        genesis,
        hardforks: self.hardforks,
        paris_block_and_final_difficulty,
        deposit_contract: None,
        ..Default::default()
    }
}
