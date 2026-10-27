// Reth v2.8.1 · crates/transaction-pool/src/validate/mod.rs
// Upstream lines 27–55 and 99–132.

#[derive(Debug)]
pub enum TransactionValidationOutcome<T: PoolTransaction> {
    // [학습 주석] 현재 head에서 유효하며 pool insertion을 시도할 수 있습니다.
    Valid {
        balance: U256,
        state_nonce: u64,
        bytecode_hash: Option<B256>,
        transaction: ValidTransaction<T>,
        propagate: bool,
        authorities: Option<Vec<Address>>,
    },
    // [학습 주석] Transaction 규칙 위반입니다. 입력과 이유를 함께 보존합니다.
    Invalid(T, InvalidPoolTransactionError),
    // [학습 주석] Provider 같은 검증 의존성이 실패했습니다. 입력 위반과 구별합니다.
    Error(TxHash, Box<dyn core::error::Error + Send + Sync>),
}

#[derive(Debug)]
pub enum ValidTransaction<T> {
    Valid(T),
    // [학습 주석] 새 Blob transaction은 검증을 통과한 sidecar를 함께 전달합니다.
    ValidWithSidecar {
        transaction: T,
        sidecar: PooledBlobSidecar,
    },
}

impl<T> ValidTransaction<T> {
    pub fn new(transaction: T, sidecar: Option<PooledBlobSidecar>) -> Self {
        if let Some(sidecar) = sidecar {
            Self::ValidWithSidecar { transaction, sidecar }
        } else {
            Self::Valid(transaction)
        }
    }
}
