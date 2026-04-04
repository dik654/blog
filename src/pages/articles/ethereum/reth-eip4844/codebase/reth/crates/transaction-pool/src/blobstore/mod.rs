// reth-transaction-pool — BlobStore 트레이트 (reth v1.x)

/// Blob 데이터를 관리하는 저장소 인터페이스
/// finalization 이후에는 더 이상 필요 없으므로 삭제
/// Clone — Arc로 감싸서 여러 스레드에서 공유
pub trait BlobStore: fmt::Debug + Send + Sync + 'static {
    /// 단일 blob 사이드카 삽입
    fn insert(&self, tx: B256, data: BlobTransactionSidecarVariant)
        -> Result<(), BlobStoreError>;

    /// 여러 blob 사이드카를 한번에 삽입
    fn insert_all(&self, txs: Vec<(B256, BlobTransactionSidecarVariant)>)
        -> Result<(), BlobStoreError>;

    /// blob 사이드카 삭제
    fn delete(&self, tx: B256) -> Result<(), BlobStoreError>;

    /// 여러 blob 삭제 — finalized 블록의 blob 정리
    fn delete_all(&self, txs: Vec<B256>) -> Result<(), BlobStoreError>;

    /// 주기적 정리 — DiskFileBlobStore는 지연 삭제 사용
    fn cleanup(&self) -> BlobStoreCleanupStat;

    /// TX 해시로 디코딩된 blob 데이터 조회
    fn get(&self, tx: B256)
        -> Result<Option<Arc<BlobTransactionSidecarVariant>>, BlobStoreError>;

    /// TX 해시 존재 여부 확인
    fn contains(&self, tx: B256) -> Result<bool, BlobStoreError>;

    /// versioned hash로 blob+proof 조회 (engine API)
    fn get_by_versioned_hashes_v1(&self, versioned_hashes: &[B256])
        -> Result<Vec<Option<BlobAndProofV1>>, BlobStoreError>;

    /// 전체 blob 데이터 크기
    fn data_size_hint(&self) -> Option<usize>;

    /// 저장된 blob 개수
    fn blobs_len(&self) -> usize;
}

/// BlobStore 에러 — 사이드카 미발견, 디코딩 실패
#[derive(Debug, thiserror::Error)]
pub enum BlobStoreError {
    #[error("blob sidecar not found for transaction {0:?}")]
    MissingSidecar(B256),     // TX에 blob이 없음

    #[error("failed to decode blob data: {0}")]
    DecodeError(alloy_rlp::Error), // RLP 디코딩 실패

    #[error(transparent)]
    Other(Box<dyn core::error::Error>), // 디스크 I/O 등
}

/// Blob 저장소 크기 추적 — Atomic으로 스레드 안전
pub(crate) struct BlobStoreSize {
    data_size: AtomicUsize,  // 총 바이트 크기
    num_blobs: AtomicUsize,  // blob 개수
}
