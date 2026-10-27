use alloy_consensus::BlockHeader as AlloyBlockHeader;
use alloy_eips::eip1559::BaseFeeParams;

pub trait EthChainSpec: Send + Sync + Unpin + Clone {
    type Header: BlockHeader;

    /// Get the `BaseFeeParams` for the chain at the given timestamp.
    fn base_fee_params_at_timestamp(&self, timestamp: u64) -> BaseFeeParams;

    /// See `AlloyBlockHeader::next_block_base_fee`.
    fn next_block_base_fee(
        &self,
        parent: &Self::Header,
        target_timestamp: u64,
    ) -> Option<u64> {
        parent.next_block_base_fee(
            self.base_fee_params_at_timestamp(target_timestamp),
        )
    }
}
