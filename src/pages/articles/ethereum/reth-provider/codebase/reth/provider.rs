// reth/crates/storage/provider/src/providers/state/latest.rs
// LatestStateProviderRef — 최신 상태 접근 Provider

use reth_db::DatabaseRef;
use reth_primitives::{Account, Address, B256, Bytecode, StorageKey, StorageValue};
use reth_trie::updates::TrieUpdates;

/// StateProvider trait — 상태 접근의 핵심 추상화.
/// 모든 상태 소스(메모리, DB, 아카이브)가 이 trait을 구현한다.
/// 호출자는 상태 소스가 무엇인지 알 필요 없음.
pub trait StateProvider: Send + Sync {
    /// 계정 정보 조회 (nonce, balance, code_hash)
    /// None이면 계정이 존재하지 않음
    fn account(&self, address: &Address) -> Result<Option<Account>>;
    /// 스토리지 슬롯 값 조회
    /// (address, key) 쌍으로 특정 슬롯의 현재 값 반환
    fn storage(&self, address: &Address, key: &StorageKey)
        -> Result<Option<StorageValue>>;
    /// 바이트코드 해시로 컨트랙트 코드 조회
    /// code_hash → Bytecode 매핑
    fn bytecode_by_hash(&self, hash: &B256) -> Result<Option<Bytecode>>;
}

/// LatestStateProviderRef — MDBX tx 위에서 최신 상태를 제공.
/// tx: MDBX 읽기 트랜잭션 (MVCC — 다른 쓰기와 격리)
/// static_file: finalized 이전 블록의 고대 데이터
pub struct LatestStateProviderRef<'a, TX> {
    tx: &'a TX,                         // MDBX 읽기 트랜잭션
    static_file: StaticFileProviderRef<'a>, // 고대 블록 아카이브
}

impl<TX: DbTx> StateProvider for LatestStateProviderRef<'_, TX> {
    fn account(&self, address: &Address) -> Result<Option<Account>> {
        // PlainAccountState 테이블에서 직접 조회
        // B+tree 인덱스로 O(log N) 접근
        self.tx.get::<tables::PlainAccountState>(address.clone())
    }
    fn storage(&self, addr: &Address, key: &StorageKey)
        -> Result<Option<StorageValue>> {
        // PlainStorageState 테이블 — (address, key) 복합 키로 조회
        // 하나의 계정에 수천 개 슬롯이 있어도 효율적
        self.tx.get::<tables::PlainStorageState>((addr.clone(), *key))
    }
    fn bytecode_by_hash(&self, hash: &B256) -> Result<Option<Bytecode>> {
        // Bytecodes 테이블 — code_hash로 바이트코드 조회
        self.tx.get::<tables::Bytecodes>(hash.clone())
    }
}
