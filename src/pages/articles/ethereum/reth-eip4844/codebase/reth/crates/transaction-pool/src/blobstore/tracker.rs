// reth-transaction-pool — BlobStoreCanonTracker (reth v1.x)

/// 정규 체인의 blob TX를 블록별로 추적
/// finalization 시 포함된 blob TX를 삭제하기 위해 사용
#[derive(Debug, Default)]
pub struct BlobStoreCanonTracker {
    /// 블록 번호 → 해당 블록의 blob TX 해시 목록
    /// BTreeMap이므로 finalized 블록을 순서대로 처리 가능
    blob_txs_in_blocks: BTreeMap<BlockNumber, Vec<B256>>,
}

impl BlobStoreCanonTracker {
    /// 새 블록 추가 — 블록에 포함된 blob TX 해시 기록
    pub fn add_block(&mut self, block_number: BlockNumber,
        blob_txs: impl IntoIterator<Item = B256>)
    {
        self.blob_txs_in_blocks.insert(
            block_number, blob_txs.into_iter().collect()
        );
    }

    /// 체인에서 EIP-4844 TX만 필터링하여 추적
    pub fn add_new_chain_blocks<B>(&mut self, blocks: &ChainBlocks<'_, B>)
    where B: Block<Body: BlockBody<Transaction: SignedTransaction>>
    {
        let blob_txs = blocks.iter().map(|(num, block)| {
            let iter = block.body().transactions().iter()
                .filter(|tx| tx.is_eip4844())  // EIP-4844만 필터
                .map(|tx| tx.trie_hash());
            (*num, iter)
        });
        self.add_blocks(blob_txs);
    }

    /// 블록이 finalized되면 해당 블록까지의 blob TX 반환
    /// → BlobStore에서 삭제할 TX 목록
    pub fn on_finalized_block(&mut self, finalized_block: BlockNumber)
        -> BlobStoreUpdates
    {
        let mut finalized = Vec::new();
        // BTreeMap의 first_entry()로 가장 오래된 블록부터 처리
        while let Some(entry) = self.blob_txs_in_blocks.first_entry() {
            if *entry.key() <= finalized_block {
                finalized.extend(entry.remove_entry().1);
            } else { break }
        }
        if finalized.is_empty() { BlobStoreUpdates::None }
        else { BlobStoreUpdates::Finalized(finalized) }
    }
}

/// Finalized blob TX 삭제 업데이트
pub enum BlobStoreUpdates {
    None,
    Finalized(Vec<B256>), // 삭제할 TX 해시 목록
}
