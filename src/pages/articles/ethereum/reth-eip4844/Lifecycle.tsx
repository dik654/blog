import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import RethRuntimeViz from "../reth-runtime-viz";
import type { CodeRef } from "@/components/code/types";

export default function Lifecycle({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob 생명주기</h2>
      <div className="not-prose mb-8">
        <RethRuntimeViz mode="blob-lifecycle" />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("canon-tracker", codeRefs["canon-tracker"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            BlobStoreCanonTracker — finalization 정리
          </span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "header-4844-standalone",
                codeRefs["header-4844-standalone"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            validate_4844_header_standalone()
          </span>
        </div>

        {/* ── Blob 생명주기 단계 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Blob 생명주기 5단계</h3>
        <div className="not-prose space-y-2 my-4">
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
              1
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                Proposal (제출)
              </p>
              <p className="text-xs text-foreground/60">
                <code className="text-xs">eth_sendRawTransaction</code>으로 blob
                TX + sidecar 제출 → validation → BlobPool + BlobStore 저장
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                Propagation (전파)
              </p>
              <p className="text-xs text-foreground/60">
                <code className="text-xs">NewPooledTransactionHashes</code>로
                hash만 announce → 요청 시 sidecar 전송 (eth/68)
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
              3
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                Inclusion (블록 포함)
              </p>
              <p className="text-xs text-foreground/60">
                BlobPool에서 활성 포크의 blob 한도 안에서 TX를 선택합니다.
                versioned hash는 transaction 본체에 있고, EL payload에는
                sidecar가 들어가지 않습니다.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
              4
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                Attestation (검증)
              </p>
              <p className="text-xs text-foreground/60">
                CL이 beacon block body의 KZG commitments와 consensus sidecars를
                검증합니다. 보관 기간은 consensus preset과 현재
                data-availability 규칙으로 정해집니다.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
              5
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                Retention 경계
              </p>
              <p className="text-xs text-foreground/60">
                protocol이 요구하는 availability window가 지난 sidecar는 일반
                노드에서 정리될 수 있습니다. 장기 검색 가능성은 별도 보존 주체의
                정책에 달려 있습니다.
              </p>
            </div>
          </div>
          <div className="rounded bg-muted/30 p-3 text-xs text-foreground/50">
            각 단계의 wall-clock 시간은 network 상태와 consensus configuration에
            따라 달라집니다. 구현은 slot·epoch·retention 경계를 기준으로
            판단합니다.
          </div>
        </div>
        <p>
          Blob은 pool 유입, sidecar 검증·보관, block inclusion, canonicalization과 cleanup의 다섯 경계를 거칩니다. Execution transaction에는 versioned hash가 남고 beacon block body에는 KZG commitment가 들어가지만, 실제 sidecar는 영구 execution state와 분리되어 consensus protocol이 정한 availability window 동안 전파·보관됩니다.
        </p>

        {/* ── BlobStoreCanonTracker ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BlobStoreCanonTracker — finalized 블록 추적
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              BlobStoreCanonTracker 필드
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code className="text-xs">
                  blob_txs_by_block: BTreeMap&lt;BlockNumber,
                  Vec&lt;TxHash&gt;&gt;
                </code>
              </li>
              <li>
                <code className="text-xs">
                  blob_store: Arc&lt;dyn BlobStore&gt;
                </code>
              </li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">
              BTreeMap은 블록 번호 순회와 범위 분할에 적합하며 개별 연산 비용은
              트리 크기에 따라 달라집니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              핵심 메서드
            </p>
            <div className="space-y-2">
              <div className="rounded bg-muted/40 p-2">
                <p className="text-xs font-semibold text-foreground/70">
                  on_new_canonical_block()
                </p>
                <p className="text-xs text-foreground/60">
                  EIP-4844 TX 필터 → blob_txs_by_block에 블록 번호별 등록
                </p>
              </div>
              <div className="rounded bg-muted/40 p-2">
                <p className="text-xs font-semibold text-foreground/70">
                  on_finalized_block()
                </p>
                <p className="text-xs text-foreground/60">
                  finalized 이하 블록의 blob TX 수집 →{" "}
                  <code className="text-xs">delete_all()</code> → 추적 목록 제거
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>BlobStoreCanonTracker</code>는 canonical block number와 그 block에 포함된 blob transaction을 연결해 finalization 이후 pool sidecar cleanup 대상을 찾습니다. 정렬된 <code>BTreeMap</code> key를 이용하면 finalized boundary 이하의 mapping을 한 범위로 분리할 수 있습니다. 이는 execution-layer txpool data 정리이며 consensus client의 sidecar retention rule과는 별개입니다.
        </p>

        {/* ── reorg 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Reorg 처리 — Blob 재주입
        </h3>
        <div className="not-prose space-y-2 my-4">
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
              1
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                Old chain blob TX 재주입
              </p>
              <p className="text-xs leading-5 text-foreground/60">
                Old canonical chain의 EIP-4844 transaction을 골라 <code>BlobStore</code>에서 sidecar를 찾습니다. 이미 검증해 보관한 sidecar가 있으면 <code className="text-xs">insert_with_sidecar(SkipKzg)</code> 경로로 pool에 다시 넣고, 없다면 transaction만으로 blob byte를 복원할 수 없으므로 network에서 다시 받아야 합니다.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                New chain blob TX 제거
              </p>
              <p className="text-xs text-foreground/60">
                새 canonical 체인에 이미 포함된 blob TX → pool에서{" "}
                <code className="text-xs">remove()</code>
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
              3
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground/90">
                CanonTracker 업데이트
              </p>
              <p className="text-xs text-foreground/60">
                <code className="text-xs">rewind_to(fork_point)</code> →{" "}
                <code className="text-xs">apply_new_chain()</code>
              </p>
            </div>
          </div>
          <div className="rounded bg-muted/30 p-3 text-xs text-foreground/50">
            핵심 최적화: BlobStore sidecar 재활용 시 KZG 재검증 skip → reorg
            지연 최소화
          </div>
        </div>
        <p>
          Reorg가 발생하더라도 old chain의 sidecar를 아직 보관하고 있으면 검증 결과와 함께 재사용할 수 있어 재주입 경로의 비용을 줄입니다. 다만 cleanup이 먼저 되었거나 node가 sidecar를 받지 못했다면 network 재요청이 필요하므로, 이 경로를 항상 cache hit한다고 가정해서는 안 됩니다.
        </p>
      </div>
    </section>
  );
}
