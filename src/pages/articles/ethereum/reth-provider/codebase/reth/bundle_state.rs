// reth/crates/revm/src/state/bundle_state.rs
// BundleState — revm 실행 결과의 상태 변경 캐시

use revm::db::states::{PlainStorageChangeset, PlainStorageRevert};
use reth_primitives::{Account, Address, B256, StorageKey, StorageValue};
use std::collections::HashMap;

/// BundleState는 revm이 블록 실행 후 생성하는 상태 변경 묶음.
/// 메모리에 캐시되어 DB 커밋 전까지 읽기 성능을 높인다.
/// ExecutionStage가 배치 실행 후 이 데이터를 DB에 기록.
pub struct BundleState {
    /// 변경된 계정 상태 (address → 변경 정보)
    /// 하나의 계정에 대해 잔액/nonce/코드/스토리지 변경을 모두 포함
    pub state: HashMap<Address, BundleAccount>,
    /// 블록별 되돌리기 정보 — reorg 시 사용
    /// reverts[block_idx] = vec![(address, 이전 상태)]
    pub reverts: Vec<Vec<(Address, AccountRevert)>>,
    /// 변경된 컨트랙트 바이트코드
    /// CREATE/CREATE2로 배포된 새 컨트랙트
    pub contracts: HashMap<B256, Bytecode>,
}

/// 개별 계정의 번들 상태
pub struct BundleAccount {
    pub info: Option<Account>,          // 현재 계정 정보
    pub original_info: Option<Account>, // 변경 전 원본 (revert용)
    /// 변경된 스토리지 슬롯만 보관 (전체 복사 X → 메모리 효율적)
    pub storage: HashMap<StorageKey, StorageSlot>,
    pub status: AccountStatus, // Changed, Created, Destroyed 등
}

impl BundleState {
    /// revm ExecutionResult에서 BundleState 생성
    /// revm 내부 타입을 Reth 타입으로 변환
    pub fn from_revm(state: revm::db::BundleState) -> Self {
        // state map + reverts + contracts 분리
        // revm의 HashMap 키를 Reth의 Address 타입으로 변환
        todo!()
    }
    /// DB에 커밋할 변경셋 추출
    /// HashMap → 정렬된 Vec으로 변환 (DB 기록 순서 보장)
    pub fn into_plain_state(self) -> PlainStorageChangeset {
        // AccountChangeSet, StorageChangeSet 테이블에 기록할 형태로 변환
        todo!()
    }
}
