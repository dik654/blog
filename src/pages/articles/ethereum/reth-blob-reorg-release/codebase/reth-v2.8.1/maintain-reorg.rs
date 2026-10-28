                // all transactions mined in the new chain
                let mined_transactions = new_blocks.transaction_hashes_vec();
                let new_mined_transactions =
                    mined_transactions.iter().copied().collect::<B256Set>();

                // update the pool then re-inject the pruned transactions
                // find all transactions that were mined in the old chain but not in the new chain
                let pruned_old_transactions = old_blocks
                    .transactions_with_sender()
                    .filter(|(_, tx)| !new_mined_transactions.contains(tx.tx_hash()))
                    .filter_map(|(signer, tx)| {
                        let tx = tx.clone().with_signer(*signer);
                        if tx.is_eip4844() {
                            // reorged blobs no longer include the blob, which is necessary for
                            // validating the transaction. Even though the transaction could have
                            // been validated previously, we still need the blob in order to
                            // accurately set the transaction's
                            // encoded-length which is propagated over the network.
                            pool.get_blob(*tx.tx_hash())
                                .ok()
                                .flatten()
                                .map(Arc::unwrap_or_clone)
                                .and_then(|sidecar| {
                                    <P as TransactionPool>::Transaction::try_from_eip4844(
                                        tx, sidecar,
                                    )
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

                // all transactions that were mined in the old chain but not in the new chain need
                // to be re-injected
                //
                // Note: we no longer know if the tx was local or external
                // Because the transactions are not finalized, the corresponding blobs are still in
                // blob store (if we previously received them from the network)
                metrics.inc_reinserted_transactions(pruned_old_transactions.len());
                let _ = pool.add_external_transactions(pruned_old_transactions).await;

                // keep track of new mined blob transactions
                blob_store_tracker.add_new_chain_blocks(&new_blocks);
            }
