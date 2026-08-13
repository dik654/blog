import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import RethRuntimeViz from "../reth-runtime-viz";
import type { CodeRef } from "@/components/code/types";
import { SYNC_MODES, SYNC_COMPARISONS } from "./OverviewData";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = SYNC_MODES.find((m) => m.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reth sync는 catch-up pipeline을 live import로 handoff한다</h2>
      <ContentBoundary article="reth-sync" />
      <RethRuntimeViz mode="sync-paths" />

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          실행 클라이언트의 동기화는 로컬에 없는 canonical block 범위를
          확보하고, 실행·state root 검증·인덱싱·영속화를 올바른 순서로 따라잡는
          과정이다.
        </p>
        <p>
          Reth는 긴 block 범위를 순차 처리하기 좋은 staged pipeline과 chain head 주변의 fork를 빠르게 바꾸기 좋은 engine tree를 함께 사용합니다. Backfill orchestrator는 local head와 consensus head 사이의 gap에 따라 두 실행 경로의 소유권을 전환합니다. 아래 비교는 별도의 사용자용 sync mode 이름이 아니라 이 세 내부 역할을 구분하기 위한 것입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          세 역할, 두 실행 경로
        </h3>
        <p>
          실제 block 실행은 pipeline과 live engine tree가 담당하며, backfill은 큰 gap에서 pipeline을 구동한 뒤 live path로 제어권을 넘기는 coordination layer입니다. 공개 modular snapshot은 초기 database를 빠르게 배포하는 별도의 bootstrap 수단이지 세 번째 peer sync protocol은 아닙니다.
        </p>

        {/* ── FCU 기반 동기화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          FCU — CL과 EL의 동기화 트리거
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                ForkchoiceUpdatedV3 (CL → EL)
              </p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>
                  <code>head_block_hash: B256</code> — 현재 체인 head
                </li>
                <li>
                  <code>safe_block_hash: B256</code> — 다음 epoch 안전 블록
                </li>
                <li>
                  <code>finalized_block_hash: B256</code> — 되돌릴 수 없는 블록
                </li>
                <li>
                  <code>
                    payload_attributes: Option&lt;PayloadAttributes&gt;
                  </code>{" "}
                  — 블록 생성 요청
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                EL 응답 — PayloadStatus
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex gap-2 text-foreground/80">
                  <span className="text-green-500 shrink-0">VALID</span> 이미
                  실행 완료, head 업데이트
                </div>
                <div className="flex gap-2 text-foreground/80">
                  <span className="text-red-400 shrink-0">INVALID</span> 블록
                  검증 실패, CL에 거부 알림
                </div>
                <div className="flex gap-2 text-foreground/80">
                  <span className="text-yellow-500 shrink-0">SYNCING</span> 블록
                  미확보, 백그라운드 다운로드 중
                </div>
              </div>
            </div>
          </div>
          <div className="rounded border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-foreground/70">
            PoS 이후 canonical head·safe·finalized 선택은 CL의 forkchoice
            입력에서 온다. EL은 payload 실행 유효성을 독립적으로 판단하며, 알 수
            없는 head의 gap을 다운로드·backfill한다.
          </div>
        </div>
        <p>
          <strong>
            CL은 forkchoice 문맥을 제공하고 EL은 실행 유효성을 판정
          </strong>
          합니다. <code>forkchoiceUpdated</code>가 가리킨 head를 local database에서 찾지 못하면 execution layer는 missing parent를 내려받거나 gap이 큰 경우 backfill을 시작합니다. 이는 execution layer가 자체 fork choice로 canonical tip을 정하던 PoW 시기의 구조와 근본적으로 다릅니다.
        </p>

        {/* ── BlockchainTree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BlockchainTree — canonical/non-canonical 체인 관리
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              BlockchainTree 구조체
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>
                <code>canonical_head: B256</code> — canonical chain tip
              </span>
              <span>
                <code>finalized: BlockNumber</code> — 되돌릴 수 없는 블록
              </span>
              <span>
                <code>blocks / chains</code> — 아직 영속화되지 않은 실행 분기
              </span>
              <span>
                <code>children: HashMap&lt;B256, Vec&lt;B256&gt;&gt;</code> —
                fork 추적
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">
                insert_block()
              </p>
              <p className="text-sm text-foreground/80">
                블록 실행 & 검증 → 부모가 canonical이면 확장(
                <code>BlockStatus::Valid</code>), 아니면 fork 후보 추가(
                <code>BlockStatus::Accepted</code>).
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-purple-500 mb-2">
                update_canonical()
              </p>
              <p className="text-sm text-foreground/80">
                FCU에 따라 canonical chain 재결정. canonical → non-canonical:
                unwind / non-canonical → canonical: apply.
              </p>
            </div>
          </div>
        </div>
        <p>
          <code>BlockchainTree</code>는 chain head 주변의 여러 fork 후보와 실행 결과를 유지하므로 consensus layer가 다른 fork를 선택했을 때 전체 pipeline을 다시 돌리지 않고 canonical chain을 전환할 수 있습니다. 메모리에 유지할 범위, persistence와 backpressure의 구체적인 한계는 현재 engine-tree configuration에서 확인해야 합니다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 mb-4 sm:grid-cols-3">
        {SYNC_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : "var(--color-border)",
              background: selected === m.id ? `${m.color}10` : undefined,
            }}
          >
            <p
              className="font-mono font-bold text-sm"
              style={{ color: m.color }}
            >
              {m.label}
            </p>
            <p className="text-xs text-foreground/60 mt-1">{m.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div
            key={sel.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden"
          >
            <p
              className="font-semibold text-sm mb-2"
              style={{ color: sel.color }}
            >
              {sel.label}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">
              {sel.details}
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
              {sel.why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison table */}
      <div className="not-prose overflow-x-auto mb-6">
        <table className="min-w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-2 text-left">항목</th>
              <th className="border border-border px-4 py-2 text-left">
                Pipeline
              </th>
              <th className="border border-border px-4 py-2 text-left">
                Backfill
              </th>
              <th className="border border-border px-4 py-2 text-left">Live</th>
            </tr>
          </thead>
          <tbody>
            {SYNC_COMPARISONS.map((c) => (
              <tr key={c.aspect}>
                <td className="border border-border px-4 py-2 font-medium">
                  {c.aspect}
                </td>
                <td className="border border-border px-4 py-2">{c.pipeline}</td>
                <td className="border border-border px-4 py-2">{c.backfill}</td>
                <td className="border border-border px-4 py-2">{c.live}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="paper-reth-sync-source" className="scroll-mt-24">
        <CitationBlock source="paradigmxyz/reth — staged sync and engine tree" href="https://github.com/paradigmxyz/reth" citeKey={1} type="code">
          Reth source는 pipeline, backfill orchestrator와 live engine path의 구현 근거입니다. Stage 구성·threshold·package layout은 고정한 release 또는 SHA 범위로만 읽습니다.
        </CitationBlock>
      </div>
      <div id="paper-engine-api-sync" className="scroll-mt-24">
        <CitationBlock source="Ethereum Engine API specification" href="https://github.com/ethereum/execution-apis/tree/main/src/engine" citeKey={2}>
          Engine API는 consensus client가 head·safe·finalized와 payload를 execution client에 전달하는 표준 경계입니다. Reth의 internal backfill scheduling이나 database checkpoint를 규정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
