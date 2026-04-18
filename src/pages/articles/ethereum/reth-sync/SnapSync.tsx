import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SnapDetailViz from './viz/SnapDetailViz';
import { SNAP_PHASES } from './SnapSyncData';

export default function SnapSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const sel = SNAP_PHASES.find(p => p.id === activePhase);

  return (
    <section id="snap-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Snap Sync 상태 다운로드</h2>
      <div className="not-prose mb-8"><SnapDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-snap', codeRefs['sync-snap'])} />
          <span className="text-[10px] text-muted-foreground self-center">SnapSync 전체</span>
        </div>
        <p className="leading-7">
          Snap Sync는 블록을 재실행하지 않고, 피어에서 최신 상태를 직접 다운로드한다.<br />
          핵심 아이디어 — 1800만 블록의 중간 상태 전이는 건너뛰고, 결과만 받는다.
        </p>
        <p className="leading-7">
          보안은 Merkle proof로 보장한다.<br />
          각 청크마다 피어가 proof를 첨부하고, 수신 측은 알려진 state root에 대해 검증한다.<br />
          proof가 유효하지 않으면 해당 피어의 응답을 거부하고 다른 피어에게 재요청한다.
        </p>
        <p className="leading-7">
          다운로드는 4단계로 진행된다.<br />
          아래 카드를 클릭하면 각 단계의 상세 동작을 확인할 수 있다.
        </p>

        {/* ── snap 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth/snap 프로토콜 — 상태 범위 쿼리</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">snap/1 프로토콜 메시지 (EIP-2364)</p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
              <div className="text-foreground/80"><code>GetAccountRange</code> — 계정 범위 요청. <code>root_hash</code>(기준 state_root), <code>origin</code>~<code>limit</code> 해시 구간, <code>response_bytes</code>(최대 응답 크기).</div>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">2</span>
              <div className="text-foreground/80"><code>AccountRange</code> — 응답. <code>accounts: Vec&lt;(B256, SlimAccount)&gt;</code>(정렬 목록) + <code>proof: Vec&lt;Bytes&gt;</code>(범위 증명).</div>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
              <span className="font-mono text-xs text-green-500 shrink-0">3</span>
              <div className="text-foreground/80"><code>GetStorageRanges</code> — 컨트랙트 스토리지 요청. <code>accounts: Vec&lt;B256&gt;</code>(타겟 계정들), origin~limit slot 해시.</div>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
              <span className="font-mono text-xs text-purple-500 shrink-0">4</span>
              <div className="text-foreground/80"><code>GetByteCodes</code> — 컨트랙트 바이트코드. <code>hashes: Vec&lt;B256&gt;</code>(code_hash 목록).</div>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
              <span className="font-mono text-xs text-orange-500 shrink-0">5</span>
              <div className="text-foreground/80"><code>GetTrieNodes</code> — 누락 trie 노드(healing). <code>paths: Vec&lt;Vec&lt;Bytes&gt;&gt;</code>.</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          snap 프로토콜은 <strong>범위 쿼리 기반</strong> — origin~limit 구간을 한 번에 전송.<br />
          응답에 Merkle proof 포함 → 수신자가 독립적으로 검증.<br />
          5가지 메시지로 전체 상태(account + storage + code + trie) 다운로드 가능.
        </p>

        {/* ── Merkle proof 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Range Proof 검증 — 완전성 증명</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">verify_account_range — Range Proof 검증</p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
              <span className="text-foreground/80">accounts 정렬 확인 — <code>windows(2)</code>로 순서 검증. 미정렬 시 <code>NotSorted</code>.</span>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">2</span>
              <span className="text-foreground/80"><code>origin</code>/<code>limit</code> 범위 내 확인. 벗어나면 <code>OutOfRange</code>.</span>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">3</span>
              <span className="text-foreground/80"><code>verify_range_proof()</code>로 trie 경로 재구성 → <code>state_root</code> 비교. 불일치 시 <code>ProofMismatch</code>.</span>
            </div>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-3">범위 경계의 trie path만으로 내부 계정 완전성 보장. 악의적 피어가 계정 누락 시 proof 검증 실패.</p>
        </div>
        <p className="leading-7">
          Range Proof는 <strong>"이 범위에 다른 계정이 없다"</strong>까지 증명.<br />
          origin/limit 경계의 trie path만 받으면 내부 계정 목록의 완전성 보장.<br />
          악의적 피어가 중간 계정을 빼먹으면 proof 검증 실패 → 거부.
        </p>

        {/* ── Healing 단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Healing — 변경분 최종 정합성</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Snap Sync 타임라인</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center mb-2">
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">T=0</p><p className="text-xs text-foreground/40">다운로드 시작(S0)</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">T=0~2h</p><p className="text-xs text-foreground/40">Account/Storage 다운로드</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/60">T=2h</p><p className="text-xs text-foreground/40">완료, 현재 root=S1</p></div>
            </div>
            <p className="text-sm text-red-400">문제: S0 스냅샷 vs 현재 S1 불일치 — 변경된 계정/슬롯의 trie 노드가 다름.</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-green-500 mb-2">heal_trie — Healing Phase</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. S0 → S1 사이 블록들 실행(normal block execution)</p>
              <p>2. 누락 trie 노드 감지 → <code>GetTrieNodes</code>로 추가 요청</p>
              <p>3. <code>compute_state_root()</code> → <code>target_root</code> 비교. 불일치 시 <code>HealingFailed</code>.</p>
            </div>
            <p className="text-sm text-foreground/60 mt-2">소요 시간: 변경 블록 수에 비례, 보통 수십 분 ~ 1시간.</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>Healing</strong>이 Snap Sync의 정체성 — "스냅샷 + 변경분 보정".<br />
          다운로드 중 체인이 진행되므로 최종 state_root까지 따라잡기 필요.<br />
          누락 trie 노드를 GetTrieNodes로 추가 요청하여 정합성 확보.
        </p>

        {/* ── 총 소요시간 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Snap Sync 전체 단계별 소요 시간</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Snap Sync 단계별 소요 시간 (2026 기준)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
              <div className="rounded border border-border/40 p-2 text-center"><p className="text-foreground/60">Phase 1: Headers</p><p className="text-xs text-foreground/40">1800만 헤더 / ~30분</p></div>
              <div className="rounded border border-border/40 p-2 text-center"><p className="text-foreground/60">Phase 2: Account</p><p className="text-xs text-foreground/40">~2.5억 계정(20GB) / ~2~4h</p></div>
              <div className="rounded border border-border/40 p-2 text-center"><p className="text-foreground/60">Phase 3: Storage</p><p className="text-xs text-foreground/40">~200GB / ~4~8h</p></div>
              <div className="rounded border border-border/40 p-2 text-center"><p className="text-foreground/60">Phase 4: Healing</p><p className="text-xs text-foreground/40">~30GB + trie / ~1~2h</p></div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-foreground/60">총 Snap Sync: <strong>~8~15시간</strong></span>
              <span className="text-foreground/50">Full Sync: ~36시간</span>
              <span className="text-green-500">약 3~5배 빠름</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded border border-border/40 p-3 text-sm">
              <p className="text-xs font-bold text-foreground/60 mb-1">Snap Sync 전제</p>
              <p className="text-foreground/70">피어가 <code>snap/1</code> 지원 + 최신 snapshot(~32 epoch 이내) + 안정적 네트워크</p>
            </div>
            <div className="rounded border border-border/40 p-3 text-sm">
              <p className="text-xs font-bold text-foreground/60 mb-1">신뢰 가정</p>
              <p className="text-foreground/70">초기 <code>state_root</code>는 CL에서 수신(CL 신뢰 필요). PoS 보안 모델과 일치 → 합리적.</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Snap Sync는 <strong>Full Sync 대비 3~5배 빠름</strong>.<br />
          블록 실행을 건너뛰고 상태 스냅샷만 받으므로 CPU 부하 크게 감소.<br />
          신뢰 가정(CL의 state_root)은 PoS 보안 모델과 일치 → 안전성 유지.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {SNAP_PHASES.map(p => (
          <button key={p.id}
            onClick={() => setActivePhase(activePhase === p.id ? null : p.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activePhase === p.id ? p.color : 'var(--color-border)',
              background: activePhase === p.id ? `${p.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: p.color }}>{p.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{p.role}</p>
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
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Healing이 필요한 이유</strong> — 다운로드에 수시간이 걸리는 동안 새 블록이 계속 생성된다.<br />
          상태가 변경된 부분의 Trie 노드가 불일치하므로, 마지막에 변경분만 다시 받아 최신 state root와 일치시킨다.
        </p>
      </div>
    </section>
  );
}
