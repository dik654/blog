//! Support for maintaining the blob pool.

use alloy_consensus::{transaction::TxHashRef, Typed2718};
use alloy_primitives::{BlockNumber, B256};
use reth_execution_types::ChainBlocks;
use reth_primitives_traits::{Block, BlockBody, SignedTransaction};
use std::collections::BTreeMap;

/// The type that is used to track canonical blob transactions.
#[derive(Debug, Default, Eq, PartialEq)]
pub struct BlobStoreCanonTracker {
    /// Keeps track of the blob transactions included in blocks.
    blob_txs_in_blocks: BTreeMap<BlockNumber, Vec<B256>>,
}

impl BlobStoreCanonTracker {
    /// Adds a block to the blob store maintenance.
    pub fn add_block(
        &mut self,
        block_number: BlockNumber,
        blob_txs: impl IntoIterator<Item = B256>,
    ) {
        self.blob_txs_in_blocks.insert(block_number, blob_txs.into_iter().collect());
    }

    /// Adds all blocks to the tracked list of blocks.
    ///
    /// Replaces any previously tracked blocks with the set of transactions.
    pub fn add_blocks(
        &mut self,
        blocks: impl IntoIterator<Item = (BlockNumber, impl IntoIterator<Item = B256>)>,
    ) {
        for (block_number, blob_txs) in blocks {
            self.add_block(block_number, blob_txs);
        }
    }

    /// Adds all blob transactions from the given chain to the tracker.
    ///
    /// Note: In case this is a chain that's part of a reorg, this replaces previously tracked
    /// blocks.
    pub fn add_new_chain_blocks<B>(&mut self, blocks: &ChainBlocks<'_, B>)
    where
        B: Block<Body: BlockBody<Transaction: SignedTransaction>>,
    {
        let blob_txs = blocks.iter().map(|(num, block)| {
            let iter = block
                .body()
                .transactions()
                .iter()
                .filter(|tx| tx.is_eip4844())
                .map(|tx| *tx.tx_hash());
            (*num, iter)
        });
        self.add_blocks(blob_txs);
    }

    /// Invoked when a block is finalized.
    ///
    /// This returns all blob transactions that were included in blocks that are now finalized.
    pub fn on_finalized_block(&mut self, finalized_block: BlockNumber) -> BlobStoreUpdates {
        let mut finalized = Vec::new();
        while let Some(entry) = self.blob_txs_in_blocks.first_entry() {
            if *entry.key() <= finalized_block {
                finalized.extend(entry.remove_entry().1);
            } else {
                break
            }
        }

        if finalized.is_empty() {
            BlobStoreUpdates::None
        } else {
            BlobStoreUpdates::Finalized(finalized)
        }
    }
}
