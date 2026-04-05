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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait TransactionPool: Send + Sync {
    type Transaction: PoolTransaction;

    /// TX 풀에 추가 (검증 후)
    async fn add_transaction(
        &self,
        origin: TransactionOrigin,  // Local, External, Private
        tx: Self::Transaction,
    ) -> Result<TxHash, PoolError>;

    /// 해시로 TX 조회
    fn get(&self, tx_hash: &TxHash) -> Option<Arc<Self::Transaction>>;

    /// 블록 생성용 TX iterator (priority 순)
    fn best_transactions(&self)
        -> Box<dyn Iterator<Item = Arc<Self::Transaction>>>;

    /// 블록 확정 후 포함된 TX 제거
    fn on_new_block(&self, block_info: &BlockInfo);

    /// reorg 시 TX 재삽입
    fn on_reorg(&self, reverted_txs: Vec<TxHash>);

    /// 풀 통계
    fn stats(&self) -> PoolStats;
}

// 주요 구현체:
// - PoolInner<V, T>: 기본 구현 (in-memory)
// - BlobPool: EIP-4844 blob TX 전용
// - NoopTransactionPool: 테스트용 (항상 비어있음)

// TransactionOrigin 종류:
// - Local: 이 노드의 RPC로 제출
// - External: 다른 피어에서 전파받음
// - Private: Flashbots 등 private mempool`}
        </pre>
        <p className="leading-7">
          <code>TransactionPool</code>은 <strong>모든 mempool 구현의 공통 API</strong>.<br />
          PayloadBuilder, RPC, Network 등 상위 모듈이 trait 뒤에서 동작 → 구현 교체 자유.<br />
          <code>best_transactions()</code>가 핵심 — priority 정렬된 iterator 제공.
        </p>

        {/* ── TX 상태 전이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 상태 전이 — 3개 서브풀 간 이동</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 3개 서브풀 정의
// 1. Pending: nonce OK + fee 충족 → 즉시 블록 포함 가능
// 2. BaseFee: nonce OK + fee 부족 → base_fee 하락 대기
// 3. Queued: nonce gap 존재 → 이전 nonce TX 대기

// 상태 전이 예시:

// [새 TX 도착]
//   sender.nonce == tx.nonce  → Pending or BaseFee
//   sender.nonce < tx.nonce   → Queued (gap)
//   sender.nonce > tx.nonce   → Rejected (old nonce)

// [새 블록 도착 — base_fee 변동]
//   base_fee 하락:
//     BaseFee 풀 TX 중 effective_tip 가능해진 것들 → Pending 승격
//   base_fee 상승:
//     Pending 풀 TX 중 effective_tip 부족해진 것들 → BaseFee 강등

// [이전 TX 확정 — nonce 증가]
//   Queued 풀에서 gap 해소된 TX → Pending 승격

// [sender 잔고 변경]
//   잔고 부족으로 TX 실행 불가 → 제거

// 상태 머신:
//        [new TX]
//            ↓
//        nonce 확인
//       /    |    \\
//    Pending BaseFee Queued
//       ↕       ↕        ↕
//     (fee 변동, nonce 진전)`}
        </pre>
        <p className="leading-7">
          3개 서브풀이 <strong>실시간으로 TX를 재분류</strong>.<br />
          블록마다 base_fee 변동 → Pending/BaseFee 간 이동 발생.<br />
          이전 TX 확정 → Queued의 gap 해소된 TX들 Pending으로 승격.
        </p>

        {/* ── pool 기본값 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pool 기본 설정값 & 의미</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct PoolConfig {
    /// 전체 TX 개수 상한
    pub max_tx_count: usize,  // default: 10_000

    /// sender별 최대 TX 수 (nonce list 길이)
    pub max_account_slots: usize,  // default: 16

    /// 총 TX 크기 상한 (bytes)
    pub max_tx_input_bytes: usize,  // default: 131_072 (128KB)

    /// blob TX 추가 제한
    pub blob_transactions: BlobTxConfig {
        max_blob_count: 6,    // 블록당 max blob
        max_blob_size: 131_072, // KZG 4096 elements × 32B
    },

    /// 가격 bump 비율 (replacement)
    pub price_bumps: PriceBumpConfig {
        default_price_bump: 10,  // 10% 상승 필요
        blob_price_bump: 100,    // blob은 100% 상승 필요
    },
}

// max_tx_count 10,000의 의미:
// - 일반 TX는 ~200 bytes → 최대 2MB 메모리
// - blob TX 1개는 ~130KB → 100개만 있어도 13MB
// - 합계 ~수십 MB (현대 노드에서 부담 없음)

// max_account_slots 16:
// - 한 sender가 16개 nonce까지 풀에 유지
// - 이 이상은 거부 (spam 방지)
// - 대부분의 EOA는 동시 2~3 nonce만 사용

// price_bump 10%:
// - 같은 nonce의 TX를 replace하려면 가격 10% 이상 증가 필요
// - 스팸 replacement 공격 방지
// - blob TX는 저장소 비용 커서 100% 요구`}
        </pre>
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
