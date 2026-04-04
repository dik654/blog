// reth-transaction-pool — Pool 구조체 (reth v1.x)

pub struct Pool<V, T, S> {
    /// TX 검증기 (trait 기반 교체 가능)
    validator: V,
    /// TX 정렬 기준 (CoinbaseTipOrdering 등)
    ordering: T,
    /// 3개 서브풀 관리 (RwLock으로 동시 접근 제어)
    pool_inner: Arc<RwLock<PoolInner<T, S>>>,
}

pub struct PoolInner<T: TransactionOrdering, S> {
    /// 바로 실행 가능한 TX (nonce 연속 + fee 충족)
    pending_pool: PendingPool<T>,
    /// base fee 변동 대기 TX (nonce OK, fee 부족)
    basefee_pool: BasefeePool<T>,
    /// nonce gap이 있는 TX (이전 nonce TX 도착 대기)
    queued_pool: QueuedPool<T>,
    /// blob TX 전용 풀 (EIP-4844, ~128KB/blob)
    blob_pool: BlobPool<T>,
}

impl<V, T, S> Pool<V, T, S>
where
    V: TransactionValidator,
    T: TransactionOrdering,
{
    /// TX 풀에 새 TX 추가 — 검증 → 배치 → 알림 순서
    pub async fn add_transaction(
        &self,
        origin: TransactionOrigin, // External(P2P) or Local(RPC)
        tx: V::Transaction,
    ) -> PoolResult<TxHash> {
        // 1. 검증 — TransactionValidator trait 호출
        let validated = self.validator.validate(tx).await?;
        // 2. 내부 풀에 삽입 — ordering 기준으로 적절한 서브풀에 배치
        let mut inner = self.pool_inner.write();
        let added = inner.add_transaction(validated, self.ordering)?;
        // 3. 리스너에 알림 — PayloadBuilder, P2P 전파 등
        self.notify_listeners(&added);
        Ok(added.hash())
    }
}
