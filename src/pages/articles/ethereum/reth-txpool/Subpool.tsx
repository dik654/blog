import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import SubpoolDetailViz from './viz/SubpoolDetailViz';
import { SUBPOOLS, STATE_CHANGES } from './SubpoolData';
import type { CodeRef } from '@/components/code/types';

export default function Subpool({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('Pending');

  return (
    <section id="subpool" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pending / Queued / BaseFee 서브풀</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX는 <code>add_transaction()</code>에서 검증을 통과한 뒤 nonce 연속성과 fee 조건에 따라 세 서브풀 중 하나에 배치된다.<br />
          Pending은 "지금 당장 블록에 포함 가능", BaseFee는 "nonce OK, fee 부족", Queued는 "선행 nonce TX가 없음"을 의미한다.
        </p>
        <p className="leading-7">
          새 블록이 도착하면 <code>on_canonical_state_change()</code>가 호출된다.<br />
          base fee가 변동하면 BaseFee와 Pending 사이에서 승격/강등이 발생한다.<br />
          nonce gap이 해소되면 Queued에서 Pending이나 BaseFee로 승격한다.<br />
          서브풀 한도를 초과하면 priority가 가장 낮은 TX를 퇴출(eviction)한다.
        </p>
        <p className="leading-7">
          Reth는 EIP-4844 blob TX를 위한 별도 <code>BlobPool</code>도 관리한다.<br />
          blob TX는 일반 TX보다 크기가 크다(최대 ~128KB/blob).<br />
          별도 풀로 분리해야 메모리 관리가 가능하다.
        </p>

        {/* ── 배치 결정 로직 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">서브풀 배치 결정 로직</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">decide_subpool(<code>tx</code>, <code>sender_account</code>, <code>base_fee</code>) &#8594; <code>SubpoolKind</code></p>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="text-xs font-bold text-indigo-400 mb-1">1. nonce gap &#8594; Queued</p>
              <p className="text-xs text-foreground/60"><code>tx.nonce() &gt; sender_account.nonce</code></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
              <p className="text-xs font-bold text-amber-400 mb-1">2. fee 부족 &#8594; BaseFee</p>
              <p className="text-xs text-foreground/60"><code>effective_tip_per_gas(base_fee).is_none()</code></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400 mb-1">3. nonce OK + fee OK &#8594; Pending</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-xs font-semibold text-emerald-400">tx1 &#8594; Pending</p>
              <p className="text-[11px] text-foreground/50">A: nonce=5(=5), fee=100&gt;30</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-xs font-semibold text-indigo-400">tx2 &#8594; Queued</p>
              <p className="text-[11px] text-foreground/50">B: nonce=7(&gt;5), gap</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-xs font-semibold text-amber-400">tx3 &#8594; BaseFee</p>
              <p className="text-[11px] text-foreground/50">C: nonce OK, fee=20&lt;30</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-xs font-semibold text-red-400">tx4 &#8594; Rejected</p>
              <p className="text-[11px] text-foreground/50">D: nonce=3(&lt;5), stale</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          서브풀 분류는 <strong>nonce + fee 2차원</strong>으로 결정.<br />
          가장 흔한 경우: nonce 맞고 fee 충족 → Pending.<br />
          nonce는 맞지만 fee 부족 → BaseFee (base_fee 하락 대기).
        </p>

        {/* ── on_canonical_state_change ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">on_canonical_state_change — 블록 후 재분류</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">on_canonical_state_change(<code>block_info</code>, <code>pending_base_fee</code>, <code>mined_txs</code>)</p>
          <div className="space-y-2">
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-indigo-400 font-bold">1</span>
              <div>
                <p className="text-xs font-bold text-foreground/70">채굴된 TX 제거</p>
                <p className="text-xs text-foreground/50">블록에 포함된 TX들을 풀에서 <code>remove_transaction</code></p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-amber-400 font-bold">2</span>
              <div>
                <p className="text-xs font-bold text-foreground/70">base_fee 변동 처리</p>
                <p className="text-xs text-foreground/50">하락: BaseFee &#8594; Pending (<code>promote_fee_eligible</code>) / 상승: Pending &#8594; BaseFee (<code>demote_fee_insufficient</code>)</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-emerald-400 font-bold">3</span>
              <div>
                <p className="text-xs font-bold text-foreground/70">sender nonce 업데이트</p>
                <p className="text-xs text-foreground/50">Queued gap 해소 &#8594; <code>promote_by_nonce</code> &#8594; fee 확인 후 Pending/BaseFee</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-red-400 font-bold">4</span>
              <div>
                <p className="text-xs font-bold text-foreground/70">서브풀 크기 제한</p>
                <p className="text-xs text-foreground/50"><code>enforce_limits()</code> &#8594; 초과 시 eviction</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          매 블록마다 <strong>전체 풀 재분류</strong> — base_fee + nonce 변동 반영.<br />
          승격/강등은 서브풀 간 이동 (HashMap entry 이동).<br />
          sender nonce 증가 시 Queued → Pending 연쇄 승격 가능.
        </p>

        {/* ── eviction 정책 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Eviction — 풀 초과 시 제거</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">enforce_limits()</p>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70">전체 TX 개수 제한 (기본 10K)</p>
              <p className="text-xs text-foreground/60"><code>total_count() &gt; max_tx_count</code> &#8594; lowest priority TX부터 제거 (effective_tip 최소)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70">sender별 슬롯 제한 (기본 16)</p>
              <p className="text-xs text-foreground/60"><code>count &gt; max_account_slots</code> &#8594; 해당 sender의 최고 nonce TX 제거 (어차피 Queued)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70">총 메모리 제한</p>
              <p className="text-xs text-foreground/60"><code>total_bytes() &gt; max_pool_bytes</code> &#8594; lowest priority TX 제거</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">Eviction 원칙</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p>1. Pending 먼저 유지 (포함 가능성 높음)</p>
                <p>2. 낮은 priority(fee)부터 제거</p>
                <p>3. 같은 sender &#8594; 높은 nonce 먼저</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">보호 TX</p>
              <p className="text-xs text-foreground/60">Local origin: eviction 제외 (사용자 RPC)</p>
              <p className="text-xs text-foreground/60">Private mempool: 별도 한도</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Eviction은 <strong>풀 크기 제한 위반 시</strong> 자동 실행.<br />
          낮은 priority TX 먼저 제거 → 높은 수익 TX 우선 유지.<br />
          Local origin(이 노드 RPC 제출) TX는 보호 — 사용자 제출이므로.
        </p>
      </div>

      <div className="not-prose mb-6"><SubpoolDetailViz /></div>

      {/* 서브풀별 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">서브풀별 상세</h3>
      <div className="not-prose space-y-2 mb-6">
        {SUBPOOLS.map(s => {
          const isOpen = expanded === s.name;
          return (
            <div key={s.name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : s.name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm" style={{ color: s.color }}>{s.name}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.condition}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3 space-y-1">
                      <p className="text-xs text-emerald-400">승격: {s.promoteTo}</p>
                      <p className="text-xs text-red-400">강등: {s.demoteFrom}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed mt-2">{s.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 상태 변경 이벤트 */}
      <h3 className="text-lg font-semibold mb-3">상태 변경 이벤트</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">이벤트</th>
              <th className="text-left p-3 font-semibold">동작</th>
            </tr>
          </thead>
          <tbody>
            {STATE_CHANGES.map((e, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{e.event}</td>
                <td className="p-3 text-foreground/70">{e.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('pool-add', codeRefs['pool-add'])} />
        <span className="text-[10px] text-muted-foreground self-center">Pool::add_transaction()</span>
      </div>
    </section>
  );
}
