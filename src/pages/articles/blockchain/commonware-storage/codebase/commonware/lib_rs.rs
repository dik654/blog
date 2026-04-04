// commonware/storage/src/lib.rs — Module root + Persistable trait

// Stability-gated module re-exports
pub mod merkle;
pub use merkle::{mmb, mmr};

mod bitmap;
pub mod qmdb;
pub use crate::bitmap::{BitMap as AuthenticatedBitMap};
pub mod bmt;
pub mod cache;
pub mod queue;

pub mod archive;
pub mod freezer;
pub mod index;
pub mod journal;
pub mod metadata;

/// Context = Storage + Clock + Metrics.
/// 모든 프리미티브가 초기화 시 받는 런타임 번들.
pub trait Context:
    commonware_runtime::Storage
    + commonware_runtime::Clock
    + commonware_runtime::Metrics {}

impl<T: commonware_runtime::Storage
    + commonware_runtime::Clock
    + commonware_runtime::Metrics> Context for T {}

/// Persistable — 모든 저장소의 라이프사이클 인터페이스.
/// MMR, QMDB, Archive 등 전부 구현.
pub trait Persistable {
    type Error;

    /// commit — 현재 상태를 페이지 캐시에 플러시.
    /// 크래시 후 복구 가능 상태 보장.
    fn commit(&self) -> impl Future<Output = Result<(), Self::Error>> + Send {
        self.sync() // 기본 구현: sync로 위임
    }

    /// sync — 페이지 캐시 → SSD (fsync).
    /// commit보다 강한 보장: 복구 불필요.
    fn sync(&self) -> impl Future<Output = Result<(), Self::Error>> + Send;

    /// destroy — 모든 저장 아티팩트 삭제 + 자원 해제.
    fn destroy(self) -> impl Future<Output = Result<(), Self::Error>> + Send;
}
