import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import ExExFlowViz from './viz/ExExFlowViz';
import type { CodeRef } from '@/components/code/types';
import { EXEX_CONCEPTS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = EXEX_CONCEPTS.find(c => c.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ExEx 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>ExEx(Execution Extensions)</strong>는 Reth만의 고유 확장 모델이다.<br />
          블록 실행 이벤트를 노드 프로세스 내부에서 직접 수신하여 처리한다.<br />
          별도 인프라(메시지 큐, 외부 인덱서) 없이 인덱서, 브릿지, 분석 도구를 구현할 수 있다.
        </p>
        <p className="leading-7">
          기존 방식의 문제 — 블록 데이터를 외부로 보내려면 RPC 폴링이나 WebSocket 구독이 필요했다.<br />
          네트워크 지연, 재시도 로직, 연결 관리 등 부수적인 복잡성이 발생한다.<br />
          ExEx는 같은 프로세스에서 직접 이벤트를 받으므로 이 복잡성을 제거한다.
        </p>
        <p className="leading-7">
          ExEx는 4개 핵심 개념으로 구성된다.<br />
          아래 카드를 클릭하면 각 개념의 역할과 설계 판단을 확인할 수 있다.
        </p>

        {/* ── ExEx 프레임워크 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExEx 프레임워크 — 노드 내부 확장</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">ExExContext 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>notifications: Receiver&lt;ExExNotification&gt;</code> — 이벤트 스트림</span>
              <span><code>events: Sender&lt;ExExEvent&gt;</code> — 노드로 완료 알림</span>
              <span><code>provider: Node::Provider</code> — 상태 조회</span>
              <span><code>pool: Node::Pool</code> — TX pool 접근</span>
              <span><code>network: Node::Network</code> — 네트워크 접근</span>
              <span><code>config: NodeConfig</code>, <code>exex_id: String</code></span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">ExEx 등록 패턴</p>
            <p className="text-sm text-foreground/80 mb-1">
              async 함수가 <code>ExExContext</code>를 받아 <code>notifications</code> 스트림 순회. 완료 시 <code>ExExEvent::FinishedHeight</code> 전송.
            </p>
            <p className="text-sm text-foreground/70">
              등록: <code>NodeBuilder::new(config).install_exex("name", |ctx| Box::pin(my_exex(ctx))).launch()</code>
            </p>
          </div>
        </div>
        <p className="leading-7">
          <code>ExExContext</code>가 <strong>ExEx의 모든 인터페이스</strong>.<br />
          이벤트 수신 + provider/pool/network 접근 + 제어 채널 통합.<br />
          노드 빌더의 <code>install_exex</code>로 간단히 등록.
        </p>

        {/* ── 설계 모티베이션 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExEx vs 외부 인덱서 비교</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-red-400 mb-2">외부 인덱서 (전통적)</p>
              <p className="text-sm text-foreground/80">Reth → RPC/WS → Indexer → Custom DB. 2개 프로세스 관리, 네트워크 latency(localhost도 수 ms), 재연결 로직, 이벤트 유실 가능.</p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">ExEx (Reth 내부)</p>
              <p className="text-sm text-foreground/80">단일 프로세스. zero-copy 이벤트 전달(micro-sec). 연결 관리 불필요. 블록 이벤트 보장(no loss). provider 직접 접근.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">Helios indexer</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">Gnosis Safe 추적기</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">OP/Scroll sequencer</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">MEV Searcher bot</div>
          </div>
        </div>
        <p className="leading-7">
          ExEx의 핵심 가치: <strong>같은 프로세스</strong>.<br />
          네트워크 latency, 재연결, 이벤트 유실 등 외부 인덱서의 전통적 문제 해결.<br />
          단일 바이너리 배포 → 운영 복잡성 극적 감소.
        </p>

        {/* ── FinishedHeight ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FinishedHeight — Backpressure 관리</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">ExExEvent — Backpressure 시그널</p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>FinishedHeight(BlockNumber)</code> — "이 높이까지 처리 완료". 노드가 이 높이 이하 데이터를 안전하게 prune 가능.
            </p>
            <p className="text-sm text-foreground/70">ExEx가 느리면: canonical chain은 진행하지만 미처리 블록 데이터는 prune 금지 → 디스크 사용 증가.</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">올바른 ExEx 패턴</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>ChainCommitted</code>: 블록 순회 → <code>index_block()</code> → <code>FinishedHeight</code> 전송</p>
              <p><code>ChainReorged</code>: old 인덱스 제거 → new 인덱싱 → <code>FinishedHeight</code> 전송</p>
            </div>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">모니터링: lag = node_tip - finished_height. lag &gt; 1000 블록 = ExEx 성능 문제 경보.</p>
          </div>
        </div>
        <p className="leading-7">
          <code>FinishedHeight</code> 이벤트가 <strong>prune 허용 시그널</strong>.<br />
          ExEx가 해당 높이 처리 완료 → 노드가 그 이하 데이터 prune 가능.<br />
          느린 ExEx → lag 증가 → 디스크 사용 증가 (운영자 경보 필요).
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {EXEX_CONCEPTS.map(c => (
          <button key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === c.id ? c.color : 'var(--color-border)',
              background: selected === c.id ? `${c.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{c.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">{sel.why}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><ExExFlowViz /></div>
    </section>
  );
}
