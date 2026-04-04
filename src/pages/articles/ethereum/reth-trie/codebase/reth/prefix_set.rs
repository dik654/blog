// reth/crates/trie/trie/src/prefix_set.rs
// PrefixSet — 변경된 키 prefix만 추적하여 trie 재계산 범위 최소화

use reth_primitives::B256;
use std::collections::BTreeSet;

/// PrefixSet — 블록 실행 중 변경된 account/storage key를 수집.
/// trie 재해시 시 이 prefix에 해당하는 서브트리만 갱신한다.
///
/// 100만 계정 중 10개만 변경 → 10개 서브트리만 재계산.
/// Geth는 전체 dirty trie를 순회하며 커밋하므로 훨씬 느리다.
pub struct PrefixSet {
    /// 정렬된 키 집합 — 이진 탐색으로 "이 prefix가 변경되었는가?" 판단
    keys: BTreeSet<Nibbles>,
    /// 정렬 완료 여부
    sorted: bool,
}

impl PrefixSet {
    /// 빈 PrefixSet 생성
    pub fn new() -> Self {
        Self { keys: BTreeSet::new(), sorted: true }
    }
    /// 변경된 키 추가 (account address 또는 storage key)
    pub fn insert(&mut self, nibbles: Nibbles) {
        self.keys.insert(nibbles);
    }
    /// 주어진 prefix가 변경 키 집합에 포함되는지 확인.
    /// trie 순회 중 "이 서브트리를 재계산해야 하는가?" 판단에 사용.
    pub fn contains(&self, prefix: &Nibbles) -> bool {
        // BTreeSet range로 prefix 이상인 첫 키를 찾고,
        // 그 키가 실제로 prefix로 시작하는지 확인
        self.keys.range(prefix..).next()
            .map_or(false, |k| k.starts_with(prefix))
    }
}
