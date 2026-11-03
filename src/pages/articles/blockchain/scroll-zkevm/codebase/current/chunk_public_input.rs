pub struct ChunkInfo {
    /// The EIP-155 chain ID for all txs in the chunk.
    pub chain_id: u64,
    /// The state root before applying the chunk.
    pub prev_state_root: B256,
    /// The state root after applying the chunk.
    pub post_state_root: B256,
    /// The withdrawals root after applying the chunk.
    pub withdraw_root: B256,
    /// Digest of L1 message txs force included in the chunk.
    #[serde(default)]
    pub data_hash: B256,
    /// Digest of L2 tx data flattened over all L2 txs in the chunk.
    pub tx_data_digest: B256,
    /// The L1 msg queue hash at the end of the previous chunk.
    pub prev_msg_queue_hash: B256,
    /// The L1 msg queue hash at the end of the current chunk.
    pub post_msg_queue_hash: B256,
    /// The length of rlp encoded L2 tx bytes flattened over all L2 txs in the chunk.
    pub tx_data_length: u64,
    /// The block number of the first block in the chunk.
    pub initial_block_number: u64,
    /// The block contexts of the blocks in the chunk.
    pub block_ctxs: Vec<BlockContextV2>,
    /// The blockhash of the last block in the previous chunk.
    pub prev_blockhash: B256,
    /// The blockhash of the last block in the current chunk.
    pub post_blockhash: B256,
    /// Optional encryption key for encrypted L1 msgs, which is used in case of domain=Validium.
    pub encryption_key: Option<Box<[u8]>>,
}

impl ChunkInfo {
    pub fn pi_galileo(&self, version: Version) -> Vec<u8> {
        std::iter::empty()
            .chain(&[version.as_version_byte()])
            .chain(&self.chain_id.to_be_bytes())
            .chain(self.prev_state_root.as_slice())
            .chain(self.post_state_root.as_slice())
            .chain(self.withdraw_root.as_slice())
            .chain(self.tx_data_digest.as_slice())
            .chain(self.prev_msg_queue_hash.as_slice())
            .chain(self.post_msg_queue_hash.as_slice())
            .chain(&self.initial_block_number.to_be_bytes())
            .chain(
                self.block_ctxs
                    .iter()
                    .flat_map(|block_ctx| block_ctx.to_bytes())
                    .collect::<Vec<u8>>()
                    .as_slice(),
            )
            .copied()
            .collect()
    }
}
