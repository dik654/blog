// Reth v2.8.1 · crates/transaction-pool/src/validate/eth.rs
// Upstream lines 452–658에서 Blob admission 이해에 필요한 분기만 발췌했습니다.

pub fn validate_stateless(
    &self,
    origin: TransactionOrigin,
    transaction: &Tx,
) -> Result<(), InvalidPoolTransactionError> {
    // [학습 주석] 활성화되지 않은 transaction type은 즉시 거부합니다.
    match transaction.ty() {
        EIP4844_TX_TYPE_ID if !self.eip4844 => {
            return Err(InvalidTransactionError::Eip4844Disabled.into())
        }
        LEGACY_TX_TYPE_ID | EIP2930_TX_TYPE_ID | EIP1559_TX_TYPE_ID |
        EIP4844_TX_TYPE_ID | EIP7702_TX_TYPE_ID => {}
        ty if !self.other_tx_types.bit(ty as usize) => {
            return Err(InvalidTransactionError::TxTypeNotSupported.into())
        }
        _ => {}
    };

    // [학습 주석] Blob 원문은 별도 sidecar이므로 input과 access list 크기를 제한합니다.
    if transaction.is_eip4844() {
        let tx_size = transaction.input().len().saturating_add(
            transaction.access_list().map(|list| list.length()).unwrap_or_default(),
        );
        if tx_size > self.max_tx_input_bytes {
            self.validation_metrics.rejected_oversized_data.increment(1);
            return Err(InvalidPoolTransactionError::OversizedData {
                size: tx_size,
                limit: self.max_tx_input_bytes,
            })
        }
    }

    // [학습 주석] 실제 원본은 이 사이에서 gas limit, fee 관계, local fee cap,
    // minimum priority fee, chain id와 intrinsic gas를 순서대로 확인합니다.

    // [학습 주석] Blob transaction은 활성 fork에서 1개 이상의 Blob을 참조해야 합니다.
    if transaction.is_eip4844() {
        if !self.fork_tracker.is_cancun_activated() {
            return Err(InvalidTransactionError::TxTypeNotSupported.into())
        }

        let blob_count = transaction.blob_count().unwrap_or(0);
        if blob_count == 0 {
            self.validation_metrics.invalid_4844.increment(1);
            return Err(InvalidPoolTransactionError::Eip4844(
                Eip4844PoolTransactionError::NoEip4844Blobs,
            ))
        }

        let max_blob_count = self.fork_tracker.max_blob_count();
        if blob_count > max_blob_count {
            self.validation_metrics.invalid_4844.increment(1);
            return Err(InvalidPoolTransactionError::Eip4844(
                Eip4844PoolTransactionError::TooManyEip4844Blobs {
                    have: blob_count,
                    permitted: max_blob_count,
                },
            ))
        }
    }

    if let Some(check) = &self.additional_stateless_validation {
        check(origin, transaction)?;
    }
    Ok(())
}
