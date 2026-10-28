// Reth v2.8.1 · crates/transaction-pool/src/blobstore/mod.rs
// source commit: d763342fa185e4e90ee79dc65f6a5706168b0bcb
// 학습용 발췌: 함수 순서와 타입은 원문을 유지하고 관련 없는 메서드는 생략했습니다.

/// Transaction Pool이 Blob sidecar를 보관하는 인터페이스입니다.
/// 이 저장소는 finalization 뒤 더 이상 필요 없는 pool artifact를 추적합니다.
pub trait BlobStore: fmt::Debug + Send + Sync + 'static {
    /// Transaction hash를 key로 검증된 sidecar를 넣습니다.
    fn insert(&self, tx: B256, data: PooledBlobSidecar)
        -> Result<(), BlobStoreError>;

    /// Transaction hash로 decode된 sidecar를 찾습니다.
    /// 없으면 None이며, decode·I/O 실패와는 구분됩니다.
    fn get(&self, tx: B256)
        -> Result<Option<Arc<BlobTransactionSidecarVariant>>, BlobStoreError>;

    /// 요청한 모든 transaction의 sidecar가 있어야 성공합니다.
    fn get_exact(&self, txs: Vec<B256>)
        -> Result<Vec<Arc<BlobTransactionSidecarVariant>>, BlobStoreError>;

    /// Finalized transaction 등 더 이상 필요 없는 sidecar를 삭제 대상으로 표시합니다.
    fn delete_all(&self, txs: Vec<B256>) -> Result<(), BlobStoreError>;

    /// 지연 삭제 backend가 실제 정리를 수행합니다.
    fn cleanup(&self) -> BlobStoreCleanupStat;
}

#[derive(Debug, thiserror::Error)]
pub enum BlobStoreError {
    /// get_exact에서 필요한 sidecar가 하나라도 없을 때입니다.
    #[error("blob sidecar not found for transaction {0:?}")]
    MissingSidecar(B256),

    /// 파일은 읽었지만 RLP fields를 sidecar로 복원하지 못했습니다.
    #[error("failed to decode blob data: {0}")]
    DecodeError(#[from] alloy_rlp::Error),

    /// Backend별 I/O 오류입니다.
    #[error(transparent)]
    Other(Box<dyn core::error::Error + Send + Sync>),
}
