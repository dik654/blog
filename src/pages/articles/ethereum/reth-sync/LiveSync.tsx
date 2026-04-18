import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { LIVE_EVENTS, REORG_STEPS } from './LiveSyncData';

export default function LiveSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const selEvent = LIVE_EVENTS.find(e => e.id === activeEvent);
  const [activeReorg, setActiveReorg] = useState<number | null>(null);

  return (
    <section id="live-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Live Sync & Reorg 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-exex', codeRefs['sync-exex'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExNotification</span>
        </div>
        <p className="leading-7">
          최신 블록에 도달하면 Pipeline에서 <strong>Live Sync</strong>로 자동 전환된다.<br />
          BlockchainTree가 새 블록을 수신하고, reorg(체인 재구성) 발생 시 공통 조상까지 되감아 새 체인으로 전환한다.
        </p>
        <p className="leading-7">
          Live Sync 이벤트는 Reth 고유의 <strong>ExEx(Execution Extensions)</strong>로 전달된다.<br />
          ExEx는 노드 프로세스 내부에서 실행되는 확장 모듈로, 인덱서, 브릿지, 분석 도구를 별도 인프라 없이 구현할 수 있다.
        </p>

        {/* ── Engine API 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Engine API — CL이 EL을 조종</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">engine_newPayloadV3</p>
              <p className="text-sm text-foreground/80">새 블록 제공. <code>ExecutionPayloadV3</code> + <code>versioned_hashes</code>(EIP-4844) 수신 → 블록 실행 & 검증 → <code>PayloadStatus</code> 반환.</p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">engine_forkchoiceUpdatedV3</p>
              <p className="text-sm text-foreground/80">head 결정. <code>ForkchoiceState</code>로 head/safe/finalized 업데이트. <code>payload_attrs</code> 있으면 validator → 블록 생성 시작.</p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs font-bold text-purple-500 mb-2">engine_getPayloadV3</p>
              <p className="text-sm text-foreground/80">validator가 생성한 블록 조회. <code>PayloadId</code>로 <code>payload_builder.resolve()</code> 호출.</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Engine API가 CL ↔ EL 통신의 <strong>유일한 인터페이스</strong>.<br />
          CL이 <code>newPayload</code>로 블록 전달 → EL이 실행 & 검증 → 응답.<br />
          CL이 <code>forkchoiceUpdated</code>로 head 지정 → EL이 canonical chain 업데이트.
        </p>

        {/* ── Live Sync 성능 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Live Sync 블록당 처리 시간</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">블록당 처리 시간 breakdown (12초 슬롯)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
            <div className="flex justify-between"><span className="text-foreground/70">payload 수신</span><span className="text-foreground/50">~10ms</span></div>
            <div className="flex justify-between"><span className="text-foreground/70">TX sender 복구</span><span className="text-foreground/50">~50ms</span></div>
            <div className="flex justify-between"><span className="text-foreground/70 font-semibold">revm 실행</span><span className="text-foreground/50">~200ms</span></div>
            <div className="flex justify-between"><span className="text-foreground/70">state_root 계산</span><span className="text-foreground/50">~50ms</span></div>
            <div className="flex justify-between"><span className="text-foreground/70">DB commit</span><span className="text-foreground/50">~100ms</span></div>
            <div className="flex justify-between"><span className="text-foreground/70">Engine API 응답</span><span className="text-foreground/50">~20ms</span></div>
            <div className="flex justify-between"><span className="text-foreground/70">ExEx 알림</span><span className="text-foreground/50">~10ms</span></div>
            <div className="flex justify-between font-semibold"><span className="text-foreground/80">합계</span><span className="text-green-500">~440ms</span></div>
          </div>
          <p className="text-sm text-foreground/60">여유 ~11.5초(RPC 처리, ExEx, 다음 블록 대기). DeFi 폭주 시에도 ~1.5초 이내.</p>
        </div>
        <p className="leading-7">
          Live Sync는 블록당 <strong>~500ms 내 처리</strong> — 12초 슬롯 기준 여유 충분.<br />
          혼잡 블록에서도 1.5초 이내 완료 → RPC 지연 없음.<br />
          Reth의 저지연 실행 덕분에 validator 노드도 부담 없이 운영 가능.
        </p>

        {/* ── ExEx 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExEx 이벤트 스트림</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">ExExNotification enum</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded border border-green-500/30 bg-green-500/5 p-3">
                <p className="text-xs font-bold text-green-500">ChainCommitted</p>
                <p className="text-sm text-foreground/70"><code>new: Arc&lt;Chain&gt;</code> — 새 블록 추가</p>
              </div>
              <div className="rounded border border-orange-500/30 bg-orange-500/5 p-3">
                <p className="text-xs font-bold text-orange-500">ChainReorged</p>
                <p className="text-sm text-foreground/70"><code>old</code> + <code>new: Arc&lt;Chain&gt;</code> — reorg</p>
              </div>
              <div className="rounded border border-red-500/30 bg-red-500/5 p-3">
                <p className="text-xs font-bold text-red-400">ChainReverted</p>
                <p className="text-sm text-foreground/70"><code>old: Arc&lt;Chain&gt;</code> — 블록 제거</p>
              </div>
            </div>
          </div>
          <div className="rounded border border-border/40 bg-muted/20 p-3 text-sm text-foreground/70">
            ExEx는 notifications 스트림을 순회하며 이벤트 처리. 완료 시 <code>ExExEvent::FinishedHeight</code>로 prune 허용 알림. 노드 프로세스 내부 실행 → 별도 DB/Kafka/WebSocket 불필요, 지연 수 ms.
          </div>
        </div>
        <p className="leading-7">
          ExEx가 <strong>실시간 블록 이벤트 스트림</strong>을 제공.<br />
          인덱서, 브릿지, MEV bot 등이 노드 내부에서 직접 구독 가능.<br />
          별도 인프라(Kafka, WebSocket) 없이 ms 수준 지연으로 이벤트 수신.
        </p>
      </div>

      {/* ExEx events */}
      <h3 className="text-lg font-semibold mb-3">ExExNotification 이벤트</h3>
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {LIVE_EVENTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEvent(activeEvent === e.id ? null : e.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEvent === e.id ? e.color : 'var(--color-border)',
              background: activeEvent === e.id ? `${e.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: e.color }}>{e.name}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selEvent && (
          <motion.div key={selEvent.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: selEvent.color }}>{selEvent.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{selEvent.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reorg handling */}
      <h3 className="text-lg font-semibold mb-3">Reorg 처리 단계</h3>
      <div className="not-prose space-y-2 mb-4">
        {REORG_STEPS.map(s => (
          <button key={s.step}
            onClick={() => setActiveReorg(activeReorg === s.step ? null : s.step)}
            className="w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeReorg === s.step ? '#6366f1' : 'var(--color-border)',
              background: activeReorg === s.step ? '#6366f110' : undefined,
            }}>
            <div className="flex gap-3 items-center">
              <span className="font-mono text-xs font-bold text-foreground/50 shrink-0">Step {s.step}</span>
              <span className="text-sm font-medium">{s.title}</span>
            </div>
            <AnimatePresence>
              {activeReorg === s.step && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                  className="text-sm text-foreground/70 mt-2 pl-12">{s.desc}</motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>ExEx = 노드 내부 확장</strong> — 별도 인프라 없이 블록 이벤트를 지연 없이 처리한다.<br />
          느린 ExEx는 프루닝을 지연시켜 디스크 사용량이 증가할 수 있으므로, FinishedHeight 시그널로 처리 완료를 알린다.
        </p>
      </div>
    </section>
  );
}
