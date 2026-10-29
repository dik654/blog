// Reth v2.8.1
// crates/rpc/rpc-eth-api/src/core.rs
// crates/rpc/rpc-eth-api/src/helpers/state.rs
// 두 원문 함수 사이에 `학습용 주석`만 덧붙였습니다.

/// Handler for: `eth_getBalance`
async fn balance(&self, address: Address, block_number: Option<BlockId>) -> RpcResult<U256> {
    trace!(target: "rpc::eth", ?address, ?block_number, "Serving eth_getBalance");

    // 학습용 주석: JSON-RPC handler는 실제 상태 읽기를 EthState helper에 맡깁니다.
    Ok(EthState::balance(self, address, block_number).await?)
}

/// Returns balance of given account, at given blocknumber.
fn balance(
    &self,
    address: Address,
    block_id: Option<BlockId>,
) -> impl Future<Output = Result<U256, Self::Error>> + Send {
    // 학습용 주석: block selector가 없으면 default인 latest view를 선택합니다.
    self.spawn_blocking_io_with_state(block_id.unwrap_or_default(), move |_, state| {
        Ok(state
            .account_balance(&address)
            .map_err(Self::Error::from_eth_err)?
            // 학습용 주석: 계정이 없으면 잔액 0으로 반환합니다.
            .unwrap_or_default())
    })
}
