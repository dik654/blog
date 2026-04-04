// reth-transaction-pool — InMemoryBlobStore (reth v1.x)

/// 인메모리 blob 저장소 — 테스트 또는 경량 노드용
/// B256Map(tx_hash → sidecar) + 크기 추적
#[derive(Clone, Debug, Default)]
pub struct InMemoryBlobStore {
    inner: Arc<InMemoryBlobStoreInner>,
}

#[derive(Debug, Default)]
struct InMemoryBlobStoreInner {
    /// tx_hash → blob 사이드카 (RwLock으로 동시 읽기 허용)
    store: RwLock<B256Map<Arc<BlobTransactionSidecarVariant>>>,
    size_tracker: BlobStoreSize,
}

impl BlobStore for InMemoryBlobStore {
    fn insert(&self, tx: B256, data: BlobTransactionSidecarVariant)
        -> Result<(), BlobStoreError>
    {
        let mut store = self.inner.store.write();
        // insert_size: 기존 값 없으면 blob.size() 반환
        self.inner.size_tracker.add_size(insert_size(&mut store, tx, data));
        self.inner.size_tracker.update_len(store.len());
        Ok(())
    }

    fn delete(&self, tx: B256) -> Result<(), BlobStoreError> {
        let mut store = self.inner.store.write();
        let sub = remove_size(&mut store, &tx);
        self.inner.size_tracker.sub_size(sub);
        self.inner.size_tracker.update_len(store.len());
        Ok(())
    }

    /// cleanup은 no-op — 메모리 저장소는 즉시 삭제
    fn cleanup(&self) -> BlobStoreCleanupStat {
        BlobStoreCleanupStat::default()
    }

    /// 단순 HashMap 조회
    fn get(&self, tx: B256)
        -> Result<Option<Arc<BlobTransactionSidecarVariant>>, BlobStoreError>
    {
        Ok(self.inner.store.read().get(&tx).cloned())
    }
}

/// blob 크기 계산 후 삽입
fn insert_size(store: &mut B256Map<Arc<BlobTransactionSidecarVariant>>,
    tx: B256, blob: BlobTransactionSidecarVariant) -> usize
{
    let add = blob.size();
    store.insert(tx, Arc::new(blob));
    add
}
