import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import LifecycleViz from './viz/LifecycleViz';
import type { CodeRef } from '@/components/code/types';

export default function Lifecycle({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob 생명주기</h2>
      <div className="not-prose mb-8"><LifecycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('canon-tracker', codeRefs['canon-tracker'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlobStoreCanonTracker — finalization 정리</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-4844-standalone', codeRefs['header-4844-standalone'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_4844_header_standalone()</span>
        </div>

        {/* ── Blob 생명주기 단계 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Blob 생명주기 5단계</h3>
        <div className="not-prose space-y-2 my-4">
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Proposal (제출)</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">eth_sendRawTransaction</code>으로 blob TX + sidecar 제출 → validation → BlobPool + BlobStore 저장</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Propagation (전파)</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">NewPooledTransactionHashes</code>로 hash만 announce → 요청 시 sidecar 전송 (eth/68)</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Inclusion (블록 포함)</p>
              <p className="text-xs text-foreground/60">BlobPool에서 TX 선택 (최대 6 blob/block) → <code className="text-xs">blob_versioned_hashes</code>를 헤더에 포함 (sidecar 미포함)</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">4</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Attestation (검증)</p>
              <p className="text-xs text-foreground/60">CL validators가 KZG proof 확인 → 모든 validator가 sidecar 보관 (~18일) → finalized 불가역</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">5</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Expiration (만료, ~18일)</p>
              <p className="text-xs text-foreground/60">CL/EL sidecar 삭제 → commitment만 헤더에 영구 보관 → 과거 blob은 archive 서비스에서 복원</p>
            </div>
          </div>
          <div className="rounded bg-muted/30 p-3 text-xs text-foreground/50">
            Proposal → Inclusion: 수 초~수 분 | Inclusion → Finalization: ~12-15분 | Finalization → Expiration: ~18일
          </div>
        </div>
        <p className="leading-7">
          Blob은 <strong>5단계 생명주기</strong>를 거침.<br />
          블록 헤더에는 versioned_hash만 영구 보관, 실제 데이터는 임시.<br />
          18일 후 폐기 → 이더리움 상태 팽창 방지.
        </p>

        {/* ── BlobStoreCanonTracker ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlobStoreCanonTracker — finalized 블록 추적</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">BlobStoreCanonTracker 필드</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">blob_txs_by_block: BTreeMap&lt;BlockNumber, Vec&lt;TxHash&gt;&gt;</code></li>
              <li><code className="text-xs">blob_store: Arc&lt;dyn BlobStore&gt;</code></li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">BTreeMap: 정렬 보장 + range() 쿼리 + O(1) first_entry</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">핵심 메서드</p>
            <div className="space-y-2">
              <div className="rounded bg-muted/40 p-2">
                <p className="text-xs font-semibold text-foreground/70">on_new_canonical_block()</p>
                <p className="text-xs text-foreground/60">EIP-4844 TX 필터 → blob_txs_by_block에 블록 번호별 등록</p>
              </div>
              <div className="rounded bg-muted/40 p-2">
                <p className="text-xs font-semibold text-foreground/70">on_finalized_block()</p>
                <p className="text-xs text-foreground/60">finalized 이하 블록의 blob TX 수집 → <code className="text-xs">delete_all()</code> → 추적 목록 제거</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>BlobStoreCanonTracker</code>가 <strong>finalized 블록 기반 정리</strong>.<br />
          블록 번호별 blob TX 매핑 유지 → finalized 이하 일괄 삭제.<br />
          BTreeMap으로 범위 쿼리 효율화 — O(log n) range + O(1) first_entry.
        </p>

        {/* ── reorg 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Reorg 처리 — Blob 재주입</h3>
        <div className="not-prose space-y-2 my-4">
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">Old chain blob TX 재주입</p>
              <p className="text-xs text-foreground/60">
                EIP-4844 TX 필터 → BlobStore에서 sidecar 조회.<br />
                sidecar 있음 → <code className="text-xs">insert_with_sidecar(SkipKzg)</code>로 pool 재주입.<br />
                sidecar 없음 → 복원 불가, 네트워크 재요청 필요.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">New chain blob TX 제거</p>
              <p className="text-xs text-foreground/60">새 canonical 체인에 이미 포함된 blob TX → pool에서 <code className="text-xs">remove()</code></p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">CanonTracker 업데이트</p>
              <p className="text-xs text-foreground/60"><code className="text-xs">rewind_to(fork_point)</code> → <code className="text-xs">apply_new_chain()</code></p>
            </div>
          </div>
          <div className="rounded bg-muted/30 p-3 text-xs text-foreground/50">
            핵심 최적화: BlobStore sidecar 재활용 시 KZG 재검증 skip → reorg 지연 최소화
          </div>
        </div>
        <p className="leading-7">
          Reorg 시 <strong>blob sidecar 재활용</strong> — BlobStore의 데이터 유지.<br />
          KZG 재검증 skip으로 reorg 처리 지연 최소.<br />
          sidecar 없는 경우에만 네트워크 재요청 (드문 케이스).
        </p>
      </div>
    </section>
  );
}
