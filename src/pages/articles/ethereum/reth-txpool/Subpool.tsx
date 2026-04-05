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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`fn decide_subpool(
    tx: &ValidTx,
    sender_account: &Account,
    base_fee: u64,
) -> SubpoolKind {
    // 1. nonce gap 확인
    if tx.nonce() > sender_account.nonce {
        return SubpoolKind::Queued;  // nonce gap
    }

    // 2. fee 충족 확인
    let effective_tip = tx.effective_tip_per_gas(base_fee);
    if effective_tip.is_none() {
        return SubpoolKind::BaseFee;  // fee 부족
    }

    // 3. nonce OK + fee OK → Pending
    SubpoolKind::Pending
}

// 예시 TX들의 분류:
//
// tx1: sender=A, nonce=5 (A.nonce=5), max_fee=100, base_fee=30
//   nonce == 5 ✓
//   effective_tip = min(tip, 100-30) > 0 ✓
//   → Pending

// tx2: sender=B, nonce=7 (B.nonce=5), max_fee=100
//   nonce > 5 (gap: need nonce=5,6 먼저)
//   → Queued

// tx3: sender=C, nonce=10 (C.nonce=10), max_fee=20, base_fee=30
//   nonce == 10 ✓
//   max_fee(20) < base_fee(30) → fee 부족
//   → BaseFee

// tx4: sender=D, nonce=3 (D.nonce=5)
//   nonce < 5 → REJECTED (stale)

// 블록 후 재분류 예시:
// 이전 블록 확정 → A.nonce 6으로 증가
// → A의 nonce=6 TX가 Queued에서 Pending으로 승격`}
        </pre>
        <p className="leading-7">
          서브풀 분류는 <strong>nonce + fee 2차원</strong>으로 결정.<br />
          가장 흔한 경우: nonce 맞고 fee 충족 → Pending.<br />
          nonce는 맞지만 fee 부족 → BaseFee (base_fee 하락 대기).
        </p>

        {/* ── on_canonical_state_change ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">on_canonical_state_change — 블록 후 재분류</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub fn on_canonical_state_change(
    &mut self,
    block_info: BlockInfo,
    pending_block_base_fee: u64,
    new_mined_transactions: Vec<TxHash>,
) {
    // 1. 새로 채굴된 TX들 제거 (블록에 포함됨)
    for tx_hash in new_mined_transactions {
        self.remove_transaction(&tx_hash);
    }

    // 2. base_fee 변동 처리
    let old_base_fee = self.base_fee;
    self.base_fee = pending_block_base_fee;

    if pending_block_base_fee < old_base_fee {
        // base_fee 하락 → BaseFee → Pending 승격 검사
        let promoted = self.basefee_subpool.promote_fee_eligible(
            pending_block_base_fee
        );
        for tx in promoted {
            self.pending_subpool.insert(tx);
        }
    } else if pending_block_base_fee > old_base_fee {
        // base_fee 상승 → Pending → BaseFee 강등 검사
        let demoted = self.pending_subpool.demote_fee_insufficient(
            pending_block_base_fee
        );
        for tx in demoted {
            self.basefee_subpool.insert(tx);
        }
    }

    // 3. sender nonce 업데이트 → Queued 해소 검사
    for (sender, new_nonce) in block_info.sender_nonce_updates {
        let promoted = self.queued_subpool.promote_by_nonce(sender, new_nonce);
        for tx in promoted {
            // fee 확인 후 Pending/BaseFee로
            self.insert_by_fee(tx, pending_block_base_fee);
        }
    }

    // 4. 서브풀 크기 제한 — eviction
    self.enforce_limits();
}`}
        </pre>
        <p className="leading-7">
          매 블록마다 <strong>전체 풀 재분류</strong> — base_fee + nonce 변동 반영.<br />
          승격/강등은 서브풀 간 이동 (HashMap entry 이동).<br />
          sender nonce 증가 시 Queued → Pending 연쇄 승격 가능.
        </p>

        {/* ── eviction 정책 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Eviction — 풀 초과 시 제거</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`fn enforce_limits(&mut self) {
    // 전체 TX 개수 제한 (기본 10K)
    while self.total_count() > self.max_tx_count {
        // 우선순위가 가장 낮은 TX 제거
        // 정책: effective_tip가 가장 낮은 것부터
        let lowest_priority_tx = self.find_lowest_priority();
        self.remove_transaction(&lowest_priority_tx);
        // 메트릭: evicted count 증가
    }

    // sender별 슬롯 제한 (기본 16)
    for (sender, count) in self.per_sender_counts() {
        if count > self.max_account_slots {
            // 해당 sender의 가장 높은 nonce TX 제거
            // (이후 nonce의 TX는 어차피 Queued)
            let highest_nonce_tx = self.find_highest_nonce(sender);
            self.remove_transaction(&highest_nonce_tx);
        }
    }

    // 총 메모리 제한
    while self.total_bytes() > self.max_pool_bytes {
        self.remove_lowest_priority_tx();
    }
}

// Eviction 원칙:
// 1. Pending 먼저 유지 (블록 포함 가능성 높음)
// 2. 낮은 priority (fee)부터 제거
// 3. 같은 sender 많은 경우 높은 nonce 먼저 제거 (어차피 못 실행)

// 보호 TX:
// - Local origin TX는 eviction 제외 (사용자 RPC)
// - private mempool TX는 별도 한도`}
        </pre>
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
