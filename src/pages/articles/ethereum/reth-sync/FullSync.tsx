import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { PIPELINE_STAGES } from './FullSyncData';

export default function FullSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const sel = PIPELINE_STAGES.find(s => s.id === activeStage);

  return (
    <section id="full-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full Pipeline 동기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-pipeline', codeRefs['sync-pipeline'])} />
          <span className="text-[10px] text-muted-foreground self-center">Pipeline 전체</span>
        </div>
        <p className="leading-7">
          Full Sync는 <strong>Pipeline</strong>에 등록된 Stage들을 순서대로 실행한다.<br />
          각 Stage가 target(tip) 블록까지 처리를 완료하면 다음 Stage로 넘어간다.<br />
          모든 Stage가 완료되면 한 사이클이 끝나고, 새 tip이 있으면 다시 반복한다.
        </p>
        <p className="leading-7">
          Pipeline 패턴의 핵심은 <strong>unwind</strong>(되감기) 지원이다.<br />
          MerkleStage에서 상태 루트 불일치가 발생하면, 이전 Stage들을 역순으로 unwind한다.<br />
          각 Stage는 execute/unwind 인터페이스를 구현하며, 이를 통해 파이프라인 전체가 원자적으로 동작한다.
        </p>

        {/* ── 실행 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pipeline::run() — 완전 동기화 루프</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">Pipeline::run() — Full Sync 루프</p>
          <p className="text-sm text-foreground/80 mb-3">
            CL로부터 tip 수신(FCU) → 등록된 Stage들을 순서대로 실행. 각 Stage는 <code>ExecInput</code>(target, checkpoint)을 받아 처리. <code>output.done</code>이 아니면 break → 다음 사이클에서 이어서. 모든 Stage가 tip 도달 시 live sync 전환.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="rounded border border-border/40 p-2 text-center"><p className="font-mono text-xs text-blue-500">Headers</p><p className="text-xs text-foreground/50">헤더 다운로드</p></div>
            <div className="rounded border border-border/40 p-2 text-center"><p className="font-mono text-xs text-blue-500">Bodies</p><p className="text-xs text-foreground/50">바디 다운로드</p></div>
            <div className="rounded border border-border/40 p-2 text-center"><p className="font-mono text-xs text-green-500">SenderRecovery</p><p className="text-xs text-foreground/50">TX sender 복구</p></div>
            <div className="rounded border border-border/40 p-2 text-center"><p className="font-mono text-xs text-green-500">Execution</p><p className="text-xs text-foreground/50">revm 실행</p></div>
            <div className="rounded border border-border/40 p-2 text-center"><p className="font-mono text-xs text-purple-500">Hashing</p><p className="text-xs text-foreground/50">키 해싱</p></div>
            <div className="rounded border border-border/40 p-2 text-center"><p className="font-mono text-xs text-purple-500">Merkle</p><p className="text-xs text-foreground/50">state_root 계산</p></div>
            <div className="rounded border border-border/40 p-2 text-center col-span-2"><p className="font-mono text-xs text-orange-500">HistoryIndex</p><p className="text-xs text-foreground/50">역인덱스 구축</p></div>
          </div>
        </div>
        <p className="leading-7">
          파이프라인 사이클은 <strong>모든 Stage가 tip 도달할 때까지</strong> 반복.<br />
          일부 Stage만 느리면 해당 Stage에서 break → 다음 사이클에서 이어서 진행.<br />
          체크포인트 기반 재시작으로 크래시 후에도 중단 지점부터 계속.
        </p>

        {/* ── 소요 시간 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Full Sync 소요 시간 분석</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Stage별 소요 시간 (2026 기준, 1800만 블록)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
              <div className="flex justify-between"><span className="text-foreground/70">Headers</span><span className="text-foreground/50">~2h</span></div>
              <div className="flex justify-between"><span className="text-foreground/70">Bodies</span><span className="text-foreground/50">~6h</span></div>
              <div className="flex justify-between"><span className="text-foreground/70">SenderRecovery</span><span className="text-foreground/50">~4h</span></div>
              <div className="flex justify-between"><span className="text-foreground/70 font-semibold">Execution</span><span className="text-red-400">~12h</span></div>
              <div className="flex justify-between"><span className="text-foreground/70">Hashing</span><span className="text-foreground/50">~3h</span></div>
              <div className="flex justify-between"><span className="text-foreground/70">Merkle</span><span className="text-foreground/50">~5h</span></div>
              <div className="flex justify-between"><span className="text-foreground/70">HistoryIndex</span><span className="text-foreground/50">~4h</span></div>
              <div className="flex justify-between font-semibold"><span className="text-foreground/80">합계</span><span className="text-foreground/60">~36h</span></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded border border-border/40 p-2 text-center text-sm">
              <p className="text-foreground/60">최소(8코어+SATA)</p>
              <p className="text-foreground/50">~5일</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center text-sm">
              <p className="text-foreground/60">권장(16코어+NVMe)</p>
              <p className="text-foreground/50">~1.5일</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center text-sm">
              <p className="text-foreground/60">고성능(32코어)</p>
              <p className="text-foreground/50">~1일</p>
            </div>
          </div>
          <p className="text-sm text-foreground/60">Geth 동일 하드웨어 기준 ~5~10일(Reth의 5배+). Stage 분리 이점: 병목 파악 용이, 재시작 시 완료 stage 건너뜀.</p>
        </div>
        <p className="leading-7">
          Full Sync는 <strong>36시간 전후</strong> 소요 (적절한 하드웨어 기준).<br />
          ExecutionStage가 최장 — revm 실행이 CPU 집약적.<br />
          Stage 분리 덕분에 병목 파악 용이 → 하드웨어 튜닝 타겟 명확.
        </p>

        {/* ── unwind 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Unwind — reorg/검증실패 복구</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">unwind_to(target) — 역순 Stage 호출</p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>MerkleStage</code>에서 <code>state_root</code> 불일치 감지 → Pipeline이 Unwind 시그널 → 모든 Stage를 역순으로 <code>unwind()</code> 호출.
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 font-mono text-xs shrink-0">Headers</span> target+1 이후 삭제</div>
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 font-mono text-xs shrink-0">Bodies</span> <code>BlockBodies</code>, <code>Transactions</code> 삭제</div>
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 font-mono text-xs shrink-0">Senders</span> <code>TxSenders</code> 삭제</div>
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 font-mono text-xs shrink-0">Execution</span> <code>AccountChangeSets</code>/<code>StorageChangeSets</code> 역적용</div>
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 font-mono text-xs shrink-0">Merkle</span> <code>AccountsTrie</code>/<code>StoragesTrie</code> 삭제</div>
            </div>
          </div>
          <div className="rounded border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-foreground/70">
            MDBX 트랜잭션 단위로 unwind 수행 → 실패 시 자동 롤백. 다음 실행 시 같은 target에서 재시작.
          </div>
        </div>
        <p className="leading-7">
          Unwind는 <strong>역순 stage 호출</strong>로 상태 복원.<br />
          MDBX 트랜잭션 원자성 덕분에 unwind 중 크래시해도 안전.<br />
          검증 실패 → unwind → 재실행 사이클로 합의 복원.
        </p>
      </div>

      {/* Pipeline stages */}
      <h3 className="text-lg font-semibold mb-3">Stage 실행 순서</h3>
      <div className="not-prose flex gap-2 mb-4">
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
              className="flex-1 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: activeStage === s.id ? s.color : 'var(--color-border)',
                background: activeStage === s.id ? `${s.color}10` : undefined,
              }}>
              <p className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.name}</p>
              <p className="text-xs text-foreground/60 mt-1">{s.role}</p>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <span className="text-foreground/30 text-lg shrink-0">&#8594;</span>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Full Sync의 트레이드오프</strong> — 수일이 걸리지만 모든 블록을 직접 검증한다.<br />
          Archive 노드(과거 상태 전체 보존)나 블록 탐색기처럼 보안과 완전성이 중요한 인프라에 적합하다.
        </p>
      </div>
    </section>
  );
}
