// reth-transaction-pool — TransactionValidator trait (reth v1.x)

/// TX 검증 trait — 구현체를 교체하면 검증 로직 커스텀 가능
/// L2 체인에서 L1 fee 확인 등 추가 검증을 쉽게 추가
pub trait TransactionValidator: Send + Sync {
    type Transaction: PoolTransaction;

    /// TX 유효성 검증 (비동기)
    /// 6단계 검증 체인을 순서대로 통과해야 풀에 삽입
    async fn validate(
        &self,
        transaction: Self::Transaction,
    ) -> TransactionValidationOutcome<Self::Transaction> {
        // 기본 검증 체인:
        // 1. 체인 ID 확인 — 현재 네트워크와 일치해야 함
        // 2. 서명 검증 (ecrecover) — 서명자 주소 복구
        // 3. nonce 확인 — 현재 상태 대비 유효한 nonce
        // 4. 잔액 확인 — gas_limit * gas_price + value ≤ balance
        // 5. intrinsic gas 확인 — TX 데이터 크기 기반 최소 가스
        // 6. max_fee >= base_fee 확인 — EIP-1559 요구사항
    }

    /// TX가 로컬인지 확인
    /// 로컬 TX는 풀이 가득 찰 때 제거 우선순위가 낮음
    fn is_local(&self, tx: &Self::Transaction) -> bool;
}

/// 검증 결과 — 3가지 케이스
pub enum TransactionValidationOutcome<T> {
    /// 검증 통과 — propagate=true면 P2P로 전파
    Valid { transaction: T, propagate: bool },
    /// 검증 실패 — 구체적인 에러 이유 포함
    Invalid(T, InvalidTransactionError),
    /// 내부 오류 — 검증 자체가 실패
    Error(T, Box<dyn std::error::Error>),
}
