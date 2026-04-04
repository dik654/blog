// reth/crates/net/eth-wire-types/src/message.rs
// EthMessage — eth 프로토콜 메시지 타입 정의

use reth_primitives::{Header, B256, TransactionSigned};

/// EthMessage — eth/68 프로토콜의 전체 메시지 enum.
/// 각 variant는 RLP 인코딩/디코딩을 자동으로 지원한다.
#[derive(Debug, Clone)]
pub enum EthMessage {
    /// 피어 상태 교환 (체인 ID, 제네시스, 최신 블록 등)
    Status(StatusMessage),
    /// 새 블록 해시 알림 (hash + block number)
    NewBlockHashes(NewBlockHashes),
    /// 새 트랜잭션 전파 (전체 TX 데이터)
    Transactions(Vec<TransactionSigned>),
    /// TX 해시만 전파 (상대가 GetPooledTx로 요청)
    NewPooledTransactionHashes(NewPooledTransactionHashes68),
    /// 블록 헤더 요청
    GetBlockHeaders(GetBlockHeaders),
    /// 블록 헤더 응답
    BlockHeaders(Vec<Header>),
    /// 블록 바디 요청
    GetBlockBodies(GetBlockBodies),
    /// 블록 바디 응답 (트랜잭션 + 엉클 + 출금)
    BlockBodies(Vec<BlockBody>),
    /// 풀에서 TX 전체 데이터 요청
    GetPooledTransactions(GetPooledTransactions),
    /// 풀 TX 응답
    PooledTransactions(Vec<TransactionSigned>),
    /// 영수증 요청
    GetReceipts(GetReceipts),
    /// 영수증 응답
    Receipts(Vec<Vec<Receipt>>),
}
