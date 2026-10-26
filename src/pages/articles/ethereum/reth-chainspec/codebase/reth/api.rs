// Reth v2.8.1 · crates/chainspec/src/api.rs 발췌입니다.

#[auto_impl::auto_impl(&, Arc)]
pub trait EthChainSpec: Send + Sync + Unpin + Debug {
    type Header: BlockHeader;

    fn chain(&self) -> Chain;

    fn chain_id(&self) -> u64 {
        self.chain().id()
    }

    fn base_fee_params_at_timestamp(&self, timestamp: u64) -> BaseFeeParams;
    fn blob_params_at_timestamp(&self, timestamp: u64) -> Option<BlobParams>;
    fn deposit_contract(&self) -> Option<&DepositContract>;
    fn genesis_hash(&self) -> B256;
    fn prune_delete_limit(&self) -> usize;
    fn display_hardforks(&self) -> Box<dyn Display>;
    fn genesis_header(&self) -> &Self::Header;
    fn genesis(&self) -> &Genesis;
    fn bootnodes(&self) -> Option<Vec<NodeRecord>>;
    fn final_paris_total_difficulty(&self) -> Option<U256>;
}
