import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { USE_CASES } from './UseCasesData';

export default function UseCases({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const sel = USE_CASES.find(c => c.id === activeCase);

  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활용 사례: 인덱서, 브릿지, 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('exex-example', codeRefs['exex-example'])} />
          <span className="text-[10px] text-muted-foreground self-center">인덱서 예제 코드</span>
        </div>
        <p className="leading-7">
          ExEx의 등록은 <code>install_exex("name", fn)</code> 한 줄이다.<br />
          NodeBuilder 패턴과 결합되어 커스텀 노드를 쉽게 확장할 수 있다.<br />
          ExEx 함수는 ExExContext를 받아 notifications 스트림을 순회하는 async 함수다.
        </p>
        <p className="leading-7">
          실전에서 가장 중요한 것은 <strong>reorg 처리</strong>다.<br />
          ChainReorged 이벤트는 old(제거될 체인)와 new(추가될 체인)를 모두 포함하므로, old를 먼저 롤백한 후 new를 적용해야 데이터 일관성을 유지할 수 있다.
        </p>

        {/* ── 사례 1: ERC20 Transfer 인덱서 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">사례 1: ERC20 Transfer 인덱서</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">ERC20 Transfer 인덱서</p>
          <p className="text-sm text-foreground/80 mb-2">
            <code>alloy_sol_types::SolEvent</code>로 Transfer 이벤트 정의. <code>sqlx::PgPool</code>로 PostgreSQL 저장.
          </p>
          <div className="space-y-1 text-sm text-foreground/80 mb-2">
            <p><strong>ChainCommitted</strong>: DB 트랜잭션 시작 → 블록별 receipt 순회 → <code>Transfer::decode_log</code> → INSERT → commit → <code>FinishedHeight</code></p>
            <p><strong>ChainReorged</strong>: <code>DELETE FROM transfers WHERE block &gt;= old.first_block()</code> → new 블록 재인덱싱 → commit</p>
          </div>
          <p className="text-sm text-foreground/60">DB 트랜잭션으로 원자성 보장. reorg 시 old 삭제 → new 적용 순서 유지.</p>
        </div>
        <p className="leading-7">
          ERC20 Transfer 인덱서의 <strong>실전 구현 예시</strong>.<br />
          모든 블록의 Transfer 이벤트 → PostgreSQL 저장 → 쿼리 가능.<br />
          reorg 시 old 블록 데이터 삭제 후 new 적용 → 일관성 유지.
        </p>

        {/* ── 사례 2: Rollup Sequencer ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">사례 2: Rollup Sequencer (L2)</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">Rollup Sequencer (OP Stack)</p>
          <p className="text-sm text-foreground/80 mb-2">
            <code>l2_state: Arc&lt;Mutex&lt;L2State&gt;&gt;</code>를 공유하여 L1 블록 이벤트를 L2 state에 반영.
          </p>
          <div className="space-y-1 text-sm text-foreground/80">
            <p>1. L1 block info 추출 — <code>number</code>, <code>hash</code>, <code>timestamp</code>, <code>base_fee</code>, <code>blob_base_fee</code></p>
            <p>2. <code>pending_l1_attributes</code>에 L1 attribute 추가</p>
            <p>3. <code>OptimismPortal</code> 주소의 Deposit event 감지 → <code>parse_deposit_event</code> → L2 메시지 변환</p>
          </div>
          <p className="text-sm text-foreground/60 mt-2">별도 L1 인덱서 불필요 — L1 노드 내부에서 직접 L2 state 업데이트.</p>
        </div>
        <p className="leading-7">
          L2 시퀀서가 <strong>L1 노드 내부에서 직접 실행</strong>.<br />
          L1 블록 이벤트 수신 → L2 state 업데이트 → deposit TX 처리.<br />
          별도 L1 인덱서 불필요 → L2 운영 단순화.
        </p>

        {/* ── 사례 3: MEV Searcher ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">사례 3: MEV Searcher Bot</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">MEV Searcher Bot</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>provider.state_at_block()</code>으로 블록 상태 로드</p>
              <p>2. <code>parse_uniswap_swap(tx)</code>로 DEX swap 감지</p>
              <p>3. <code>find_arbitrage(&amp;swap, &amp;state)</code>로 차익 기회 계산</p>
              <p>4. 수익성 확인 시 <code>flashbots_client.send_bundle(bundle, block.number + 1)</code> 제출</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">블록 즉시 알림</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">로컬 state query</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">실행 결과 직접 접근</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">이벤트 손실 없음</div>
          </div>
        </div>
        <p className="leading-7">
          MEV searcher가 <strong>노드 내부에서 실시간 기회 탐지</strong>.<br />
          외부 RPC polling 대비 latency 수백 ms → 수 ms로 단축.<br />
          블록 포함 즉시 반응 → arbitrage 경쟁에서 우위.
        </p>
      </div>

      {/* Use case cards */}
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {USE_CASES.map(c => (
          <button key={c.id}
            onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeCase === c.id ? c.color : 'var(--color-border)',
              background: activeCase === c.id ? `${c.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.label}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{c.category}</p>
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
            <p className="text-sm text-foreground/80 mb-2">{sel.desc}</p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground/70"><span className="text-foreground/50">이벤트 흐름:</span> {sel.events}</p>
              <p className="text-amber-600 dark:text-amber-400">{sel.caveat}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>느린 ExEx = 디스크 부담</strong> — ExEx가 FinishedHeight를 보고하지 않으면,
          해당 높이까지의 데이터를 프루닝할 수 없다.<br />
          무거운 분석 로직은 별도 스레드에서 비동기로 처리하고, 메인 루프에서는 빠르게 이벤트를 소비해야 한다.
        </p>
      </div>
    </section>
  );
}
