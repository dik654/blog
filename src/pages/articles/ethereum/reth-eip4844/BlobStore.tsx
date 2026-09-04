import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import RethRuntimeViz from "../reth-runtime-viz";
import type { CodeRef } from "@/components/code/types";

export default function BlobStore({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="blob-store" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlobStore 저장소</h2>
      <div className="not-prose mb-8">
        <RethRuntimeViz mode="blob-store" />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("disk-blobstore", codeRefs["disk-blobstore"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            DiskFileBlobStore — 디스크 + LRU 캐시
          </span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("disk-inner-ops", codeRefs["disk-inner-ops"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            insert_one / get_one 내부 구현
          </span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("mem-blobstore", codeRefs["mem-blobstore"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            InMemoryBlobStore — 테스트용
          </span>
        </div>

        {/* ── BlobStore trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BlobStore trait — 저장소 추상화
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              BlobStore trait 메서드
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">insert(tx, data)</code> /{" "}
                <code className="text-xs">insert_all()</code> — 저장
              </li>
              <li>
                <code className="text-xs">get(tx)</code> /{" "}
                <code className="text-xs">get_all(txs)</code> — 조회
              </li>
              <li>
                <code className="text-xs">delete(tx)</code> /{" "}
                <code className="text-xs">delete_all(txs)</code> — 삭제
              </li>
              <li>
                <code className="text-xs">cleanup()</code> — 만료 blob 정리
              </li>
              <li>
                <code className="text-xs">data_size_hint()</code> /{" "}
                <code className="text-xs">blobs_len()</code> — 통계
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              구현체 3가지
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">DiskFileBlobStore</code> — 프로덕션
                (디스크 + LRU 캐시)
              </li>
              <li>
                <code className="text-xs">InMemoryBlobStore</code> — 테스트용
                (HashMap)
              </li>
              <li>
                <code className="text-xs">NoopBlobStore</code> — blob 미지원
                체인
              </li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">
              trait bound:{" "}
              <code className="text-xs">Send + Sync + 'static</code>
            </p>
          </div>
        </div>
        <p>
          <code>BlobStore</code> trait은 txpool이 storage implementation을 알지 않고 sidecar를 insert·read·delete하도록 만듭니다. Production에서는 disk-backed store를, test에서는 in-memory implementation을 같은 API로 사용할 수 있습니다. <code>cleanup()</code>은 canonical·finalized lifecycle에서 불필요해진 execution-layer pool sidecar를 정리하며, consensus client의 sidecar retention 기간과 같은 정책으로 해석하면 안 됩니다.
        </p>

        {/* ── DiskFileBlobStore ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          DiskFileBlobStore — 디스크 저장소
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              DiskFileBlobStore 필드
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">path: PathBuf</code> — 디스크 경로
                (~/.reth/blobs/)
              </li>
              <li>
                <code className="text-xs">cache: RwLock&lt;LruCache&gt;</code> —
                자주 접근 blob 메모리 유지
              </li>
              <li>
                <code className="text-xs">
                  txs_to_delete: RwLock&lt;HashSet&gt;
                </code>{" "}
                — 지연 삭제 대기
              </li>
              <li>
                <code className="text-xs">config</code> — cache와 열린 파일 수
                등 운영 한도
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              파일 레이아웃
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              <code className="text-xs">
                ~/.reth/blobs/{"{"}xx{"}"}/{"{"}tx_hash{"}"}.blob
              </code>
              처럼 transaction hash prefix로 하위 directory를 나눠 한 directory에 file이 몰리는 것을 피합니다. 실제 data directory와 layout은 현재 configuration과 implementation에서 확인해야 합니다.
            </p>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              insert_one() 흐름
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
              <span className="rounded bg-muted/40 px-2 py-1">
                1. 파일 경로 계산
              </span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">
                2. 디렉토리 생성
              </span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">
                3. bincode 직렬화 + fs::write
              </span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">
                4. LRU 캐시 추가
              </span>
            </div>
          </div>
        </div>
        <p>
          <code>DiskFileBlobStore</code>는 hash prefix로 file path를 분산하고 implementation configuration에 따라 memory cache를 둘 수 있습니다. Cache hit은 filesystem read를 피하지만 실제 latency와 write amplification은 sidecar 크기, concurrency, filesystem과 storage device에서 직접 측정해야 합니다.
        </p>

        {/* ── 지연 삭제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          지연 삭제 (Deferred Cleanup)
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-red-400 mb-2">
              즉시 삭제 (단순)
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              <code className="text-xs">delete(tx) → fs::remove_file()</code>을 요청 경로에서 바로 실행하면 concurrent reader와의 coordination이 필요하고 작은 filesystem operation이 latency-sensitive path에 섞입니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              지연 삭제 (Reth 방식)
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              <code className="text-xs">delete(tx)</code> →{" "}
              <code className="text-xs">txs_to_delete</code>에 추가하고 cache에서는 보이지 않게 만든 뒤, 실제 file removal은 <code className="text-xs">cleanup()</code> 경로에서 모아 수행합니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2">
              cleanup() 호출 시점
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>블록 확정 시 (TX의 sidecar 삭제)</li>
              <li>구현이 정한 주기적 maintenance 시점</li>
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
        <p>
          Delayed deletion은 logical removal과 physical file cleanup을 분리합니다. Cleanup 시점에 대기 중인 항목을 묶을 수 있습니다. 다만
          crash recovery와 retry, concurrent read의 정확한 behavior는 현재 implementation을 기준으로 봅니다. batch가 언제나 더 빠르다고
          단정할 수는 없습니다.
        </p>
      </div>
    </section>
  );
}
