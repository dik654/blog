// Reth v2.8.1 · crates/chainspec/src/spec.rs에서 관련 부분만 발췌했습니다.

pub struct ChainSpec<H: BlockHeader = Header> {
    /// The chain ID
    pub chain: Chain,
    /// The genesis block.
    pub genesis: Genesis,
    /// The header corresponding to the genesis block.
    pub genesis_header: SealedHeader<H>,
    /// The block at which Paris was activated and the final difficulty.
    pub paris_block_and_final_difficulty: Option<(u64, U256)>,
    /// The active hard forks and their activation conditions
    pub hardforks: ChainHardforks,
    /// The deposit contract deployed for PoS.
    pub deposit_contract: Option<DepositContract>,
    /// The parameters that configure how a block's base fee is computed.
    pub base_fee_params: BaseFeeParamsKind,
    /// The delete limit for pruner, per run.
    pub prune_delete_limit: usize,
    /// The settings passed for blob configurations for specific hardforks.
    pub blob_params: BlobScheduleBlobParams,
}

impl<H: BlockHeader> ChainSpec<H> {
    /// Compute the ForkId for the given Head following EIP-6122.
    pub fn fork_id(&self, head: &Head) -> ForkId {
        let mut forkhash = ForkHash::from(self.genesis_hash());
        let mut current_applied = 0;

        // Block-based forks are processed before timestamp-based forks.
        for (_, cond) in self.hardforks.forks_iter() {
            if let ForkCondition::Block(block) |
            ForkCondition::TTD { fork_block: Some(block), .. } = cond
            {
                if head.number >= block {
                    if block != current_applied {
                        forkhash += block;
                        current_applied = block;
                    }
                } else {
                    return ForkId { hash: forkhash, next: block }
                }
            }
        }

        for timestamp in self.hardforks.forks_iter().filter_map(|(_, cond)| {
            cond.as_timestamp().filter(|time| time > &self.genesis.timestamp)
        }) {
            if head.timestamp >= timestamp {
                if timestamp != current_applied {
                    forkhash += timestamp;
                    current_applied = timestamp;
                }
            } else {
                return ForkId { hash: forkhash, next: timestamp }
            }
        }

        ForkId { hash: forkhash, next: 0 }
    }
}
