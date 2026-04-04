// reth/crates/net/downloaders/src/snap/mod.rs
// Snap sync — 상태 다운로드 (GetAccountRange, GetStorageRanges)

use reth_primitives::{Account, Address, B256};

/// SnapSync — 상태 스냅샷 동기화.
/// 전체 블록 재실행 없이 최신 상태를 직접 다운로드한다.
/// Full sync: 제네시스→팁 전체 실행 (며칠) vs Snap: 상태만 다운 (수 시간)
pub struct SnapSync {
    /// 피어에서 상태 범위 요청을 관리하는 태스크
    account_fetcher: AccountRangeFetcher,
    /// 스토리지 범위 다운로더
    storage_fetcher: StorageRangeFetcher,
    /// 다운로드한 상태의 무결성 증명 검증기
    proof_verifier: TrieProofVerifier,
}

impl SnapSync {
    /// 계정 범위 요청 — 피어에게 [start_hash..end_hash] 계정 요청
    pub async fn fetch_account_range(
        &self,
        root: B256,        // 상태 루트 (검증용)
        start: B256,       // 시작 해시
        limit: B256,       // 종료 해시
    ) -> Result<Vec<(Address, Account)>> {
        // 1. GetAccountRange 메시지 전송
        // 2. 응답에 포함된 Merkle proof로 무결성 검증
        // 3. 검증 통과 → DB에 기록, 다음 범위로 진행
        todo!()
    }

    /// 스토리지 범위 요청 — 특정 계정의 storage 슬롯 다운로드
    pub async fn fetch_storage_ranges(
        &self,
        root: B256,
        accounts: Vec<B256>,
    ) -> Result<Vec<StorageRangeResult>> {
        todo!()
    }
}
