// reth-transaction-pool — TransactionOrdering (reth v1.x)

/// TX 정렬 trait — 풀 내부에서 TX 우선순위를 결정
/// 구현체 교체로 MEV 기반 정렬 등 커스텀 가능
pub trait TransactionOrdering: Send + Sync + 'static {
    /// 우선순위 값 타입 — Ord 필수 (BTreeMap 정렬에 사용)
    type PriorityValue: Ord + Clone + Default + Send + Sync;
    type Transaction: PoolTransaction;

    /// TX의 우선순위 값 계산
    /// base_fee를 인자로 받아 현재 블록 기준 우선순위 결정
    fn priority(
        &self,
        transaction: &Self::Transaction,
        base_fee: u64,
    ) -> Self::PriorityValue;
}

/// 기본 정렬: coinbase(제안자)에게 가는 팁 기준
/// effective_tip이 높은 TX가 먼저 블록에 포함
pub struct CoinbaseTipOrdering;

impl TransactionOrdering for CoinbaseTipOrdering {
    type PriorityValue = U256;     // 256비트 정수로 정밀한 비교
    type Transaction = PooledTransaction;

    fn priority(
        &self,
        transaction: &Self::Transaction,
        base_fee: u64,
    ) -> U256 {
        // effective_tip = min(max_priority_fee, max_fee - base_fee)
        // None이면 U256::ZERO — 가장 낮은 우선순위
        transaction
            .effective_tip_per_gas(Some(base_fee))
            .map(U256::from)
            .unwrap_or(U256::ZERO)
    }
}
