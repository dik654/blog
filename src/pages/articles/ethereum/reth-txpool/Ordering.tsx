import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import OrderingDetailViz from './viz/OrderingDetailViz';
import { ORDERING_IMPLS, ORDERING_COMPARISON } from './OrderingData';
import type { CodeRef } from '@/components/code/types';

export default function Ordering({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('CoinbaseTipOrdering (기본)');

  return (
    <section id="ordering" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TransactionOrdering & 우선순위</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX 풀에서 어떤 TX를 먼저 블록에 포함할지 결정하는 것이 <code>TransactionOrdering</code> trait이다.<br />
          <code>priority()</code> 메서드가 각 TX에 대해 정렬 키(<code>PriorityValue</code>)를 반환한다.<br />
          높은 값이 높은 우선순위다.
        </p>
        <p className="leading-7">
          기본 구현인 <code>CoinbaseTipOrdering</code>은 <code>effective_tip_per_gas(base_fee)</code>를 호출하여 팁이 높은 TX를 우선한다.<br />
          이 값이 검증자의 블록 수익을 직접 결정하므로 합리적인 기본값이다.
        </p>
        <p className="leading-7">
          <strong>MEV 빌더 통합:</strong> trait 설계 덕분에 Flashbots의 rbuilder 같은 MEV 빌더가 자체 정렬 로직을 주입할 수 있다.<br />
          번들 수익/가스 비율, 특정 주소 우선 정렬 등 다양한 전략이 가능하다.<br />
          Geth는 core/txpool에 하드코딩되어 있어 포크(mev-geth)가 필요하다.
        </p>

        {/* ── trait 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TransactionOrdering trait</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">TransactionOrdering: <code>Send + Sync + 'static</code></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400 mb-1">type PriorityValue: <code>Ord + Clone</code></p>
              <p className="text-xs text-foreground/50">정렬 키 타입 (연관 타입으로 유연 정의)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400 mb-1">priority(<code>tx</code>, <code>base_fee</code>)</p>
              <p className="text-xs text-foreground/50">&#8594; <code>Priority::Value(T)</code> 또는 <code>Priority::None</code> (포함 불가)</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="font-mono text-xs text-amber-400 mb-1">CoinbaseTipOrdering (기본 구현)</p>
            <p className="text-xs text-foreground/60"><code>PriorityValue = u128</code>. <code>effective_tip_per_gas(base_fee)</code> 호출</p>
            <p className="text-xs text-foreground/50 mt-1"><code>Some(tip)</code> &#8594; <code>Priority::Value(tip)</code> / <code>None</code> &#8594; <code>Priority::None</code></p>
          </div>
          <p className="text-xs text-foreground/50">PoolInner가 <code>BTreeSet&lt;(PriorityValue, TxHash)&gt;</code> 유지. <code>best_transactions()</code>가 역순 iterate (high &#8594; low)</p>
        </div>
        <p className="leading-7">
          <code>TransactionOrdering</code> trait이 <strong>정렬 기준 추상화</strong>.<br />
          <code>type PriorityValue</code> 연관 타입으로 정렬 키 타입 유연하게 정의.<br />
          <code>Priority::None</code>은 "이 TX는 현재 블록에 포함 불가" 표시.
        </p>

        {/* ── best_transactions iterator ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">best_transactions() — priority 내림차순 iterator</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">best_transactions() &#8594; <code>Box&lt;dyn Iterator&lt;Item = Arc&lt;Tx&gt;&gt;&gt;</code></p>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-indigo-400 font-bold">1</span>
              <div>
                <p className="text-xs text-foreground/70">Pending 서브풀의 정렬된 <code>BTreeSet</code> 순회</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-amber-400 font-bold">2</span>
              <div>
                <p className="text-xs text-foreground/70"><code>sender_nonce_tracker: HashMap&lt;Address, u64&gt;</code>로 nonce 연속성 확인</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-emerald-400 font-bold">3</span>
              <div>
                <p className="text-xs text-foreground/70">같은 sender TX는 nonce 순서대로만 반환. 다음 nonce가 아니면 건너뜀</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">PayloadBuilder 사용 패턴</p>
            <p className="text-xs text-foreground/60"><code>best_transactions()</code> 순회하며 <code>gas_used + tx.gas_limit() &gt; gas_limit(30M)</code>까지 블록에 채움</p>
            <p className="text-xs text-foreground/50 mt-1">priority 순 + nonce 순 이중 정렬 &#8594; 검증자 수익 최대화</p>
          </div>
        </div>
        <p className="leading-7">
          <code>best_transactions()</code>는 <strong>priority 순 + nonce 순</strong> 이중 정렬.<br />
          priority 높은 TX부터 반환하되, 같은 sender는 nonce 연속성 유지.<br />
          PayloadBuilder가 gas_limit 채울 때까지 이 iterator 순회.
        </p>

        {/* ── MEV 정렬 예시 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MEV Bundle Ordering — 커스텀 구현</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">BundleAwareOrdering</p>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs text-foreground/60"><code>bundle_scores: Arc&lt;DashMap&lt;TxHash, u128&gt;&gt;</code> — 번들 수익 점수</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="text-xs font-bold text-red-400 mb-1">Bundle TX</p>
              <p className="text-xs text-foreground/60"><code>bundle_scores</code>에 존재 &#8594; <code>BundlePriority::Bundle(score)</code></p>
              <p className="text-xs text-foreground/50 mt-1">항상 Normal보다 우선 (Ord 구현)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="text-xs font-bold text-indigo-400 mb-1">Normal TX</p>
              <p className="text-xs text-foreground/60"><code>effective_tip_per_gas(base_fee)</code> &#8594; <code>BundlePriority::Normal(tip)</code></p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">Flashbots 빌더 통합 흐름</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
              <span>1. <code>eth_sendBundle</code> 수신</span>
              <span>&#8594;</span>
              <span>2. 수익 계산 &#8594; bundle_scores 저장</span>
              <span>&#8594;</span>
              <span>3. <code>best_transactions()</code> 시 번들 TX 먼저</span>
              <span>&#8594;</span>
              <span>4. 블록에 포함</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>MEV 빌더는 trait 교체만으로 통합</strong>.<br />
          번들을 우선 정렬하는 커스텀 ordering 삽입 → 나머지 파이프라인 코드 수정 없음.<br />
          Reth가 rbuilder 등 외부 빌더 프레임워크의 <strong>기반 라이브러리</strong>로 활용되는 이유.
        </p>
      </div>

      <div className="not-prose mb-6"><OrderingDetailViz /></div>

      {/* 구현체별 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">정렬 구현체</h3>
      <div className="not-prose space-y-2 mb-6">
        {ORDERING_IMPLS.map(o => {
          const isOpen = expanded === o.name;
          return (
            <div key={o.name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : o.name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm" style={{ color: o.color }}>{o.name}</p>
                  <p className="text-xs font-mono text-foreground/60 mt-0.5">{o.key}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{o.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Geth vs Reth 비교 */}
      <h3 className="text-lg font-semibold mb-3">Geth vs Reth 비교</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">항목</th>
              <th className="text-left p-3 font-semibold">Geth</th>
              <th className="text-left p-3 font-semibold">Reth</th>
            </tr>
          </thead>
          <tbody>
            {ORDERING_COMPARISON.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.aspect}</td>
                <td className="p-3 text-red-400">{r.geth}</td>
                <td className="p-3 text-emerald-400">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('tx-ordering', codeRefs['tx-ordering'])} />
        <span className="text-[10px] text-muted-foreground self-center">CoinbaseTipOrdering</span>
      </div>
    </section>
  );
}
