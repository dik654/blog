// reth-transaction-pool — DiskFileBlobStore (reth v1.x)

/// 캐시 기본값: 메모리에 최대 100개 사이드카 유지
pub const DEFAULT_MAX_CACHED_BLOBS: u32 = 100;

/// 디스크 기반 blob 저장소
/// 지연 삭제(deferred deletion) — 즉시 삭제하지 않고
/// cleanup() 호출 시 일괄 삭제
#[derive(Clone, Debug)]
pub struct DiskFileBlobStore {
    inner: Arc<DiskFileBlobStoreInner>,
}

/// 왜 지연 삭제? → 삭제 시점에 파일 lock 잡으면
/// 삽입/조회 성능 저하. 비동기 정리가 더 효율적
struct DiskFileBlobStoreInner {
    blob_dir: PathBuf,                    // blob 파일 디렉토리
    blob_cache: Mutex<LruMap<TxHash, Arc<BlobTransactionSidecarVariant>, ByLength>>,
    size_tracker: BlobStoreSize,          // 크기 추적
    file_lock: RwLock<()>,               // 디스크 I/O 동기화
    txs_to_delete: RwLock<B256Set>,      // 삭제 대기 목록
    /// versioned_hash → tx_hash 매핑 (LRU 캐시)
    /// engine API의 getBlobsV1 등에서 사용
    versioned_hashes_to_txhash: Mutex<LruMap<B256, B256>>,
}

impl DiskFileBlobStore {
    /// 초기화: 이전 blob 디렉토리 삭제 후 재생성
    /// 왜? → 노드 재시작 시 오래된 blob은 무효
    pub fn open(blob_dir: impl Into<PathBuf>, opts: DiskFileBlobStoreConfig)
        -> Result<Self, DiskFileBlobStoreError>
    {
        let inner = DiskFileBlobStoreInner::new(blob_dir.into(), opts.max_cached_entries);
        inner.delete_all()?;   // 이전 blob 전부 삭제
        inner.create_blob_dir()?; // 빈 디렉토리 생성
        Ok(Self { inner: Arc::new(inner) })
    }
}

impl BlobStore for DiskFileBlobStore {
    fn insert(&self, tx: B256, data: BlobTransactionSidecarVariant)
        -> Result<(), BlobStoreError>
    {
        self.inner.insert_one(tx, data)  // 캐시 + 디스크 저장
    }

    /// 삭제는 즉시 수행하지 않음 — 삭제 대기 목록에 추가
    fn delete(&self, tx: B256) -> Result<(), BlobStoreError> {
        if self.inner.contains(tx)? {
            self.inner.txs_to_delete.write().insert(tx);
        }
        Ok(())
    }

    /// cleanup: 백그라운드에서 호출하여 삭제 대기 blob 제거
    fn cleanup(&self) -> BlobStoreCleanupStat {
        let txs = std::mem::take(&mut *self.inner.txs_to_delete.write());
        let mut stat = BlobStoreCleanupStat::default();
        for tx in txs {
            let path = self.inner.blob_disk_file(tx);
            match fs::remove_file(&path) {
                Ok(_) => stat.delete_succeed += 1,
                Err(e) if e.kind() == io::ErrorKind::NotFound =>
                    stat.delete_succeed += 1,  // 이미 삭제됨
                Err(_) => stat.delete_failed += 1,
            };
        }
        stat
    }
}
