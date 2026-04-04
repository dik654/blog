// reth/crates/storage/provider/src/providers/static_file/mod.rs
// StaticFileProvider — finalized 블록의 고대 데이터 아카이브

use reth_primitives::{Header, Receipt, TransactionSigned};
use std::path::PathBuf;

/// StaticFileProvider — finalized 이후 변경 불가능한 블록 데이터를
/// flat file로 저장. Geth의 Freezer와 유사한 역할.
///
/// MDBX에서 고대 데이터를 분리하면:
/// 1. DB 크기 감소 → B+tree 깊이 감소 → 최신 데이터 조회 빠름
/// 2. flat file은 순차 읽기 최적화 (블록 번호 = 오프셋)
/// 3. MDBX compaction 부담 감소
pub struct StaticFileProvider {
    /// 아카이브 파일 디렉토리
    path: PathBuf,
    /// 각 세그먼트 타입별 최신 블록 번호
    highest_block: DashMap<StaticFileSegment, BlockNumber>,
}

/// 세그먼트 타입 — 헤더, 트랜잭션, 영수증 각각 별도 파일
pub enum StaticFileSegment {
    Headers,
    Transactions,
    Receipts,
}

impl StaticFileProvider {
    /// 블록 번호로 헤더 조회 (파일 오프셋 직접 접근)
    pub fn header_by_number(&self, num: BlockNumber)
        -> Result<Option<Header>> {
        // segment file 열기 → 고정 크기 오프셋 계산 → 읽기
        todo!()
    }
}
