// reth/crates/storage/db/src/tables/mod.rs
// tables! 매크로 — 전체 DB 테이블 스키마 정의

use reth_primitives::{Account, Address, Header, B256, U256};
use reth_db_api::table::{Table, DupSort};

/// tables! 매크로 — Key/Value 타입과 함께 모든 테이블을 선언.
/// MDBX의 named database (dbi)로 각각 생성된다.
tables! {
    /// 표준 블록 헤더 — BlockNumber → Header
    table Headers { BlockNumber => Header }
    /// 블록 바디 (tx 인덱스 범위) — BlockNumber → StoredBlockBody
    table BlockBodies { BlockNumber => StoredBlockBody }
    /// 개별 트랜잭션 — TxNumber → TransactionSigned
    table Transactions { TxNumber => TransactionSigned }
    /// 트랜잭션 영수증 — TxNumber → Receipt
    table Receipts { TxNumber => Receipt }
    /// 계정 상태 (최신) — Address → Account
    table PlainAccountState { Address => Account }
    /// 스토리지 상태 (최신) — (Address, StorageKey) → StorageValue
    /// DupSort: 같은 Address 아래 여러 키를 정렬 저장
    dupsort table PlainStorageState { Address => (StorageKey, StorageValue) }
    /// 바이트코드 — B256(code_hash) → Bytecode
    table Bytecodes { B256 => Bytecode }
    /// 계정 변경 이력 — BlockNumber → AccountBeforeTx
    table AccountChangeSets { BlockNumber => AccountBeforeTx }
    /// 스토리지 변경 이력 — BlockNumberAddress → StorageEntry
    dupsort table StorageChangeSets {
        BlockNumberAddress => StorageEntry
    }
    /// 계정 Trie 노드 — Nibbles → BranchNodeCompact
    table AccountsTrie { StoredNibbles => BranchNodeCompact }
    /// 스토리지 Trie 노드 — (B256, StoredNibbles) → BranchNodeCompact
    table StoragesTrie { B256StoredNibbles => BranchNodeCompact }
    /// 트랜잭션 해시 → 블록번호 인덱스
    table TransactionHashNumbers { B256 => BlockNumber }
}
