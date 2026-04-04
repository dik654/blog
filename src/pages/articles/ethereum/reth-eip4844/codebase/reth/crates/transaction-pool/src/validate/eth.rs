// reth-transaction-pool — EIP-4844 TX 검증 (reth v1.x)

/// Blob TX의 상태 비의존(stateless) 검증
/// 풀 진입 전 기본 조건을 확인
pub fn validate_stateless(&self, origin: TransactionOrigin, transaction: &Tx)
    -> Result<(), InvalidPoolTransactionError>
{
    // EIP-4844 타입인데 Cancun 포크 미활성 시 거부
    match transaction.ty() {
        EIP4844_TX_TYPE_ID if !self.eip4844 => {
            return Err(InvalidTransactionError::Eip4844Disabled.into())
        }
        _ => {}
    };

    // blob TX는 사이드카를 디스크에 저장하므로
    // 본체(consensus data)만 메모리에 유지
    // → input 바이트 기준으로 크기 제한
    if transaction.is_eip4844() {
        let tx_input_len = transaction.input().len();
        if tx_input_len > self.max_tx_input_bytes {
            return Err(InvalidPoolTransactionError::OversizedData {
                size: tx_input_len, limit: self.max_tx_input_bytes
            })
        }
    }

    // blob 개수 확인: 0이면 거부 (blob TX인데 blob 없음)
    if transaction.is_eip4844() {
        if !self.fork_tracker.is_cancun_activated() {
            return Err(InvalidTransactionError::TxTypeNotSupported.into())
        }
        let blob_count = transaction.blob_count().unwrap_or(0);
        if blob_count == 0 {
            return Err(Eip4844PoolTransactionError::NoEip4844Blobs.into())
        }
        // 포크별 최대 blob 개수 확인
        let max_blob_count = self.fork_tracker.max_blob_count();
        if blob_count > max_blob_count {
            return Err(Eip4844PoolTransactionError::TooManyEip4844Blobs {
                have: blob_count, permitted: max_blob_count
            }.into())
        }
    }
    Ok(())
}

/// Blob TX의 상태 의존(stateful) 검증 — KZG 사이드카 검증 포함
pub fn validate_eip4844(&self, transaction: &mut Tx)
    -> Result<Option<BlobTransactionSidecarVariant>, InvalidPoolTransactionError>
{
    if !transaction.is_eip4844() { return Ok(None) }

    match transaction.take_blob() {
        // 사이드카가 없는 경우 — 지원 안됨
        EthBlobTransactionSidecar::None =>
            Err(InvalidTransactionError::TxTypeNotSupported.into()),

        // re-org로 재주입된 TX — blob이 이미 BlobStore에 있는지 확인
        EthBlobTransactionSidecar::Missing => {
            if self.blob_store.contains(*transaction.hash()).is_ok_and(|c| c) {
                Ok(None) // 이미 검증 완료
            } else {
                Err(Eip4844PoolTransactionError::MissingEip4844BlobSidecar.into())
            }
        }

        // 사이드카 존재 — KZG 검증 수행
        EthBlobTransactionSidecar::Present(sidecar) => {
            transaction.validate_blob(&sidecar, self.kzg_settings.get())?;
            Ok(Some(sidecar))
        }
    }
}
