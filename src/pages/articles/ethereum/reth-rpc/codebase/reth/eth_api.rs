// reth/crates/rpc/rpc/src/eth/api/server.rs
// EthApiServer trait — JSON-RPC eth_* 메서드 구현

use reth_primitives::{Address, B256, U256};
use jsonrpsee::proc_macros::rpc;

/// EthApiServer — eth_* JSON-RPC 메서드의 trait 정의.
/// jsonrpsee의 #[rpc] 매크로가 자동으로 라우팅 코드를 생성한다.
/// Geth의 리플렉션 기반 라우팅과 달리 컴파일 타임에 타입 검증.
#[rpc(server, namespace = "eth")]
pub trait EthApiServer {
    /// 계정 잔액 조회
    #[method(name = "getBalance")]
    async fn balance(&self, address: Address, block: Option<BlockId>)
        -> RpcResult<U256>;

    /// EVM 호출 시뮬레이션 (상태 변경 없음)
    #[method(name = "call")]
    async fn call(&self, request: TransactionRequest, block: Option<BlockId>)
        -> RpcResult<Bytes>;

    /// 서명된 트랜잭션 제출 → txpool로 전달
    #[method(name = "sendRawTransaction")]
    async fn send_raw_transaction(&self, bytes: Bytes)
        -> RpcResult<B256>;

    /// 블록 번호로 블록 조회
    #[method(name = "getBlockByNumber")]
    async fn block_by_number(&self, number: BlockNumberOrTag, full: bool)
        -> RpcResult<Option<RichBlock>>;

    /// 트랜잭션 해시로 영수증 조회
    #[method(name = "getTransactionReceipt")]
    async fn transaction_receipt(&self, hash: B256)
        -> RpcResult<Option<TransactionReceipt>>;

    /// 현재 블록 번호
    #[method(name = "blockNumber")]
    async fn block_number(&self) -> RpcResult<U256>;
}
