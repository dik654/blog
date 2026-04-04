// reth/crates/trie/trie/src/state_root.rs
// StateRoot — BundleState + DB에서 상태 루트 계산

use reth_db::DatabaseRef;
use reth_primitives::B256;
use reth_trie::prefix_set::PrefixSet;

/// StateRoot — 블록 실행 후 새 상태 루트를 계산하는 핵심 구조체.
/// DB의 기존 trie + BundleState의 변경사항을 합쳐서 루트 해시를 산출한다.
pub struct StateRoot<TX, H> {
    /// DB 읽기 트랜잭션 (기존 trie 노드 접근)
    tx: TX,
    /// 변경된 account prefix 집합
    changed_account_prefixes: PrefixSet,
    /// 변경된 storage prefix 집합 (account별)
    changed_storage_prefixes: HashMap<B256, PrefixSet>,
    /// HashedPostState — 해시된 주소/키 기반 상태
    hashed_state: H,
}

impl<TX: DbTx, H: HashedPostStateProvider> StateRoot<TX, H> {
    /// overlay_root — BundleState를 overlay로 적용하여 루트 계산.
    /// PrefixSet에 포함된 서브트리만 재해시한다.
    pub fn overlay_root(self) -> Result<B256> {
        // 1. account trie 순회 시작 (root부터)
        // 2. 각 branch에서 PrefixSet.contains() 확인
        //    - 변경 없음 → 기존 해시 재사용 (DB에서 읽기)
        //    - 변경 있음 → 자식 노드 재귀 탐색 → 리프에서 새 해시 계산
        // 3. storage trie도 동일한 방식으로 처리
        // 4. 최종 account trie root = 새 상태 루트
        let (root, _trie_updates) =
            self.calculate_root_with_updates()?;
        Ok(root)
    }

    /// 병렬 상태 루트 계산 — 각 account의 storage trie를
    /// 독립적으로 계산 후 account trie에 합산.
    pub fn overlay_root_parallel(self) -> Result<B256> {
        // rayon parallel iterator로 storage trie 병렬 계산
        todo!()
    }
}
