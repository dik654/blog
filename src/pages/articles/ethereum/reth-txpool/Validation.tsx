import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import ValidationDetailViz from './viz/ValidationDetailViz';
import { VALIDATION_STEPS, TRAIT_ADVANTAGES } from './ValidationData';
import type { CodeRef } from '@/components/code/types';

export default function Validation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TransactionValidator trait</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX가 풀에 추가되기 전, <code>TransactionValidator::validate()</code>가 6단계 검증을 수행한다.<br />
          잘못된 TX가 풀에 들어가면 블록 생성 시 실행 실패가 발생한다.<br />
          이 검증이 게이트키퍼 역할을 한다.
        </p>
        <p className="leading-7">
          검증 순서는 <strong>비용이 낮은 것부터</strong> 수행한다.<br />
          체인 ID 비교(O(1))가 가장 먼저, ecrecover(secp256k1 복구)가 두 번째다.<br />
          잔액과 nonce 검증은 상태 DB 조회가 필요하므로 나중에 한다.<br />
          한 단계라도 실패하면 즉시 거부한다.
        </p>
        <p className="leading-7">
          <strong>trait 기반의 확장성:</strong> Geth의 <code>validateTx()</code>는 모든 검증을 하나의 함수에 하드코딩한다.<br />
          Reth는 trait이므로 L2 체인이 추가 검증(예: L1 fee 확인, 시퀀서 우선권)을 구현체 교체로 추가할 수 있다.
        </p>

        {/* ── 6단계 검증 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">6단계 검증 — 비용 순서대로</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">EthTxValidator::validate(<code>&amp;self</code>, <code>tx</code>) &#8594; <code>ValidationOutcome</code></p>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-indigo-400 font-bold">1</span>
              <div>
                <p className="text-xs text-foreground/70"><strong>Chain ID</strong> 검증 — O(1), ~ns</p>
                <p className="text-xs text-foreground/50"><code>tx.chain_id() != self.chain_id</code> &#8594; InvalidChainId</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-indigo-400 font-bold">2</span>
              <div>
                <p className="text-xs text-foreground/70"><strong>크기 제한</strong> — O(1), ~ns</p>
                <p className="text-xs text-foreground/50"><code>tx.size() &gt; MAX_TX_INPUT_BYTES</code> &#8594; TxTooLarge</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-amber-400 font-bold">3</span>
              <div>
                <p className="text-xs text-foreground/70"><strong>서명 검증</strong> &amp; sender 복구 — ~50 us (가장 비싼 연산)</p>
                <p className="text-xs text-foreground/50"><code>tx.recover_signer()</code> &#8594; secp256k1 ecrecover</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-amber-400 font-bold">4</span>
              <div>
                <p className="text-xs text-foreground/70"><strong>Gas limit</strong> 검증 — O(1)</p>
                <p className="text-xs text-foreground/50">상한/하한(<code>intrinsic_gas</code>) 체크</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-emerald-400 font-bold">5</span>
              <div>
                <p className="text-xs text-foreground/70"><strong>잔고</strong> 검증 — DB 조회 ~us</p>
                <p className="text-xs text-foreground/50"><code>account.balance &lt; tx.max_cost()</code> &#8594; InsufficientFunds</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-emerald-400 font-bold">6</span>
              <div>
                <p className="text-xs text-foreground/70"><strong>Nonce</strong> 검증 — DB 조회 ~us</p>
                <p className="text-xs text-foreground/50"><code>tx.nonce() &lt; account.nonce</code> &#8594; NonceTooLow (nonce &gt; account.nonce는 Queued 풀로 OK)</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs text-foreground/50">총 ~120 us/TX. 1~4: ~100 us, 5~6: DB 조회 ~10 us each. 10K TX/s throughput 지원</p>
          </div>
        </div>
        <p className="leading-7">
          검증 순서는 <strong>빠른 체크 먼저</strong> — 스팸 TX를 DB 조회 전에 조기 거부.<br />
          ecrecover가 가장 비싼 연산 (~50μs) → chain_id/size 체크 통과 후에만 수행.<br />
          잔고/nonce는 DB 조회 필요 → 서명 검증 통과 후에만 수행.
        </p>

        {/* ── L2 커스텀 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">L2 확장 — OpTxValidator 예시</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">OpTxValidator&lt;V: <code>TransactionValidator</code>&gt;</p>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs text-foreground/60"><code>inner: V</code> — 기본 Ethereum 검증 포함. <code>l1_block_info: Arc&lt;L1BlockInfo&gt;</code></p>
          </div>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="text-xs font-bold text-indigo-400 mb-1">1. 기본 Ethereum 검증</p>
              <p className="text-xs text-foreground/60"><code>self.inner.validate(tx)</code> 먼저 수행. invalid면 즉시 반환</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">2a. Deposit TX 거부</p>
              <p className="text-xs text-foreground/60"><code>tx.is_deposit()</code> &#8594; TX 풀에 추가 불가</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
              <p className="text-xs font-bold text-amber-400 mb-1">2b. L1 fee 포함 잔고 검증</p>
              <p className="text-xs text-foreground/60"><code>total_cost = max_cost() + l1_fee</code>. balance 부족 시 InsufficientFundsWithL1Fee</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">2c. 시퀀서 ordering 힌트</p>
              <p className="text-xs text-foreground/60">Private origin TX &#8594; <code>sequencer.enqueue_priority(tx)</code></p>
            </div>
          </div>
          <p className="text-xs text-foreground/50">기본 Ethereum 로직 재사용 (<code>inner</code> 위임). L2 고유 규칙만 추가. Base, Scroll 등도 동일 패턴</p>
        </div>
        <p className="leading-7">
          OP Stack은 <code>OpTxValidator</code>가 <strong>Ethereum 검증 + L1 fee + deposit 규칙</strong> 추가.<br />
          기본 trait을 <code>inner</code>로 감싸서 위임 → 코드 중복 없이 확장.<br />
          새 L2 체인은 동일 패턴으로 자체 검증 주입 가능.
        </p>

        {/* ── async 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">async 검증 — 동시 처리</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">add_external_transactions(<code>txs: Vec&lt;Tx&gt;</code>) &#8594; <code>Vec&lt;Result&lt;TxHash, PoolError&gt;&gt;</code></p>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs text-foreground/60">모든 TX 검증을 <code>tokio::join_all</code>로 동시 실행. Valid &#8594; <code>add_to_subpool</code>, Invalid &#8594; <code>PoolError</code></p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">순차 검증</p>
              <p className="text-xs text-foreground/60">100 TX * 120us = <strong>12ms</strong></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">동시 검증</p>
              <p className="text-xs text-foreground/60">max(120us) + join = <strong>~150us</strong> (~80배 가속)</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">주의사항</p>
            <p className="text-xs text-foreground/60">state DB: MVCC 스냅샷 &#8594; 동시 읽기 안전. 서브풀 삽입: HashMap mutex &#8594; 직렬화 지점</p>
            <p className="text-xs text-foreground/50 mt-1">실질 가속: ~10~20배 (삽입 직렬화 때문)</p>
          </div>
        </div>
        <p className="leading-7">
          async 검증으로 <strong>TX 배치를 동시 처리</strong>.<br />
          네트워크 버스트(100 TX 한꺼번에)를 12ms → 150μs로 처리.<br />
          MVCC 스냅샷 덕분에 state 읽기는 lock 없이 동시 가능.
        </p>
      </div>

      <div className="not-prose mb-6"><ValidationDetailViz /></div>

      {/* 검증 단계 카드 */}
      <h3 className="text-lg font-semibold mb-3">6단계 검증 체인</h3>
      <div className="space-y-2 mb-6">
        {VALIDATION_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {s.order}
              </span>
              <div>
                <span className="font-semibold text-sm">{s.check}</span>
                <p className="text-xs font-mono text-red-400/70">{s.failReason}</p>
              </div>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* trait 장점 Q&A */}
      <h3 className="text-lg font-semibold mb-3">설계 판단</h3>
      <div className="space-y-2 mb-6">
        {TRAIT_ADVANTAGES.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('tx-validator', codeRefs['tx-validator'])} />
        <span className="text-[10px] text-muted-foreground self-center">TransactionValidator trait</span>
      </div>
    </section>
  );
}
