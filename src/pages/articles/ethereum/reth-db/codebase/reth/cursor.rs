// reth/crates/storage/db-api/src/cursor.rs
// Cursor trait — MDBX 커서 기반 데이터 순회

use reth_db_api::table::Table;
use std::ops::RangeBounds;

/// 읽기 전용 커서 — seek, walk_range 등 조회 연산.
/// MDBX의 B+tree 리프 노드를 순서대로 탐색한다.
pub trait DbCursorRO<T: Table> {
    /// 키 위치로 이동 (B+tree 탐색, O(log n))
    fn seek_exact(&mut self, key: T::Key)
        -> Result<Option<(T::Key, T::Value)>>;
    /// 키 범위 순회 — Iterator 반환
    fn walk_range(&mut self, range: impl RangeBounds<T::Key>)
        -> Result<Walker<'_, T>>;
    /// 현재 위치에서 다음 항목
    fn next(&mut self) -> Result<Option<(T::Key, T::Value)>>;
    /// 첫 번째 항목으로 이동
    fn first(&mut self) -> Result<Option<(T::Key, T::Value)>>;
}

/// 읽기/쓰기 커서 — upsert, delete 등 변경 연산
pub trait DbCursorRW<T: Table>: DbCursorRO<T> {
    /// 키가 있으면 갱신, 없으면 삽입 (B+tree insert)
    fn upsert(&mut self, key: T::Key, value: T::Value)
        -> Result<()>;
    /// 현재 커서 위치의 항목 삭제
    fn delete_current(&mut self) -> Result<()>;
}
