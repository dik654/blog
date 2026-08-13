import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { LIVE_EVENTS, REORG_STEPS } from "./LiveSyncData";
import RethRuntimeViz from "../reth-runtime-viz";

export default function LiveSync({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const selEvent = LIVE_EVENTS.find((e) => e.id === activeEvent);
  const [activeReorg, setActiveReorg] = useState<number | null>(null);

  return (
    <section id="live-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Live Sync & Reorg 처리</h2>
      <RethRuntimeViz mode="sync-handoff" />
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("sync-exex", codeRefs["sync-exex"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            ExExNotification
          </span>
        </div>
        <p>
          Backfill이 target에 도달하면 orchestrator는 block 처리의 소유권을 <strong>Live Sync</strong>로 넘깁니다. 이후 engine tree가 새 payload와 짧은 missing-parent range를 처리하고, consensus layer의 forkchoice가 바뀌면 canonical chain을 갱신합니다.
        </p>
        <p>
          Live Sync 이벤트는 Reth 고유의{" "}
          <strong>ExEx(Execution Extensions)</strong>로 전달됩니다. ExEx는 node process 안에서 canonicalization과 reorg notification을 받는 extension interface이므로 indexer, bridge와 분석 pipeline이 별도의 block ingestion stack 없이 Reth의 실행 결과를 소비할 수 있습니다.
        </p>

        {/* ── Engine API 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Engine API — CL이 EL을 조종
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">
                engine_newPayloadV3
              </p>
              <p className="text-sm text-foreground/80">
                새 블록 제공. <code>ExecutionPayloadV3</code> +{" "}
                <code>versioned_hashes</code>(EIP-4844) 수신 → 블록 실행 & 검증
                → <code>PayloadStatus</code> 반환.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">
                engine_forkchoiceUpdatedV3
              </p>
              <p className="text-sm text-foreground/80">
                head 결정. <code>ForkchoiceState</code>로 head/safe/finalized
                업데이트. <code>payload_attrs</code> 있으면 validator → 블록
                생성 시작.
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs font-bold text-purple-500 mb-2">
                engine_getPayloadV3
              </p>
              <p className="text-sm text-foreground/80">
                validator가 생성한 블록 조회. <code>PayloadId</code>로{" "}
                <code>payload_builder.resolve()</code> 호출.
              </p>
            </div>
          </div>
        </div>
        <p>
          Engine API는 consensus layer와 execution layer 사이의 표준 경계입니다. Consensus layer가 <code>newPayload</code>로 block을 전달하면 execution layer가 이를 실행·검증해 status를 반환하고, <code>forkchoiceUpdated</code>로 head·safe·finalized block을 알려 주면 engine tree가 canonical view를 갱신합니다.
        </p>

        {/* ── Live Sync 비용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Live Sync의 지연 예산
        </h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">
            측정해야 할 구간
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-foreground/70">payload 수신</span>
              <span className="text-foreground/50">decode·precheck</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">TX 준비</span>
              <span className="text-foreground/50">sender·prewarm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70 font-semibold">
                revm 실행
              </span>
              <span className="text-foreground/50">gas·state access</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">state root</span>
              <span className="text-foreground/50">
                proof·sparse trie cache
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">persistence</span>
              <span className="text-foreground/50">backend·backpressure</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Engine 응답</span>
              <span className="text-foreground/50">status deadline</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">ExEx 알림</span>
              <span className="text-foreground/50">consumer lag</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-foreground/80">합계</span>
              <span className="text-green-500">block·환경별 측정</span>
            </div>
          </div>
          <p className="text-sm text-foreground/60">
            프로토콜 deadline과 실제 처리 시간은 분리한다. gas 사용량, cold
            state access, trie cache, storage backpressure와 ExEx lag를 함께
            관측한다.
          </p>
        </div>
        <p className="leading-7">
          Live Sync의 목표는{" "}
          <strong>
            다음 consensus deadline 전에 실행 유효성과 forkchoice 입력을 제공
          </strong>
          하는 것입니다. 고정된 millisecond 수치를 보장한다고 가정하기보다 tail latency와 persistence backlog를 관찰하고, gap이 커지면 live path에 계속 쌓아 두지 않고 backfill pipeline으로 전환해야 합니다.
        </p>

        {/* ── ExEx 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExEx 이벤트 스트림</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              ExExNotification enum
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded border border-green-500/30 bg-green-500/5 p-3">
                <p className="text-xs font-bold text-green-500">
                  ChainCommitted
                </p>
                <p className="text-sm text-foreground/70">
                  <code>new: Arc&lt;Chain&gt;</code> — 새 블록 추가
                </p>
              </div>
              <div className="rounded border border-orange-500/30 bg-orange-500/5 p-3">
                <p className="text-xs font-bold text-orange-500">
                  ChainReorged
                </p>
                <p className="text-sm text-foreground/70">
                  <code>old</code> + <code>new: Arc&lt;Chain&gt;</code> — reorg
                </p>
              </div>
              <div className="rounded border border-red-500/30 bg-red-500/5 p-3">
                <p className="text-xs font-bold text-red-400">ChainReverted</p>
                <p className="text-sm text-foreground/70">
                  <code>old: Arc&lt;Chain&gt;</code> — 블록 제거
                </p>
              </div>
            </div>
          </div>
          <div className="rounded border border-border/40 bg-muted/20 p-3 text-sm text-foreground/70">
            ExEx는 notifications 스트림을 순회하며 이벤트를 처리하고 완료 높이를
            알려 pruning 가능 범위를 전진시킨다. 소비자는 필요에 따라 자체 DB나
            외부 queue를 사용할 수 있으며 처리 지연은 extension 구현에 달려
            있다.
          </div>
        </div>
        <p>
          ExEx는 canonical block과 reorg를 낮은 지연으로 전달하지만 message broker 자체는 아닙니다. Indexer, bridge와 search pipeline이 node 내부에서 직접 구독할 수 있는 대신, durable checkpoint·backpressure·외부 delivery와 재처리 정책은 extension이 설계해야 합니다.
        </p>
      </div>

      {/* ExEx events */}
      <h3 className="text-lg font-semibold mb-3">ExExNotification 이벤트</h3>
      <div className="not-prose grid grid-cols-1 gap-3 mb-4 sm:grid-cols-3">
        {LIVE_EVENTS.map((e) => (
          <button
            key={e.id}
            onClick={() => setActiveEvent(activeEvent === e.id ? null : e.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor:
                activeEvent === e.id ? e.color : "var(--color-border)",
              background: activeEvent === e.id ? `${e.color}10` : undefined,
            }}
          >
            <p
              className="font-mono text-xs font-bold"
              style={{ color: e.color }}
            >
              {e.name}
            </p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selEvent && (
          <motion.div
            key={selEvent.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden"
          >
            <p
              className="font-semibold text-sm mb-2"
              style={{ color: selEvent.color }}
            >
              {selEvent.name}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {selEvent.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reorg handling */}
      <h3 className="text-lg font-semibold mb-3">Reorg 처리 단계</h3>
      <div className="not-prose space-y-2 mb-4">
        {REORG_STEPS.map((s) => (
          <button
            key={s.step}
            onClick={() =>
              setActiveReorg(activeReorg === s.step ? null : s.step)
            }
            className="w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor:
                activeReorg === s.step ? "#6366f1" : "var(--color-border)",
              background: activeReorg === s.step ? "#6366f110" : undefined,
            }}
          >
            <div className="flex gap-3 items-center">
              <span className="font-mono text-xs font-bold text-foreground/50 shrink-0">
                Step {s.step}
              </span>
              <span className="text-sm font-medium">{s.title}</span>
            </div>
            <AnimatePresence>
              {activeReorg === s.step && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm text-foreground/70 mt-2 pl-12"
                >
                  {s.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>ExEx = 노드 내부 확장</strong> — 별도 인프라 없이 블록
          event를 node의 canonicalization과 함께 처리합니다. 느린 ExEx는 pruning 가능한 height를 붙잡아 disk usage를 늘릴 수 있으므로, 처리와 durability가 끝난 지점을 <code>FinishedHeight</code> signal로 알려야 합니다.
        </p>
      </div>
    </section>
  );
}
