// Reth v2.8.1 · crates/transaction-pool/src/pool/mod.rs
// Upstream lines 585–637, 700–753에서 insertion 경계를 발췌했습니다.

match validation_outcome {
    TransactionValidationOutcome::Valid {
        balance,
        state_nonce,
        transaction,
        propagate,
        bytecode_hash,
        authorities,
    } => {
        // [학습 주석] 검증한 transaction과 sidecar를 pool 구조에 넣기 전에 다시 분리합니다.
        let (transaction, blob_sidecar) = match transaction {
            ValidTransaction::Valid(tx) => (tx, None),
            ValidTransaction::ValidWithSidecar { transaction, sidecar } => {
                (transaction, Some(sidecar))
            }
        };

        // [학습 주석] Validator의 Valid는 insertion 시도 자격입니다.
        // 중복·replacement·pool 규칙 때문에 여기서도 실패할 수 있습니다.
        let added = match pool.add_transaction(tx, balance, state_nonce, bytecode_hash) {
            Ok(added) => added,
            Err(err) => return (Err(err), None),
        };
        let meta = AddedTransactionMeta { added, blob_sidecar };
        (Ok(outcome), Some(meta))
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

// [학습 주석] Batch insertion 뒤 pool limit을 넘으면 가장 낮은 우선순위 후보를 버립니다.
let discarded = if results.iter().any(Result::is_ok) {
    let discarded = pool.discard_worst();
    pool.update_size_metrics();
    discarded
} else {
    Default::default()
};

// [학습 주석] Pool write lock을 놓은 뒤 새 삽입 metadata의 sidecar를 BlobStore로 넘깁니다.
fn on_added_transaction(&self, meta: AddedTransactionMeta<T::Transaction>) {
    if let Some(sidecar) = meta.blob_sidecar {
        let hash = *meta.added.hash();
        self.on_new_blob_sidecar(&hash, &sidecar);
        self.insert_blob(hash, sidecar);
    }
}
