// Reth v2.8.1 · crates/rpc/rpc-eth-api/src/helpers/state.rs
// 원문 함수에 `학습용 주석`만 덧붙였습니다.

fn spawn_blocking_io_with_state<F, R>(
    &self,
    at: BlockId,
    f: F,
) -> impl Future<Output = Result<R, Self::Error>> + Send
where
    Self: SpawnBlocking,
    F: FnOnce(Self, StateProviderBox) -> Result<R, Self::Error> + Send + 'static,
    R: Send + 'static,
{
    async move {
        // 학습용 주석: pending이면 local pending block/state를 먼저 비동기로 찾습니다.
        let pending = if at.is_pending() {
            self.local_pending_block_or_state().await.ok().flatten()
        } else {
            None
        };

        self.spawn_blocking_io(move |this| {
            // 학습용 주석: selector 한 번으로 이 작업이 읽을 StateProviderBox 하나를 정합니다.
            let state = match pending {
                Some(PendingStateSource::Block(pending)) => this
                    .provider()
                    .state_with_block_appended(
                        pending.block().parent_hash(),
                        pending.executed_block,
                    )
                    .or_else(|_| this.provider().state_by_block_id(BlockId::pending()))
                    .map_err(Self::Error::from_eth_err)?,
                Some(PendingStateSource::State(state)) => state,
                None if at.is_latest() => this.latest_state()?,
                None => {
                    this.provider().state_by_block_id(at).map_err(Self::Error::from_eth_err)?
                }
            };
            f(this, state)
        })
        .await
    }
}
