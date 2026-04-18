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
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">BlobStore trait 메서드</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">insert(tx, data)</code> / <code className="text-xs">insert_all()</code> — 저장</li>
              <li><code className="text-xs">get(tx)</code> / <code className="text-xs">get_all(txs)</code> — 조회</li>
              <li><code className="text-xs">delete(tx)</code> / <code className="text-xs">delete_all(txs)</code> — 삭제</li>
              <li><code className="text-xs">cleanup()</code> — 만료 blob 정리</li>
              <li><code className="text-xs">data_size_hint()</code> / <code className="text-xs">blobs_len()</code> — 통계</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">구현체 3가지</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">DiskFileBlobStore</code> — 프로덕션 (디스크 + LRU 캐시)</li>
              <li><code className="text-xs">InMemoryBlobStore</code> — 테스트용 (HashMap)</li>
              <li><code className="text-xs">NoopBlobStore</code> — blob 미지원 체인</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">trait bound: <code className="text-xs">Send + Sync + 'static</code></p>
          </div>
        </div>
        <p className="leading-7">
          <code>BlobStore</code> trait이 <strong>저장소 교체 가능성</strong> 보장.<br />
          프로덕션은 디스크 기반, 테스트는 메모리 기반 → 동일 API.<br />
          cleanup() 메서드가 만료 blob 정리 — 18일 지난 blob 자동 삭제.
        </p>

        {/* ── DiskFileBlobStore ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DiskFileBlobStore — 디스크 저장소</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">DiskFileBlobStore 필드</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">path: PathBuf</code> — 디스크 경로 (~/.reth/blobs/)</li>
              <li><code className="text-xs">cache: RwLock&lt;LruCache&gt;</code> — 자주 접근 blob 메모리 유지</li>
              <li><code className="text-xs">txs_to_delete: RwLock&lt;HashSet&gt;</code> — 지연 삭제 대기</li>
              <li><code className="text-xs">config</code> — max_cached_entries(100), open_files(64)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">파일 레이아웃</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">~/.reth/blobs/{'{'}xx{'}'}/{'{'}tx_hash{'}'}.blob</code><br />
              첫 바이트로 256개 하위 디렉토리 분산 → 파일시스템 부담 감소.
            </p>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">insert_one() 흐름</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
              <span className="rounded bg-muted/40 px-2 py-1">1. 파일 경로 계산</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">2. 디렉토리 생성</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">3. bincode 직렬화 + fs::write</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">4. LRU 캐시 추가</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>DiskFileBlobStore</code>는 <strong>파일시스템 기반</strong>.<br />
          첫 바이트로 디렉토리 분산 → 256개 하위 폴더에 파일 분배.<br />
          LRU 캐시로 자주 쓰는 blob 메모리 보관 → 디스크 I/O 최소화.
        </p>

        {/* ── 지연 삭제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">지연 삭제 (Deferred Cleanup)</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-red-400 mb-2">즉시 삭제 (단순)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">delete(tx) → fs::remove_file()</code><br />
              문제: 다른 스레드가 같은 파일 읽는 중이면 race condition.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">지연 삭제 (Reth 방식)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">delete(tx)</code> → <code className="text-xs">txs_to_delete</code>에 추가 + 캐시 제거.<br />
              실제 삭제는 <code className="text-xs">cleanup()</code>에서 배치 수행.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2">cleanup() 호출 시점</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>블록 확정 시 (TX의 sidecar 삭제)</li>
              <li>주기적 (5분마다)</li>
              <li>노드 종료 시</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">장점</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>insert/delete hot path 빠름</li>
              <li>배치 삭제로 파일시스템 효율</li>
              <li>디스크 I/O 시간 분산</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <strong>지연 삭제</strong>가 hot path 성능 보호.<br />
          insert/get 작업 중 delete로 lock 경합 방지 → throughput 향상.<br />
          cleanup()은 주기적 호출 (5분 등) → 파일 I/O 배치화.
        </p>
      </div>
    </section>
  );
}
