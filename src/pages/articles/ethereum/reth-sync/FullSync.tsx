import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { PIPELINE_STAGES } from "./FullSyncData";

export default function FullSync({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const sel = PIPELINE_STAGES.find((s) => s.id === activeStage);

  return (
    <section id="full-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full Pipeline 동기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("sync-pipeline", codeRefs["sync-pipeline"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            Pipeline 전체
          </span>
        </div>
        <p>
          Full Sync는 <strong>Pipeline</strong>에 등록된 stage를 dependency 순서대로 실행합니다. 각 stage가 현재 target까지 checkpoint를 전진시키면 다음 stage가 그 결과를 이어받고, 모든 stage가 target에 도달하면 한 cycle이 끝납니다. 그사이 더 높은 tip이 생겼다면 새 target으로 다음 cycle을 시작합니다.
        </p>
        <p>
          Pipeline의 중요한 특징은 각 stage가 <code>execute</code>뿐 아니라 <code>unwind</code>도 구현한다는 점입니다. Merkle stage에서 state root mismatch를 발견하거나 canonical chain이 바뀌면 영향을 받은 stage를 dependency의 역순으로 되돌린 뒤 올바른 block에서 다시 실행합니다. Database transaction과 checkpoint가 이 과정에서 중간 상태가 외부에 드러나는 것을 막습니다.
        </p>

        {/* ── 실행 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Pipeline::run() — 완전 동기화 루프
        </h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">
            Pipeline::run() — Full Sync 루프
          </p>
          <p className="text-sm text-foreground/80 mb-3">
            orchestrator가 정한 target → 등록된 Stage들을 순서대로 실행. 각
            Stage는 target과 checkpoint 범위를 받아 처리한다. 한 batch에서
            target을 다 처리하지 못하면 다음 실행에서 checkpoint 이후를
            이어가며, 전체 pipeline이 target에 도달하면 live path로 handoff한다.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="font-mono text-xs text-blue-500">Headers</p>
              <p className="text-xs text-foreground/50">헤더 다운로드</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="font-mono text-xs text-blue-500">Bodies</p>
              <p className="text-xs text-foreground/50">바디 다운로드</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="font-mono text-xs text-green-500">SenderRecovery</p>
              <p className="text-xs text-foreground/50">TX sender 복구</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="font-mono text-xs text-green-500">Execution</p>
              <p className="text-xs text-foreground/50">revm 실행</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="font-mono text-xs text-purple-500">Hashing</p>
              <p className="text-xs text-foreground/50">키 해싱</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="font-mono text-xs text-purple-500">Merkle</p>
              <p className="text-xs text-foreground/50">state_root 계산</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center col-span-2">
              <p className="font-mono text-xs text-orange-500">HistoryIndex</p>
              <p className="text-xs text-foreground/50">역인덱스 구축</p>
            </div>
          </div>
        </div>
        <p>
          Pipeline은 한 stage가 지나치게 오래 독점하지 않도록 정해진 threshold에서 cycle을 양보할 수 있으며, 다음 cycle은 저장된 checkpoint부터 이어집니다. 같은 checkpoint가 crash recovery 지점으로도 쓰이기 때문에 node가 재시작되어도 이미 완료한 긴 범위를 처음부터 반복하지 않습니다.
        </p>

        {/* ── 비용 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Pipeline 비용을 읽는 법
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              Stage별 주요 자원
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-foreground/70">Headers</span>
                <span className="text-foreground/50">peer·검증</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Bodies</span>
                <span className="text-foreground/50">network·write</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">SenderRecovery</span>
                <span className="text-foreground/50">CPU·parallelism</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70 font-semibold">
                  Execution
                </span>
                <span className="text-red-400">EVM·state I/O</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Hashing</span>
                <span className="text-foreground/50">state 규모</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Merkle</span>
                <span className="text-foreground/50">proof·cache</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">HistoryIndex</span>
                <span className="text-foreground/50">보관 설정·DB</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-foreground/80">합계</span>
                <span className="text-foreground/60">입력과 환경에서 측정</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded border border-border/40 p-2 text-center text-sm">
              <p className="text-foreground/60">CPU</p>
              <p className="text-foreground/50">execution·sender·hashing</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center text-sm">
              <p className="text-foreground/60">디스크</p>
              <p className="text-foreground/50">storage layout·pruning</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center text-sm">
              <p className="text-foreground/60">시작 데이터</p>
              <p className="text-foreground/50">ERA1·snapshot·P2P</p>
            </div>
          </div>
          <p className="text-sm text-foreground/60">
            완료 시간은 chain height만으로 정해지지 않는다. node mode, storage
            V1/V2, snapshot/ERA1 시작점, pruning, peer와 하드웨어를 같은
            benchmark 조건으로 기록해야 한다.
          </p>
        </div>
        <p>
          Stage별 checkpoint와 metric으로{" "}
          <strong>어느 자원이 병목인지 분리</strong>할 수 있습니다. Execution, state-root 계산과 history indexing의 상대 비용은 block 내용, database와 pruning 설정에 따라 달라지므로, 성능 수치는 hardware·chain range·stage configuration을 포함한 재현 가능한 조건과 함께 기록해야 합니다.
        </p>

        {/* ── unwind 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Unwind — reorg/검증실패 복구
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              unwind_to(target) — 역순 Stage 호출
            </p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>MerkleStage</code>에서 <code>state_root</code> 불일치 감지 →
              Pipeline이 Unwind 시그널 → 모든 Stage를 역순으로{" "}
              <code>unwind()</code> 호출.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex gap-2 text-foreground/80">
                <span className="text-foreground/50 font-mono text-xs shrink-0">
                  Headers
                </span>{" "}
                target+1 이후 삭제
              </div>
              <div className="flex gap-2 text-foreground/80">
                <span className="text-foreground/50 font-mono text-xs shrink-0">
                  Bodies
                </span>{" "}
                <code>BlockBodies</code>, <code>Transactions</code> 삭제
              </div>
              <div className="flex gap-2 text-foreground/80">
                <span className="text-foreground/50 font-mono text-xs shrink-0">
                  Senders
                </span>{" "}
                <code>TxSenders</code> 삭제
              </div>
              <div className="flex gap-2 text-foreground/80">
                <span className="text-foreground/50 font-mono text-xs shrink-0">
                  Execution
                </span>{" "}
                <code>AccountChangeSets</code>/<code>StorageChangeSets</code>{" "}
                역적용
              </div>
              <div className="flex gap-2 text-foreground/80">
                <span className="text-foreground/50 font-mono text-xs shrink-0">
                  Merkle
                </span>{" "}
                <code>AccountsTrie</code>/<code>StoragesTrie</code> 삭제
              </div>
            </div>
          </div>
          <div className="rounded border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-foreground/70">
            provider의 write transaction과 stage checkpoint 경계에서 unwind를
            커밋한다. 실제 backend와 static-file/RocksDB routing은 선택된
            storage layout을 따른다.
          </div>
        </div>
        <p>
          Unwind는 stage를 역순으로 호출해 downstream index부터 되돌리고, storage provider의 transaction과 checkpoint 경계가 부분적으로 되감긴 상태의 노출을 막습니다. 이후 검증된 canonical block을 기준으로 pipeline을 다시 실행해 database와 consensus view를 맞춥니다.
        </p>
      </div>

      {/* Pipeline stages */}
      <h3 className="text-lg font-semibold mb-3">Stage 실행 순서</h3>
      <div className="not-prose grid grid-cols-1 gap-2 mb-4 sm:flex">
        {PIPELINE_STAGES.map((s, i) => (
          <div
            key={s.id}
            className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-1"
          >
            <button
              onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
              className="min-w-0 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer sm:flex-1"
              style={{
                borderColor:
                  activeStage === s.id ? s.color : "var(--color-border)",
                background: activeStage === s.id ? `${s.color}10` : undefined,
              }}
            >
              <p
                className="font-mono text-xs font-bold"
                style={{ color: s.color }}
              >
                {s.name}
              </p>
              <p className="text-xs text-foreground/60 mt-1">{s.role}</p>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <span className="text-foreground/30 text-lg shrink-0">
                &#8594;
              </span>
            )}
          </div>
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
              {sel.name}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {sel.details}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>Pipeline의 트레이드오프</strong> — 긴 범위를 직접
          실행·검증하는 대신 CPU와 storage I/O를 사용합니다. Archive, full과 minimal은 sync algorithm의 이름이 아니라 어떤 historical data를 보존하거나 prune할지 정하는 별도의 node mode입니다.
        </p>
      </div>
    </section>
  );
}
