// Reth v2.8.1 · crates/transaction-pool/src/pool/mod.rs · L571–637

/// Add a single validated transaction into the pool.
fn add_transaction(
    &self,
    pool: &mut RwLockWriteGuard<'_, TxPool<T>>,
    origin: TransactionOrigin,
    tx: TransactionValidationOutcome<T::Transaction>,
    timestamp: Instant,
) -> (PoolResult<AddedTransactionOutcome>, Option<AddedTransactionMeta<T::Transaction>>) {
    match tx {
        TransactionValidationOutcome::Valid {
            balance,
            state_nonce,
            transaction,
            propagate,
            bytecode_hash,
            authorities,
        } => {
            let sender_id = self.get_sender_id(transaction.sender());
            let transaction_id = TransactionId::new(sender_id, transaction.nonce());

            let (transaction, blob_sidecar) = match transaction {
                ValidTransaction::Valid(tx) => (tx, None),
                ValidTransaction::ValidWithSidecar { transaction, sidecar } => {
                    (transaction, Some(sidecar))
                }
            };

            let tx = ValidPoolTransaction {
                transaction,
                transaction_id,
                propagate,
                timestamp,
                origin,
                authority_ids: authorities.map(|auths| self.get_sender_ids(auths)),
            };

            let added = match pool.add_transaction(tx, balance, state_nonce, bytecode_hash) {
                Ok(added) => added,
                Err(err) => return (Err(err), None),
            };
            let hash = *added.hash();
            let state = added.transaction_state();
            let meta = AddedTransactionMeta { added, blob_sidecar };

            (Ok(AddedTransactionOutcome { hash, state }), Some(meta))
        }
        TransactionValidationOutcome::Invalid(tx, err) => {
            self.with_event_listener(|listener| listener.invalid(tx.hash()));
            (Err(PoolError::new(*tx.hash(), err)), None)
        }
        TransactionValidationOutcome::Error(tx_hash, err) => {
            self.with_event_listener(|listener| listener.discarded(&tx_hash));
            (Err(PoolError::other(tx_hash, err)), None)
        }
    }
}
