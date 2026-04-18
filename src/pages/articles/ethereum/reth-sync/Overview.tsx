import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import SyncStrategyViz from './viz/SyncStrategyViz';
import type { CodeRef } from '@/components/code/types';
import { SYNC_MODES, SYNC_COMPARISONS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = SYNC_MODES.find(m => m.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동기화 모드 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움 노드의 동기화란, 제네시스 블록부터 현재까지의 상태를 확보하는 과정이다.<br />
          2024년 기준 블록 번호가 2000만에 가까우므로, 전략 선택이 노드 운영 비용을 좌우한다.
        </p>
        <p className="leading-7">
          Reth는 세 가지 동기화 모드를 지원한다.<br />
          각 모드는 보안성과 속도의 트레이드오프가 다르다.<br />
          아래 카드를 클릭하면 각 모드의 설계 판단을 확인할 수 있다.
        </p>

        {/* ── 3가지 모드 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 동기화 모드</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">Full Sync</p>
              <p className="text-sm text-foreground/80">제네시스부터 모든 블록 실행 → 전체 역사 재현. 매 블록 검증(신뢰 불필요).</p>
              <p className="text-xs text-foreground/50 mt-2">~하루 / ~2.5TB(archive) / validator, archive 용</p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">Snap Sync</p>
              <p className="text-sm text-foreground/80">특정 블록의 상태 스냅샷을 피어에서 다운로드. 그 이후 블록만 실행.</p>
              <p className="text-xs text-foreground/50 mt-2">~수 시간 / ~500GB / 빠른 부팅, RPC 서버</p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs font-bold text-purple-500 mb-2">Live Sync</p>
              <p className="text-sm text-foreground/80">이미 동기화된 노드가 tip 추적. CL이 FCU로 새 블록 알림. 블록당 ~50ms.</p>
              <p className="text-xs text-foreground/50 mt-2">운영 중 노드 유지 전용</p>
            </div>
          </div>
          <div className="rounded border border-border/40 bg-muted/20 p-3 text-sm text-foreground/60">
            전환: Full → Live(tip 도달 시) / Snap → Live(스냅샷 + 최근 블록 처리 완료 시)
          </div>
        </div>
        <p className="leading-7">
          3가지 모드는 <strong>용도별 선택지</strong>.<br />
          Full은 "완전한 역사 확보", Snap은 "빠른 부팅", Live는 "tip 추적".<br />
          일반 사용자는 Snap → Live, validator는 Full → Live, archive는 Full 유지.
        </p>

        {/* ── FCU 기반 동기화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FCU — CL과 EL의 동기화 트리거</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">ForkchoiceUpdatedV3 (CL → EL)</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li><code>head_block_hash: B256</code> — 현재 체인 head</li>
                <li><code>safe_block_hash: B256</code> — 다음 epoch 안전 블록</li>
                <li><code>finalized_block_hash: B256</code> — 되돌릴 수 없는 블록</li>
                <li><code>payload_attributes: Option&lt;PayloadAttributes&gt;</code> — 블록 생성 요청</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">EL 응답 — PayloadStatus</p>
              <div className="space-y-1 text-sm">
                <div className="flex gap-2 text-foreground/80"><span className="text-green-500 shrink-0">VALID</span> 이미 실행 완료, head 업데이트</div>
                <div className="flex gap-2 text-foreground/80"><span className="text-red-400 shrink-0">INVALID</span> 블록 검증 실패, CL에 거부 알림</div>
                <div className="flex gap-2 text-foreground/80"><span className="text-yellow-500 shrink-0">SYNCING</span> 블록 미확보, 백그라운드 다운로드 중</div>
              </div>
            </div>
          </div>
          <div className="rounded border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-foreground/70">
            PoS 이후 EL은 CL에 완전히 종속 — CL이 head 결정, EL은 지시에 따라 실행 & 업데이트. 동기화 시작도 FCU가 트리거.
          </div>
        </div>
        <p className="leading-7">
          <strong>PoS 전환 이후 EL은 CL의 명령을 따름</strong>.<br />
          FCU가 "이 블록이 head다"라고 알려주면 EL은 그 블록까지 동기화.<br />
          Pre-PoS 시절 EL이 자체 fork-choice로 tip을 결정하던 것과 근본적 차이.
        </p>

        {/* ── BlockchainTree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockchainTree — canonical/non-canonical 체인 관리</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">BlockchainTree 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>canonical_head: B256</code> — canonical chain tip</span>
              <span><code>finalized: BlockNumber</code> — 되돌릴 수 없는 블록</span>
              <span><code>blocks: HashMap&lt;B256, ExecutedBlock&gt;</code> — 최대 128 블록</span>
              <span><code>children: HashMap&lt;B256, Vec&lt;B256&gt;&gt;</code> — fork 추적</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">insert_block()</p>
              <p className="text-sm text-foreground/80">블록 실행 & 검증 → 부모가 canonical이면 확장(<code>BlockStatus::Valid</code>), 아니면 fork 후보 추가(<code>BlockStatus::Accepted</code>).</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-purple-500 mb-2">update_canonical()</p>
              <p className="text-sm text-foreground/80">FCU에 따라 canonical chain 재결정. canonical → non-canonical: unwind / non-canonical → canonical: apply.</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>BlockchainTree</code>가 <strong>reorg 처리의 핵심</strong>.<br />
          여러 fork 후보를 메모리에 유지 → CL이 다른 fork를 선택하면 즉시 canonical 전환.<br />
          128 블록 (~25분) 깊이까지 reorg 지원 — PoS finality 전까지의 버퍼.
        </p>
      </div>

      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {SYNC_MODES.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{m.role}</p>
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

      {/* Comparison table */}
      <div className="not-prose overflow-x-auto mb-6">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">항목</th>
            <th className="border border-border px-4 py-2 text-left">Full</th>
            <th className="border border-border px-4 py-2 text-left">Snap</th>
            <th className="border border-border px-4 py-2 text-left">Live</th>
          </tr></thead>
          <tbody>
            {SYNC_COMPARISONS.map(c => (
              <tr key={c.aspect}>
                <td className="border border-border px-4 py-2 font-medium">{c.aspect}</td>
                <td className="border border-border px-4 py-2">{c.full}</td>
                <td className="border border-border px-4 py-2">{c.snap}</td>
                <td className="border border-border px-4 py-2">{c.live}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><SyncStrategyViz /></div>
    </section>
  );
}
