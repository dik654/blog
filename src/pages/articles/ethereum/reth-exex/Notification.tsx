import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import NotificationDetailViz from './viz/NotificationDetailViz';
import type { CodeRef } from '@/components/code/types';
import { NOTIFICATION_EVENTS } from './NotificationData';

export default function Notification({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const sel = NOTIFICATION_EVENTS.find(e => e.id === activeEvent);

  return (
    <section id="notification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ExExNotification 스트림</h2>
      <div className="not-prose mb-8"><NotificationDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('exex-notification', codeRefs['exex-notification'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExNotification</span>
          <CodeViewButton onClick={() => onCodeRef('exex-manager', codeRefs['exex-manager'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExManager</span>
          <CodeViewButton onClick={() => onCodeRef('exex-context', codeRefs['exex-context'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExContext</span>
        </div>
        <p className="leading-7">
          ExExNotification은 3종의 체인 이벤트를 정의한다.<br />
          모든 이벤트가 <code>Arc&lt;Chain&gt;</code>으로 감싸져 있어, clone 시 블록 데이터를 복사하지 않는다.<br />
          10개 ExEx가 동시에 구독해도 메모리에는 블록 데이터 1벌만 존재한다.
        </p>
        <p className="leading-7">
          ExExManager가 send_notification()을 호출하면, 등록된 모든 ExEx에 이벤트가 fan-out된다.<br />
          각 ExEx는 자신의 속도로 이벤트를 처리하고, 완료 시 FinishedHeight를 보고한다.
        </p>

        {/* ── ExExNotification enum ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">ExExNotification — 3가지 이벤트</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-1">ChainCommitted</p>
              <p className="text-sm text-foreground/70"><code>new: Arc&lt;Chain&gt;</code></p>
              <p className="text-xs text-foreground/50 mt-1">새 블록 canonical 추가</p>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
              <p className="text-xs font-bold text-orange-500 mb-1">ChainReorged</p>
              <p className="text-sm text-foreground/70"><code>old</code> + <code>new: Arc&lt;Chain&gt;</code></p>
              <p className="text-xs text-foreground/50 mt-1">old 제거 → new 적용</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-red-400 mb-1">ChainReverted</p>
              <p className="text-sm text-foreground/70"><code>old: Arc&lt;Chain&gt;</code></p>
              <p className="text-xs text-foreground/50 mt-1">canonical에서 블록 제거</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Chain 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>blocks: BTreeMap&lt;BlockNumber, SealedBlockWithSenders&gt;</code></span>
              <span><code>state: ExecutionOutcome</code> — 실행 결과</span>
              <span><code>first</code>/<code>tip: BlockNumber</code> — 범위</span>
              <span>메서드: <code>blocks()</code>, <code>execution_outcome()</code>, <code>tip()</code></span>
            </div>
            <p className="text-sm text-foreground/60 mt-2"><code>Arc&lt;Chain&gt;</code>: clone O(1)(참조 카운터만), 여러 ExEx가 공유 → 메모리 한 벌.</p>
          </div>
        </div>
        <p className="leading-7">
          3가지 이벤트로 <strong>canonical chain 변화 전체 표현</strong>.<br />
          Committed/Reorged/Reverted로 모든 시나리오 커버.<br />
          <code>Arc&lt;Chain&gt;</code>으로 zero-copy 공유 — 메모리 효율 극대화.
        </p>

        {/* ── Chain 상세 접근 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Chain — 블록 + 실행 결과 통합</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">Chain 데이터 활용</p>
          <div className="space-y-1 text-sm text-foreground/80 mb-3">
            <p>1. <code>chain.blocks()</code> 순회 → <code>block.number</code>, <code>body.transactions</code>, <code>header.gas_used</code></p>
            <p>2. <code>block.body.transactions.iter().zip(&amp;block.senders)</code>로 TX + sender 쌍 접근</p>
            <p>3. <code>chain.execution_outcome()</code> → <code>bundle.state()</code>로 계정 변경, <code>receipts</code>로 event log 접근</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">TX hash+sender</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">event logs</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">계정 변경</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">storage 변경</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">gas/timestamp</div>
          </div>
        </div>
        <p className="leading-7">
          <code>Chain</code>이 <strong>블록 + 실행 결과 통합 표현</strong>.<br />
          ExEx는 이 하나의 struct에서 모든 필요한 정보 접근.<br />
          별도 DB 쿼리 없이 in-memory 데이터로 인덱싱 완료.
        </p>

        {/* ── Fan-out 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExExManager — 다중 ExEx fan-out</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">ExExManager</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li><code>exexes: Vec&lt;ExExHandle&gt;</code> — 등록된 ExEx 목록</li>
                <li><code>min_finished_height: BlockNumber</code> — 모든 ExEx의 최소 완료 높이</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">ExExHandle</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li><code>id: String</code></li>
                <li><code>sender: UnboundedSender&lt;ExExNotification&gt;</code></li>
                <li><code>finished_height: BlockNumber</code></li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">send_notification — fan-out</p>
            <p className="text-sm text-foreground/80 mb-1">
              <code>Arc::new(notification)</code> 후 모든 ExEx에 <code>arc_notif.clone()</code> 전송 — 데이터 복사 없음.
            </p>
            <p className="text-sm text-foreground/70">
              <code>on_exex_finished_height</code>: 모든 ExEx 최소값 갱신 → <code>set_prune_height</code> 호출.
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">10개 ExEx 등록해도 메모리 1벌. 가장 느린 ExEx가 전체 prune 속도 결정.</p>
          </div>
        </div>
        <p className="leading-7">
          ExExManager가 <strong>N:M fan-out</strong> 수행.<br />
          하나의 Arc&lt;Chain&gt;을 모든 ExEx에 clone → 메모리 1벌만 유지.<br />
          min_finished_height로 가장 느린 ExEx 추적 → prune 안전성 보장.
        </p>
      </div>

      {/* Event type cards */}
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {NOTIFICATION_EVENTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEvent(activeEvent === e.id ? null : e.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEvent === e.id ? e.color : 'var(--color-border)',
              background: activeEvent === e.id ? `${e.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: e.color }}>{e.name}</p>
            <p className="text-xs text-foreground/60 mt-1">{e.desc}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground/80"><span className="text-foreground/50">페이로드:</span> {sel.payload}</p>
              <p className="text-foreground/80"><span className="text-foreground/50">처리 예시:</span> {sel.handling}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Arc fan-out의 효율성</strong> — Arc&lt;Chain&gt;의 clone은 원자적 참조 카운트 증가(1 CPU 명령어)뿐이다.<br />
          수 MB의 블록 데이터를 복사하는 것과는 차원이 다른 성능을 제공한다.
        </p>
      </div>
    </section>
  );
}
