// Reth v2.8.1 · crates/transaction-pool/src/validate/eth.rs
// Upstream lines 806–880.

pub fn validate_eip4844(
    &self,
    transaction: &mut Tx,
) -> Result<Option<PooledBlobSidecar>, InvalidPoolTransactionError> {
    let mut maybe_blob_sidecar = None;

    if transaction.is_eip4844() {
        // [학습 주석] 새 제출, reorg 재주입, 내부적으로 불가능한 상태를 타입으로 나눕니다.
        match transaction.take_blob() {
            EthBlobTransactionSidecar::None => {
                self.validation_metrics.invalid_4844.increment(1);
                return Err(InvalidTransactionError::TxTypeNotSupported.into())
            }
            EthBlobTransactionSidecar::Missing => {
                // [학습 주석] Reorg 재주입은 BlobStore에 이미 검증한 sidecar가 있어야 통과합니다.
                if self.blob_store.contains(*transaction.hash()).is_ok_and(|contains| contains) {
                    // 기존 검증 결과를 재사용합니다.
                } else {
                    self.validation_metrics.invalid_4844.increment(1);
                    return Err(InvalidPoolTransactionError::Eip4844(
                        Eip4844PoolTransactionError::MissingEip4844BlobSidecar,
                    ))
                }
            }
            EthBlobTransactionSidecar::Present(sidecar) => {
                let now = Instant::now();

                // [학습 주석] 원본은 활성 fork와 feature에 맞는 v0/v1 sidecar인지 먼저 확인합니다.

                // [학습 주석] Transaction reference 결속과 KZG proof 검증을 구현 타입에 맡깁니다.
                if let Err(err) = transaction.validate_blob(&sidecar, self.kzg_settings.get()) {
                    self.validation_metrics.invalid_4844.increment(1);
                    return Err(InvalidPoolTransactionError::Eip4844(
                        Eip4844PoolTransactionError::InvalidEip4844Blob(err),
                    ))
                }
                self.validation_metrics.blob_validation_duration.record(now.elapsed());
                maybe_blob_sidecar = Some(sidecar);
            }
        }
    }
    Ok(maybe_blob_sidecar)
}
