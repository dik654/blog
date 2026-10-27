// Reth v2.8.1 · crates/transaction-pool/src/maintain.rs · L382–435

// all transactions mined in the new chain
let mined_transactions = new_blocks.transaction_hashes_vec();
let new_mined_transactions = mined_transactions.iter().copied().collect::<B256Set>();

// find transactions mined in the old chain but not in the new chain
let pruned_old_transactions = old_blocks
    .transactions_with_sender()
    .filter(|(_, tx)| !new_mined_transactions.contains(tx.tx_hash()))
    .filter_map(|(signer, tx)| {
        let tx = tx.clone().with_signer(*signer);
        if tx.is_eip4844() {
            pool.get_blob(*tx.tx_hash())
                .ok()
                .flatten()
                .map(Arc::unwrap_or_clone)
                .and_then(|sidecar| {
                    <P as TransactionPool>::Transaction::try_from_eip4844(tx, sidecar)
                })
        } else {
            <P as TransactionPool>::Transaction::try_from_consensus(tx).ok()
        }
    })
    .collect::<Vec<_>>();

// update the pool first
let update = CanonicalStateUpdate {
    new_tip: new_tip.sealed_block(),
    pending_block_base_fee,
    pending_block_blob_fee,
    changed_accounts,
    // all transactions mined in the new chain need to be removed from the pool
    mined_transactions,
    update_kind: PoolUpdateKind::Reorg,
};
pool.on_canonical_state_change(update);

// Transactions from the old branch are revalidated before insertion.
metrics.inc_reinserted_transactions(pruned_old_transactions.len());
let _ = pool.add_external_transactions(pruned_old_transactions).await;
