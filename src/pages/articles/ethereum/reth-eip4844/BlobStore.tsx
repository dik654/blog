import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobStoreViz from './viz/BlobStoreViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobStore({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-store" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlobStore 저장소</h2>
      <div className="not-prose mb-8"><BlobStoreViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('disk-blobstore', codeRefs['disk-blobstore'])} />
          <span className="text-[10px] text-muted-foreground self-center">DiskFileBlobStore — 디스크 + LRU 캐시</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('disk-inner-ops', codeRefs['disk-inner-ops'])} />
          <span className="text-[10px] text-muted-foreground self-center">insert_one / get_one 내부 구현</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('mem-blobstore', codeRefs['mem-blobstore'])} />
          <span className="text-[10px] text-muted-foreground self-center">InMemoryBlobStore — 테스트용</span>
        </div>

        {/* ── BlobStore trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlobStore trait — 저장소 추상화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait BlobStore: Send + Sync + 'static {
    /// TX 해시로 blob sidecar 저장
    fn insert(
        &self,
        tx: B256,
        data: BlobTransactionSidecar,
    ) -> Result<(), BlobStoreError>;

    /// 여러 blob 일괄 저장
    fn insert_all(
        &self,
        blobs: Vec<(B256, BlobTransactionSidecar)>,
    ) -> Result<(), BlobStoreError>;

    /// TX 해시로 blob 조회
    fn get(
        &self,
        tx: B256,
    ) -> Result<Option<BlobTransactionSidecar>, BlobStoreError>;

    /// TX 해시들에 대한 blob 조회 (일괄)
    fn get_all(
        &self,
        txs: Vec<B256>,
    ) -> Result<Vec<(B256, BlobTransactionSidecar)>, BlobStoreError>;

    /// 저장된 blob 삭제 (cleanup)
    fn delete(&self, tx: B256) -> Result<(), BlobStoreError>;

    /// 삭제 대기 목록에 추가
    fn delete_all(&self, txs: Vec<B256>) -> Result<(), BlobStoreError>;

    /// 만료된 blob 정리
    fn cleanup(&self) -> Result<BlobStoreCleanupStat, BlobStoreError>;

    /// 저장소 크기 (바이트)
    fn data_size_hint(&self) -> Option<usize>;

    /// 저장된 blob 개수
    fn blobs_len(&self) -> usize;
}

// 구현체:
// - DiskFileBlobStore: 프로덕션 (디스크 + LRU 캐시)
// - InMemoryBlobStore: 테스트용 (HashMap)
// - NoopBlobStore: blob 미지원 체인`}
        </pre>
        <p className="leading-7">
          <code>BlobStore</code> trait이 <strong>저장소 교체 가능성</strong> 보장.<br />
          프로덕션은 디스크 기반, 테스트는 메모리 기반 → 동일 API.<br />
          cleanup() 메서드가 만료 blob 정리 — 18일 지난 blob 자동 삭제.
        </p>

        {/* ── DiskFileBlobStore ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DiskFileBlobStore — 디스크 저장소</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct DiskFileBlobStore {
    /// 디스크 저장 경로 (보통 ~/.reth/blobs/)
    path: PathBuf,

    /// LRU 캐시 (자주 접근하는 blob 메모리 유지)
    cache: RwLock<LruCache<B256, Arc<BlobTransactionSidecar>>>,

    /// 삭제 대기 목록 (지연 삭제)
    txs_to_delete: RwLock<HashSet<B256>>,

    /// 설정값
    config: DiskFileBlobStoreConfig,
}

pub struct DiskFileBlobStoreConfig {
    pub max_cached_entries: u32,  // 기본 100
    pub open_files: u32,           // 기본 64
}

// 파일 레이아웃:
// ~/.reth/blobs/
//   ├── ab/
//   │   ├── abc123....blob   (TX hash로 명명)
//   │   └── abc456....blob
//   ├── cd/
//   │   └── cdef....blob
//   └── ...
//
// 첫 바이트로 디렉토리 분산 (256개) → 파일시스템 부담 감소

// insert_one 흐름:
fn insert_one(&self, tx: B256, data: &BlobTransactionSidecar) -> Result<()> {
    // 1. 파일 경로 계산
    let file_path = self.path.join(
        format!("{:02x}/{}.blob", tx.0[0], hex::encode(tx))
    );

    // 2. 디렉토리 생성 (없으면)
    fs::create_dir_all(file_path.parent().unwrap())?;

    // 3. 바이너리로 직렬화 후 저장 (atomic write)
    let encoded = bincode::serialize(data)?;
    fs::write(&file_path, encoded)?;

    // 4. 캐시에 추가
    self.cache.write().put(tx, Arc::new(data.clone()));

    Ok(())
}`}
        </pre>
        <p className="leading-7">
          <code>DiskFileBlobStore</code>는 <strong>파일시스템 기반</strong>.<br />
          첫 바이트로 디렉토리 분산 → 256개 하위 폴더에 파일 분배.<br />
          LRU 캐시로 자주 쓰는 blob 메모리 보관 → 디스크 I/O 최소화.
        </p>

        {/* ── 지연 삭제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">지연 삭제 (Deferred Cleanup)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 즉시 삭제 vs 지연 삭제
//
// 즉시 삭제 (단순):
// delete(tx) → fs::remove_file() → O(1)
// 문제: 다른 스레드가 같은 파일 읽는 중이면 race condition
//
// 지연 삭제 (Reth 방식):
// delete(tx) → txs_to_delete에 추가 → O(1)
// 실제 삭제는 cleanup()에서

fn delete(&self, tx: B256) -> Result<()> {
    self.txs_to_delete.write().insert(tx);
    self.cache.write().pop(&tx);  // 캐시도 제거
    Ok(())
}

fn cleanup(&self) -> Result<BlobStoreCleanupStat> {
    let txs: Vec<B256> = self.txs_to_delete.write().drain().collect();
    let mut deleted = 0u64;
    let mut errors = 0u64;

    for tx in txs {
        let file_path = self.tx_to_path(tx);
        match fs::remove_file(&file_path) {
            Ok(_) => deleted += 1,
            Err(_) => errors += 1,
        }
    }

    Ok(BlobStoreCleanupStat { deleted, errors })
}

// cleanup 호출 시점:
// - 블록 확정 시 (블록 내 TX 포함 시 sidecar 삭제 가능)
// - 주기적 (예: 5분마다)
// - 노드 종료 시

// 장점:
// 1. insert/delete hot path 빠름
// 2. 배치 삭제로 파일시스템 효율
// 3. 디스크 I/O 시간 분산`}
        </pre>
        <p className="leading-7">
          <strong>지연 삭제</strong>가 hot path 성능 보호.<br />
          insert/get 작업 중 delete로 lock 경합 방지 → throughput 향상.<br />
          cleanup()은 주기적 호출 (5분 등) → 파일 I/O 배치화.
        </p>
      </div>
    </section>
  );
}
