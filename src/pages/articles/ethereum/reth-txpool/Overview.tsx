import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import TxPoolViz from './viz/TxPoolViz';
import { DESIGN_CHOICES, POOL_DEFAULTS } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">풀 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          트랜잭션 풀(mempool)은 블록에 포함되기 전 TX가 대기하는 인메모리 저장소다.<br />
          단순한 큐가 아니다.<br />
          TX를 검증하고, 우선순위를 매기고, nonce gap을 관리하고, base fee 변동에 따라 재분류해야 한다.
        </p>
        <p className="leading-7">
          Reth는 TX 풀을 세 개의 서브풀로 나눈다.<br />
          <strong>Pending</strong>(즉시 실행 가능), <strong>BaseFee</strong>(nonce OK, fee 부족), <strong>Queued</strong>(nonce gap 존재).<br />
          블록이 도착하면 base fee와 nonce 상태가 바뀌고, TX가 서브풀 간에 승격(promote)되거나 강등(demote)된다.
        </p>
        <p className="leading-7">
          <strong>핵심 설계: trait 기반 교체.</strong><br />
          <code>TransactionValidator</code>가 검증 로직을, <code>TransactionOrdering</code>이 정렬 기준을 담당한다.<br />
          Geth는 이 로직이 하드코딩되어 있어 변경하려면 포크가 필요하다.<br />
          Reth는 trait 구현체를 교체하여 L2 검증이나 MEV 정렬을 주입할 수 있다.
        </p>

        {/* ── TransactionPool trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TransactionPool trait — 핵심 API</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">TransactionPool: <code>Send + Sync</code></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400">add_transaction(<code>origin</code>, <code>tx</code>)</p>
              <p className="text-[11px] text-foreground/50">TX 풀에 추가 (검증 후). origin: Local / External / Private</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400">get(<code>tx_hash</code>)</p>
              <p className="text-[11px] text-foreground/50">해시로 TX 조회 &#8594; <code>Option&lt;Arc&lt;Tx&gt;&gt;</code></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-amber-400">best_transactions()</p>
              <p className="text-[11px] text-foreground/50">블록 생성용 priority 정렬 iterator</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-amber-400">on_new_block(<code>block_info</code>)</p>
              <p className="text-[11px] text-foreground/50">블록 확정 후 포함된 TX 제거</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-emerald-400">on_reorg(<code>reverted_txs</code>)</p>
              <p className="text-[11px] text-foreground/50">reorg 시 TX 재삽입</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-emerald-400">stats()</p>
              <p className="text-[11px] text-foreground/50">풀 통계 (PoolStats)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">주요 구현체</p>
              <p className="text-xs text-foreground/50"><code>PoolInner&lt;V, T&gt;</code> (기본 in-memory), <code>BlobPool</code> (EIP-4844), <code>NoopTransactionPool</code> (테스트)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">TransactionOrigin</p>
              <p className="text-xs text-foreground/50">Local (노드 RPC), External (피어 전파), Private (Flashbots 등)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>TransactionPool</code>은 <strong>모든 mempool 구현의 공통 API</strong>.<br />
          PayloadBuilder, RPC, Network 등 상위 모듈이 trait 뒤에서 동작 → 구현 교체 자유.<br />
          <code>best_transactions()</code>가 핵심 — priority 정렬된 iterator 제공.
        </p>

        {/* ── TX 상태 전이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 상태 전이 — 3개 서브풀 간 이동</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="text-xs font-bold text-emerald-400">Pending</p>
              <p className="text-[11px] text-foreground/50">nonce OK + fee OK &#8594; 즉시 블록 포함</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
              <p className="text-xs font-bold text-amber-400">BaseFee</p>
              <p className="text-[11px] text-foreground/50">nonce OK + fee 부족 &#8594; base_fee 하락 대기</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="text-xs font-bold text-indigo-400">Queued</p>
              <p className="text-[11px] text-foreground/50">nonce gap 존재 &#8594; 이전 nonce 대기</p>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">새 TX 도착</p>
              <p className="text-xs text-foreground/60"><code>sender.nonce == tx.nonce</code> &#8594; Pending or BaseFee / <code>&lt;</code> &#8594; Queued / <code>&gt;</code> &#8594; Rejected</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">새 블록 도착 (base_fee 변동)</p>
              <p className="text-xs text-foreground/60">하락: BaseFee &#8594; Pending 승격 / 상승: Pending &#8594; BaseFee 강등</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">이전 TX 확정 (nonce 증가)</p>
              <p className="text-xs text-foreground/60">Queued에서 gap 해소 &#8594; Pending 승격. 잔고 부족 시 &#8594; 제거</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          3개 서브풀이 <strong>실시간으로 TX를 재분류</strong>.<br />
          블록마다 base_fee 변동 → Pending/BaseFee 간 이동 발생.<br />
          이전 TX 확정 → Queued의 gap 해소된 TX들 Pending으로 승격.
        </p>

        {/* ── pool 기본값 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pool 기본 설정값 & 의미</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">PoolConfig</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400 mb-1">max_tx_count: <code>usize</code></p>
              <p className="text-xs text-foreground/60">전체 TX 개수 상한. 기본: <strong className="text-foreground/80">10,000</strong></p>
              <p className="text-xs text-foreground/50">~200B/TX = 최대 2MB. 현대 노드에서 부담 없음</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-indigo-400 mb-1">max_account_slots: <code>usize</code></p>
              <p className="text-xs text-foreground/60">sender별 최대 TX 수. 기본: <strong className="text-foreground/80">16</strong></p>
              <p className="text-xs text-foreground/50">이상은 거부 (spam 방지). 대부분 EOA는 2~3개만 사용</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-amber-400 mb-1">max_tx_input_bytes: <code>usize</code></p>
              <p className="text-xs text-foreground/60">총 TX 크기 상한. 기본: <strong className="text-foreground/80">128KB</strong></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-amber-400 mb-1">blob_transactions: <code>BlobTxConfig</code></p>
              <p className="text-xs text-foreground/60">max_blob_count: <strong>6</strong> / max_blob_size: <strong>128KB</strong></p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="font-mono text-xs text-emerald-400 mb-1">price_bumps: <code>PriceBumpConfig</code></p>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/60">
              <p>일반 TX: <strong>10%</strong> 상승 필요 (같은 nonce 교체)</p>
              <p>blob TX: <strong>100%</strong> 상승 필요 (저장소 비용 큼)</p>
            </div>
            <p className="text-xs text-foreground/50 mt-1">스팸 replacement 공격 방지</p>
          </div>
        </div>
        <p className="leading-7">
          기본값은 <strong>메모리 안전성 + 스팸 방지</strong>의 타협.<br />
          10K TX 풀 크기가 현실적 수요 대응 (일반적으로 수천 TX 활성).<br />
          price_bump 10%가 정당한 TX 교체와 스팸 공격의 경계.
        </p>
      </div>

      {/* 설계 판단 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{ borderColor: selected === d.id ? d.color : 'var(--color-border)', background: selected === d.id ? `${d.color}10` : undefined }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2"><strong>문제:</strong> {sel.problem}</p>
            <p className="text-sm text-foreground/80 leading-relaxed"><strong>해결:</strong> {sel.solution}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 풀 기본값 */}
      <h3 className="text-lg font-semibold mb-3">풀 기본 설정</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">항목</th>
              <th className="text-left p-3 font-semibold">값</th>
              <th className="text-left p-3 font-semibold">비고</th>
            </tr>
          </thead>
          <tbody>
            {POOL_DEFAULTS.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.metric}</td>
                <td className="p-3 font-mono text-amber-400">{r.value}</td>
                <td className="p-3 text-foreground/60">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><TxPoolViz /></div>
    </section>
  );
}
