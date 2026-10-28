// Reth v2.8.1 · crates/transaction-pool/src/pool/mod.rs
// source commit: d763342fa185e4e90ee79dc65f6a5706168b0bcb
// 학습용 발췌: Pool insertion과 BlobStore insertion의 실패 경계를 보여 줍니다.

fn on_added_transaction(&self, mut meta: AddedTransactionMeta<T::Transaction>) {
    // Pool write lock을 놓은 뒤 sidecar를 별도 저장소로 넘깁니다.
    if let Some(sidecar) = meta.blob_sidecar {
        let hash = *meta.added.hash();
        self.on_new_blob_sidecar(&hash, &sidecar);
        self.insert_blob(hash, sidecar);
    }

    // Replacement된 Blob transaction의 sidecar는 삭제 대상으로 넘깁니다.
    if let Some(replaced) = meta.added.replaced_blob_transaction() {
        self.delete_blob(replaced);
    }
}

fn insert_blob(&self, hash: TxHash, blob: PooledBlobSidecar) {
    // BlobStore insert 실패는 metric과 warning으로 남깁니다.
    // 이 함수는 이미 성공한 Pool insertion을 되돌리지 않습니다.
    if let Err(err) = self.blob_store.insert(hash, blob) {
        warn!(target: "txpool", %err, "failed to insert blob");
        self.blob_store_metrics.blobstore_failed_inserts.increment(1);
    }
    self.update_blob_store_metrics();
}
