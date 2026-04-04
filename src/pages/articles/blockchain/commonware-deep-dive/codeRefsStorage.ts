import type { CodeRef } from './codeRefsTypes';

export const storageCodeRef: Record<string, CodeRef> = {
  'storage-trait': {
    path: 'commonware/runtime/src/lib.rs — Storage trait',
    lang: 'rust',
    highlight: [1, 20],
    desc: 'Storage — 파티션 기반 blob 저장소 추상화.\nopen()으로 blob 생성/열기, scan()으로 파티션 내 목록 조회.\nBlob trait이 실제 read/write/sync 담당.',
    code: `/// Interface to interact with storage.
/// Blobs are responsible for maintaining
/// synchronization.
pub trait Storage: Clone + Send + Sync + 'static {
    /// The readable/writeable storage buffer.
    type Blob: Blob;

    /// Open (or create) a blob in a given partition.
    fn open(&self, partition: &str, name: &[u8])
        -> impl Future<Output =
            Result<(Self::Blob, u64), Error>
        > + Send;

    /// Remove a blob from a given partition.
    /// If no name, remove the entire partition.
    fn remove(&self, partition: &str,
        name: Option<&[u8]>)
        -> impl Future<Output =
            Result<(), Error>
        > + Send;

    /// Return all blobs in a given partition.
    fn scan(&self, partition: &str)
        -> impl Future<Output =
            Result<Vec<Vec<u8>>, Error>
        > + Send;
}`,
    annotations: [
      { lines: [4, 4], color: 'sky', note: 'Storage — 로컬 파일시스템, 메모리, io_uring 등 여러 백엔드 가능' },
      { lines: [6, 6], color: 'emerald', note: 'Blob — read_at/write_at/resize/sync 메서드 제공. Clone으로 동시 접근' },
      { lines: [9, 12], color: 'amber', note: 'open() — (Blob, size) 반환. 버전 관리 지원 (open_versioned)' },
      { lines: [22, 26], color: 'violet', note: 'scan() — 파티션 내 모든 blob 이름 목록. 복구·마이그레이션에 활용' },
    ],
  },
};
